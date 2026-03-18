"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  EyeOff,
  Hash,
  Upload,
  Download,
  X,
  AlertCircle,
  Award,
  User,
  ImagePlus,
  Loader2,
  Info,
} from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { submitDonation } from "@/app/actions/submissions";

type Step = "form" | "payment" | "verification";

export default function DonationForm() {
  const [step, setStep] = useState<Step>("form");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isDraggingProof, setIsDraggingProof] = useState(false);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [fileError, setFileError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const proofInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_PROOF_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const handleProofSelect = (file: File | undefined) => {
    if (!file) return;
    setFileError("");
    if (
      !ALLOWED_PROOF_TYPES.includes(file.type) &&
      !ALLOWED_IMAGE_TYPES.includes(file.type)
    ) {
      setFileError("Only image files (PNG, JPG) and PDFs are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      return;
    }
    setProofFile(file);
  };

  const handleProfileSelect = (file: File | undefined) => {
    if (!file) return;
    setProfileError("");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setProfileError("Only image files (PNG, JPG, GIF, WebP) are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setProfileError("File size must be less than 5MB");
      return;
    }
    setProfilePic(file);
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (digits.length > 0 && digits.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    setStep("payment");
  };

  const handleFinalSubmit = async () => {
    if (!transactionRef.trim()) {
      setSubmitError("Transaction ID / UTR Number is required.");
      return;
    }
    if (!proofFile) {
      setSubmitError("Payment proof is required.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const fd = new FormData();
    fd.append("full_name", isAnonymous ? "Anonymous" : fullName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("amount", amount);
    fd.append("is_anonymous", String(isAnonymous));
    fd.append("transaction_ref", transactionRef);
    fd.append("payment_proof", proofFile);
    if (profilePic) {
      fd.append("profile_pic", profilePic);
    }

    const result = await submitDonation(fd);
    setSubmitting(false);

    if (result.success) {
      setStep("verification");
    } else {
      setSubmitError(result.error ?? "Submission failed. Please try again.");
    }
  };

  const makeDragHandlers = (
    setDragging: (v: boolean) => void,
    onFile: (f: File | undefined) => void
  ) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      onFile(e.dataTransfer.files[0]);
    },
  });

  return (
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Back Link */}
      <Link
        href="/donators"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#22d3ee] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Donators
      </Link>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {["Details", "Payment", "Verification"].map((label, i) => {
          const steps: Step[] = ["form", "payment", "verification"];
          const isActive = steps.indexOf(step) >= i;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  isActive ? "text-[#22d3ee]" : "text-gray-600"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div
                  className={`w-8 sm:w-12 h-px ${
                    isActive ? "bg-[#22d3ee]/40" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── STEP 1: Details ─── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#22d3ee]" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-white"
                    style={{
                      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    }}
                  >
                    Make a Donation
                  </h2>
                  <p className="text-sm text-gray-400">
                    Your support makes a difference
                  </p>
                </div>
              </div>

              {/* Note about email */}
              <div className="rounded-xl bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-4 mb-5">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#22d3ee] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong className="text-white">Important:</strong> Please
                    provide a correct email and phone number so our team can
                    reach out to you regarding your donation updates.
                    Donations &gt; ₹50 are eligible for certificates.
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Anonymous Toggle */}
                <div className="rounded-xl bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <EyeOff className="w-4 h-4 text-[#7c3aed]" />
                      <div>
                        <span className="text-sm font-semibold text-white">
                          Anonymous Donation
                        </span>
                        <p className="text-xs text-gray-400">
                          Your name will be hidden on the donators wall
                        </p>
                      </div>
                    </div>
                    <div
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        isAnonymous ? "bg-[#7c3aed]" : "bg-white/10"
                      }`}
                      onClick={() => setIsAnonymous(!isAnonymous)}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          isAnonymous
                            ? "translate-x-[22px]"
                            : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </label>
                </div>

                {/* Donation Amount */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Donation Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Name (unless anonymous) */}
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-gray-300 mb-2">
                      <User className="w-3.5 h-3.5 inline mr-1.5" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isAnonymous}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                      placeholder="Your full name"
                    />
                  </motion.div>
                )}

                {/* Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                      Phone (10 digits)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                        phoneError
                          ? "border-red-500/50 focus:border-red-500/80"
                          : "border-white/10 focus:border-[#22d3ee]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      }`}
                      placeholder="10-digit number"
                    />
                    {phoneError && (
                      <p className="text-xs text-red-400 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                {/* Profile Picture Upload (optional) */}
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-gray-300 mb-2">
                      <ImagePlus className="w-3.5 h-3.5 inline mr-1.5" />
                      Profile Picture (optional)
                    </label>
                    <div
                      {...makeDragHandlers(setIsDraggingProfile, handleProfileSelect)}
                      onClick={() => profileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          profileInputRef.current?.click();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload profile picture"
                      className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                        isDraggingProfile
                          ? "border-[#22d3ee] bg-[#22d3ee]/5"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleProfileSelect(e.target.files?.[0])
                        }
                      />
                      {profilePic ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                          <span className="text-sm text-gray-300 truncate max-w-[200px]">
                            {profilePic.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfilePic(null);
                              if (profileInputRef.current)
                                profileInputRef.current.value = "";
                            }}
                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <ImagePlus className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">
                            Drag &amp; drop or click to upload
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            PNG, JPG, GIF, WebP up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                    {profileError && (
                      <p className="text-xs text-red-400 mt-1">
                        {profileError}
                      </p>
                    )}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300"
                  style={{
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Payment
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: Payment ─── */}
        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-7 h-7 text-[#22d3ee]" />
              </div>
              <h2
                className="text-xl font-bold text-white mb-2"
                style={{
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                }}
              >
                Complete Payment
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Scan the QR code below or use UPI to donate
              </p>

              {/* Payment QR Code */}
              <div className="w-56 h-56 mx-auto rounded-2xl overflow-hidden bg-white flex items-center justify-center mb-6">
                <img
                  src={siteConfig.assets.paymentQr}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* UPI Button */}
              <motion.a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-sm tracking-wider hover:bg-[#22d3ee]/10 hover:border-[#22d3ee] transition-all duration-300 mb-8"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Smartphone className="w-4 h-4" />
                Pay via UPI
              </motion.a>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  then upload payment proof
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Transaction ID */}
              <div className="text-left mb-5">
                <label className="block text-sm text-gray-300 mb-2">
                  <Hash className="w-3.5 h-3.5 inline mr-1.5" />
                  Transaction ID / UTR Number
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                  placeholder="Enter transaction ID or UTR number"
                />
              </div>

              {/* File Upload Zone */}
              <div className="text-left mb-8">
                <label className="block text-sm text-gray-300 mb-2">
                  <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                  Upload Payment Proof / UPI Screenshot
                </label>
                <div
                  {...makeDragHandlers(setIsDraggingProof, handleProofSelect)}
                  onClick={() => proofInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      proofInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload payment proof file"
                  className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    isDraggingProof
                      ? "border-[#22d3ee] bg-[#22d3ee]/5"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                >
                  <input
                    ref={proofInputRef}
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    className="hidden"
                    onChange={(e) => handleProofSelect(e.target.files?.[0])}
                  />
                  {proofFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                      <span className="text-sm text-gray-300 truncate max-w-[200px]">
                        {proofFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProofFile(null);
                          if (proofInputRef.current)
                            proofInputRef.current.value = "";
                        }}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Drag &amp; drop or click to upload
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        PNG, JPG or PDF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                {fileError && (
                  <p className="text-xs text-red-400 mt-2">{fileError}</p>
                )}
              </div>

              {submitError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 mb-4">
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {submitError}
                  </p>
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <motion.button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  }}
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Payment Details
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: Verification ─── */}
        {step === "verification" && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-[#22d3ee]" />
                </div>
              </motion.div>

              <h2
                className="text-2xl font-bold text-white mb-3"
                style={{
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                }}
              >
                Payment Verification Pending
              </h2>
              <p className="text-gray-400 text-base mb-2">
                Thank you for your generous donation! Your payment is being
                verified.
              </p>
              <p className="text-[#22d3ee] text-sm font-semibold mb-6">
                Verification will be completed within 24 hours.
              </p>

              <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-left space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Once verified, you will receive an official{" "}
                    <strong className="text-white">Donator Certificate</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    {isAnonymous
                      ? 'Your donation will appear as "Anonymous Donor" on the donators wall.'
                      : "Your name and profile picture will appear on the donators wall."}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Status update:{" "}
                    <strong className="text-[#22d3ee]">Accepted</strong> or{" "}
                    <strong className="text-gray-400">Rejected</strong> within
                    24 hrs.
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-4 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] animate-pulse" />
                  <span className="text-sm font-semibold text-[#22d3ee]">
                    Pending Verification
                  </span>
                </div>
              </div>

              {/* Certificate Status */}
              {(() => {
                const donationAmount = parseFloat(amount) || 0;
                if (donationAmount < 50) {
                  return (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-left mb-8">
                      <h3
                        className="text-base font-bold text-white mb-4"
                        style={{
                          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                        }}
                      >
                        Certificate Status
                      </h3>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">
                          Certificate Status:{" "}
                          <strong className="text-red-400">Not Eligible</strong>{" "}
                          (Minimum ₹50 required)
                        </span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-6 text-left mb-8">
                    <h3
                      className="text-base font-bold text-white mb-4"
                      style={{
                        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                      }}
                    >
                      Certificate Status
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-5 h-5 text-[#22d3ee] flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Certificate Status:{" "}
                        <strong className="text-[#22d3ee]">
                          Pending Verification
                        </strong>
                      </span>
                    </div>
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm font-semibold cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Download Donator Certificate
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Certificate will be available after payment verification
                    </p>
                  </div>
                );
              })()}

              <Link href="/donators">
                <motion.span
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-sm tracking-wider hover:bg-[#22d3ee]/10 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Donators
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

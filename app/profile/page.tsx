"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, isSupabaseConfigured, ensureProfile } from "@/lib/supabaseClient";

const MAX_IMAGE_SIZE = 500 * 1024; // 500KB

function getGreeting(): string {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 22 || hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ProfilePage() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [plan, setPlan] = useState<string>("Free");
  const [bio, setBio] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [greeting] = useState(getGreeting());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email || "");

          const { data } = await supabase
            .from("profiles")
            .select("name, profile_image, plan, bio, year, department, phone")
            .eq("id", user.id)
            .maybeSingle();

          if (data) {
            setUserName(data.name || user.user_metadata?.name || user.user_metadata?.full_name || "");
            setProfileImage(data.profile_image || "");
            setPlan(data.plan || "Free");
            setBio(data.bio || "");
            setYear(data.year || "");
            setDepartment(data.department || "");
            setPhone(data.phone || "");
          } else {
            // Profile row missing — create it so future saves succeed
            await ensureProfile(user);
            setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "");
          }
        }
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("Image must be less than 500KB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Convert to base64 data URL for storage in the profile_image text column
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setProfileImage(base64);

      if (userId) {
        try {
          const { error } = await supabase
            .from("profiles")
            .upsert(
              { id: userId, profile_image: base64 },
              { onConflict: "id" }
            );
          if (error) {
            console.error("[profile] image upload error:", error);
            setUploadError("Failed to save profile image");
          }
        } catch {
          setUploadError("Failed to save profile image");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            name: userName,
            bio,
            year,
            department,
            phone,
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("[profile] save error:", error);
        setSaveMessage("Failed to save profile. Please try again.");
      } else {
        setSaveMessage("Profile updated successfully!");
        setEditing(false);
      }
    } catch {
      setSaveMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — {greeting} —
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Hello, {userName || "AstroSci Member"}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-8"
          >
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-28 h-28 rounded-full mb-4 group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] opacity-60 blur-sm" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#7c3aed]/60">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile picture"
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5H7l5-7.5V9h4l-5 7.5z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#22d3ee] hover:text-[#7c3aed] transition-colors mb-1 cursor-pointer"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Upload Photo (max 500KB)
              </button>
              <AnimatePresence>
                {uploadError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-xs mt-1"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {uploadError}
                  </motion.p>
                )}
              </AnimatePresence>
              <h2
                className="text-xl font-bold text-white mt-2"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {userName || "AstroSci Member"}
              </h2>
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {userEmail || "Not logged in"}
              </p>
            </div>

            {/* Save Message */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-3 rounded-lg text-sm text-center ${
                    saveMessage.includes("success")
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {saveMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Profile Toggle */}
            {!editing && (
              <div className="flex justify-center mb-6">
                <motion.button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border border-[#7c3aed]/60 text-[#22d3ee] hover:bg-[#7c3aed]/20 hover:border-[#7c3aed] transition-all duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Edit Profile
                </motion.button>
              </div>
            )}

            {/* Profile Details */}
            {editing ? (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                    placeholder="Your name"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label
                    className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 resize-none"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Year */}
                <div>
                  <label
                    className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    <option value="" className="bg-[#07091a]">Select Year</option>
                    <option value="1st Year" className="bg-[#07091a]">1st Year</option>
                    <option value="2nd Year" className="bg-[#07091a]">2nd Year</option>
                    <option value="3rd Year" className="bg-[#07091a]">3rd Year</option>
                    <option value="4th Year" className="bg-[#07091a]">4th Year</option>
                    <option value="Alumni" className="bg-[#07091a]">Alumni</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label
                    className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label
                    className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Save / Cancel Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                    whileHover={saving ? {} : { scale: 1.02 }}
                    whileTap={saving ? {} : { scale: 0.98 }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </motion.button>
                  <motion.button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-300"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Membership Plan
                  </span>
                  <span
                    className="text-[#22d3ee] text-sm px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {plan}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Email
                  </span>
                  <span
                    className="text-gray-300 text-sm"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {userEmail || "—"}
                  </span>
                </div>
                {bio && (
                  <div className="flex items-start justify-between py-3 border-b border-white/5">
                    <span
                      className="text-gray-500 text-sm shrink-0"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Bio
                    </span>
                    <span
                      className="text-gray-300 text-sm text-right ml-4"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {bio}
                    </span>
                  </div>
                )}
                {year && (
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Year
                    </span>
                    <span
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {year}
                    </span>
                  </div>
                )}
                {department && (
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Department
                    </span>
                    <span
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {department}
                    </span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Phone / WhatsApp
                    </span>
                    <span
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {phone}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

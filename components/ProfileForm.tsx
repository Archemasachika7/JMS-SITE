"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface ProfileFormProps {
  userId: string;
  initialName: string;
  initialBio: string;
  initialYear: string;
  initialDepartment: string;
  initialPhone: string;
  onSave: (data: {
    name: string;
    bio: string;
    year: string;
    department: string;
    phone: string;
  }) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  userId,
  initialName,
  initialBio,
  initialYear,
  initialDepartment,
  initialPhone,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [year, setYear] = useState(initialYear);
  const [department, setDepartment] = useState(initialDepartment);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            name,
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
        setSaveMessage("Profile updated successfully.");
        onSave({ name, bio, year, department, phone });
      }
    } catch {
      setSaveMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300";
  const labelClass =
    "block text-gray-400 text-xs mb-1.5 tracking-wider uppercase";
  const fontMono = { fontFamily: "'Space Mono', monospace" };

  return (
    <div className="space-y-4">
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
            style={fontMono}
          >
            {saveMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div>
        <label className={labelClass} style={fontMono}>
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          style={fontMono}
          placeholder="Your name"
        />
      </div>

      {/* Bio */}
      <div>
        <label className={labelClass} style={fontMono}>
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          style={fontMono}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Year */}
      <div>
        <label className={labelClass} style={fontMono}>
          Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={inputClass}
          style={fontMono}
        >
          <option value="" className="bg-[#07091a]">
            Select Year
          </option>
          <option value="1st Year" className="bg-[#07091a]">
            1st Year
          </option>
          <option value="2nd Year" className="bg-[#07091a]">
            2nd Year
          </option>
          <option value="3rd Year" className="bg-[#07091a]">
            3rd Year
          </option>
          <option value="4th Year" className="bg-[#07091a]">
            4th Year
          </option>
          <option value="Alumni" className="bg-[#07091a]">
            Alumni
          </option>
        </select>
      </div>

      {/* Department */}
      <div>
        <label className={labelClass} style={fontMono}>
          Department
        </label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={inputClass}
          style={fontMono}
          placeholder="e.g. Computer Science"
        />
      </div>

      {/* Phone / WhatsApp */}
      <div>
        <label className={labelClass} style={fontMono}>
          Phone / WhatsApp Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          style={fontMono}
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      {/* Save / Cancel Buttons */}
      <div className="flex gap-3 pt-2">
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          style={{ fontFamily: "'Orbitron', monospace" }}
          whileHover={saving ? {} : { scale: 1.02 }}
          whileTap={saving ? {} : { scale: 0.98 }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </motion.button>
        <motion.button
          onClick={onCancel}
          className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-300"
          style={fontMono}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );
}

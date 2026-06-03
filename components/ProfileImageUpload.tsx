"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface ProfileImageUploadProps {
  userId: string;
  profileImage: string;
  onImageUpdate: (url: string) => void;
}

export default function ProfileImageUpload({
  userId,
  profileImage,
  onImageUpdate,
}: ProfileImageUploadProps) {
  const [uploadError, setUploadError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be 2MB or less");
      return;
    }

    if (!userId) {
      setUploadError("You must be logged in to upload an image");
      return;
    }

    setUploading(true);

    try {
      const filePath = `avatars/${userId}.png`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("[profile] storage upload error:", uploadError);
        setUploadError("Failed to upload image. Please try again.");
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);

      // Append a cache-busting timestamp so browsers don't serve the
      // stale cached image after the file is replaced at the same path.
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ profile_image: avatarUrl })
        .eq("id", userId);

      if (dbError) {
        console.error("[profile] image url save error:", dbError);
        setUploadError("Failed to save profile image");
        setUploading(false);
        return;
      }

      onImageUpdate(avatarUrl);
    } catch {
      setUploadError("Failed to upload profile image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-28 h-28 rounded-full mb-4 group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#e11d48] to-[#fb7185] opacity-60 blur-sm" />
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#e11d48]/60">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#e11d48] to-[#fb7185] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-white fill-current"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
        {/* Upload overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Upload profile picture"
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer disabled:cursor-wait"
        >
          {uploading ? (
            <svg
              className="w-8 h-8 text-white animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-white fill-current"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5H7l5-7.5V9h4l-5 7.5z" />
            </svg>
          )}
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
        disabled={uploading}
        className="text-xs text-[#fb7185] hover:text-[#e11d48] transition-colors mb-1 cursor-pointer disabled:opacity-50"
        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
      <AnimatePresence>
        {uploadError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-xs mt-1"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            {uploadError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

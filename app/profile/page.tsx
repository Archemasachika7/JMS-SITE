"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import ProfileForm from "@/components/ProfileForm";
import ProfileCard from "@/components/ProfileCard";
import { supabase, ensureProfile } from "@/lib/supabaseClient";

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
  const [userId, setUserId] = useState<string>("");
  const [greeting] = useState(getGreeting());
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email || "");

          await ensureProfile(user);

          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("name, profile_image, plan, bio, year, department, phone")
            .eq("id", user.id)
            .maybeSingle();

          if (profileError) {
            console.error("[profile] Failed to fetch profile row:", profileError);
            setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "");
            return;
          }

          if (!data) {
            // This can happen if the DB trigger and ensureProfile both failed
            // to create the row (e.g. missing migration). Fall back to auth metadata.
            console.warn("[profile] No profile row found. Falling back to auth metadata.");
            setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "");
            return;
          }

          setUserName(data.name || user.user_metadata?.name || user.user_metadata?.full_name || "");
          setProfileImage(data.profile_image || "");
          setPlan(data.plan || "Free");
          setBio(data.bio || "");
          setYear(data.year || "");
          setDepartment(data.department || "");
          setPhone(data.phone || "");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[profile] sign out error:", error);
    }
    router.push("/auth");
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
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — {greeting} —
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Hello, {userName || "JMS Member"}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-8"
          >
            {/* Profile Image Upload */}
            <ProfileImageUpload
              userId={userId}
              profileImage={profileImage}
              onImageUpdate={(url) => setProfileImage(url)}
            />

            {/* Profile name and email */}
            <div className="flex flex-col items-center mb-8 -mt-4">
              <h2
                className="text-xl font-bold text-white mt-2"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {userName || "JMS Member"}
              </h2>
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                {userEmail || "Not logged in"}
              </p>
            </div>

            {/* Edit Profile Toggle */}
            {!editing && (
              <div className="flex justify-center mb-6">
                <motion.button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border border-[#2563eb]/60 text-[#38bdf8] hover:bg-[#2563eb]/20 hover:border-[#2563eb] transition-all duration-300"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
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
              <ProfileForm
                userId={userId}
                initialName={userName}
                initialBio={bio}
                initialYear={year}
                initialDepartment={department}
                initialPhone={phone}
                onSave={(data) => {
                  setUserName(data.name);
                  setBio(data.bio);
                  setYear(data.year);
                  setDepartment(data.department);
                  setPhone(data.phone);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <ProfileCard
                plan={plan}
                email={userEmail}
                bio={bio}
                year={year}
                department={department}
                phone={phone}
              />
            )}

            {/* Logout Button */}
            <div className="flex justify-center mt-8 pt-6 border-t border-white/5">
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-300"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Log Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

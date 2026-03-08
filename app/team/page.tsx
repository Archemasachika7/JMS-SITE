"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/siteConfig";

interface TeamMember {
  id: string;
  name: string;
  profile_image: string | null;
  designation: string | null;
  department: string | null;
  phone: string | null;
}

function getDesignationLevel(designation: string | null): number {
  if (!designation) return 6;
  const d = designation.toLowerCase().trim();
  if (d === "president" || d === "vice president") return 1;
  if (d === "secretary" || d === "associate secretary") return 2;
  if (d === "treasurer") return 3;
  if (d.includes("convenor") || d.includes("head")) return 4;
  if (d.includes("coordinator")) return 5;
  return 6;
}

function sortMembersByHierarchy(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    const levelA = getDesignationLevel(a.designation);
    const levelB = getDesignationLevel(b.designation);
    if (levelA !== levelB) return levelA - levelB;
    return (a.designation || "").localeCompare(b.designation || "");
  });
}

interface MemberGroup {
  level: number;
  label: string;
  members: TeamMember[];
}

function groupMembersByLevel(members: TeamMember[]): MemberGroup[] {
  const levelLabels: Record<number, string> = {
    1: "Leadership",
    2: "Secretariat",
    3: "Finance",
    4: "Convenors & Heads",
    5: "Coordinators",
    6: "Team",
  };
  const groups: Record<number, TeamMember[]> = {};
  for (const member of members) {
    const level = getDesignationLevel(member.designation);
    if (!groups[level]) groups[level] = [];
    groups[level].push(member);
  }
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)
    .map((level) => ({
      level,
      label: levelLabels[level] || "Team",
      members: groups[level],
    }));
}

const placeholderMembers: TeamMember[] = [
  { id: "1", name: "President", profile_image: null, designation: "President", department: "Physics", phone: null },
  { id: "2", name: "Vice President", profile_image: null, designation: "Vice President", department: "Astrophysics", phone: null },
  { id: "3", name: "Secretary", profile_image: null, designation: "Secretary", department: "Physics", phone: null },
  { id: "4", name: "Coordinator", profile_image: null, designation: "Outreach Coordinator", department: "Physics", phone: null },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, name, profile_image, designation, department, phone")
          .eq("role", "admin");
        if (data && data.length > 0) setMembers(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchTeam();
  }, []);

  const displayMembers = members.length > 0 ? members : placeholderMembers;
  const sortedMembers = sortMembersByHierarchy(displayMembers);
  const memberGroups = groupMembersByLevel(sortedMembers);

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Meet the Team —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              {siteConfig.clubName} Team
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              The people behind the telescope
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#07091a]/80 p-6 animate-pulse"
                >
                  <div className="w-24 h-24 rounded-full bg-[#0f172a] mx-auto mb-4" />
                  <div className="h-4 bg-[#0f172a] rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-[#0f172a] rounded w-1/2 mx-auto mb-1" />
                  <div className="h-3 bg-[#0f172a] rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {memberGroups.map((group) => (
                <div key={group.level}>
                  <h2
                    className="text-lg font-semibold text-[#38bdf8] mb-6 text-center tracking-wide uppercase"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {group.label}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
                    {group.members.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        whileHover={{ y: -6 }}
                        className="group rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-6 text-center hover:border-[#2563eb]/40 transition-all w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                      >
                        <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-[#2563eb]/30 group-hover:border-[#2563eb]/60 transition-all">
                          {member.profile_image ? (
                            <img
                              src={member.profile_image}
                              alt={member.name || "Team member"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3
                          className="text-white font-bold text-base mb-1"
                          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                        >
                          {member.name || "Team Member"}
                        </h3>
                        {member.designation && (
                          <p
                            className="text-[#38bdf8] text-sm mb-1"
                            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                          >
                            {member.designation}
                          </p>
                        )}
                        {member.department && (
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                          >
                            {member.department}
                          </p>
                        )}
                        {member.phone && (
                          <p
                            className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-1"
                            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#10b981]">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            {member.phone}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

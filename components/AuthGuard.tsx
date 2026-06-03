"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // When Supabase is not configured, allow access so local dev still works
      setAuthenticated(true);
      setChecked(true);
      return;
    }

    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAuthenticated(true);
        } else {
          router.replace("/auth?tab=signup");
        }
      } catch {
        router.replace("/auth?tab=signup");
      }
      setChecked(true);
    }

    check();
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#e11d48]/30 border-t-[#e11d48] animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}

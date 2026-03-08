"use client";

interface ProfileCardProps {
  plan: string;
  email: string;
  bio: string;
  year: string;
  department: string;
  phone: string;
}

export default function ProfileCard({
  plan,
  email,
  bio,
  year,
  department,
  phone,
}: ProfileCardProps) {
  const fontMono = { fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" };

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Membership Plan", value: plan || "Free", highlight: true },
    { label: "Email", value: email || "—" },
  ];

  if (bio) rows.push({ label: "Bio", value: bio });
  if (year) rows.push({ label: "Year", value: year });
  if (department) rows.push({ label: "Department", value: department });
  if (phone) rows.push({ label: "Phone / WhatsApp", value: phone });

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between py-3 border-b border-white/5"
        >
          <span className="text-gray-500 text-sm shrink-0" style={fontMono}>
            {row.label}
          </span>
          {row.highlight ? (
            <span
              className="text-[#38bdf8] text-sm px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30"
              style={fontMono}
            >
              {row.value}
            </span>
          ) : (
            <span
              className="text-gray-300 text-sm text-right ml-4"
              style={fontMono}
            >
              {row.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

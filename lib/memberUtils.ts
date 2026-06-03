/** Shared utilities for member star/plan display */

export function getPlanLabel(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "Monthly Scholar";
    case "annual":
      return "Annual Fellow";
    case "admin":
    case "core":
      return "Core Team";
    default:
      return "Free Member";
  }
}

export function getPlanColor(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "#FFD700";
    case "annual":
      return "#FF8C00";
    case "admin":
    case "core":
      return "#FF00FF";
    default:
      return "#ADD8E6";
  }
}

/** Resolve a user's tier from their role and plan fields */
export function resolveTier(
  role: string | undefined | null,
  plan: string | undefined | null
): string {
  const r = (role || "").toLowerCase();
  const p = (plan || "").toLowerCase();
  if (r === "admin" || r === "core") return "core";
  if (p === "annual") return "annual";
  if (p === "monthly") return "monthly";
  return "free";
}

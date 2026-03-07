/** Shared utilities for member star/plan display */

export function getPlanLabel(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "Monthly Subscriber";
    case "annual":
      return "Annual Subscriber";
    case "admin":
      return "Core Team";
    default:
      return "Free Member";
  }
}

export function getPlanColor(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "#22d3ee";
    case "annual":
      return "#a855f6";
    case "admin":
      return "#facc15";
    default:
      return "#ffffff";
  }
}

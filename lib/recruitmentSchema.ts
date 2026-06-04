// ============================================================
// Recruitment form schema
// ------------------------------------------------------------
// A recruitment drive's application form is described entirely by
// data: a list of TEAMS, each with a list of FIELDS. Admins edit
// this schema in the portal; the public page renders from it.
//
// The DEFAULT_SCHEMA below is the seed — it mirrors the club's
// existing six-team application. A drive whose `fields` column is
// empty falls back to this, so nothing is ever lost.
// ============================================================

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox";

export type RecruitField = {
  id: string;
  name: string; // submitted field name (Formspree)
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[]; // select | radio | checkbox
};

export type RecruitTeam = {
  id: string;
  label: string;
  emoji?: string;
  blurb?: string;
  fields: RecruitField[];
};

export type RecruitmentSchema = RecruitTeam[];

export const FIELD_TYPES: FieldType[] = [
  "text",
  "email",
  "tel",
  "url",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
];

export const FIELDS_WITH_OPTIONS: FieldType[] = ["select", "radio", "checkbox"];

// ── Helpers ──────────────────────────────────────────────────────────────────
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "field";
}

export function uid(prefix = "f"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** The four identity fields every team collects. */
function identity(): RecruitField[] {
  return [
    { id: uid(), name: "name", label: "Full name", type: "text", required: true, placeholder: "e.g. Ada Lovelace" },
    { id: uid(), name: "roll", label: "Roll / enrolment no.", type: "text", required: true, placeholder: "e.g. 002311001236" },
    { id: uid(), name: "branch", label: "Department & year", type: "text", required: true, placeholder: "e.g. Mathematics, 2nd year" },
    { id: uid(), name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
  ];
}

/**
 * Default six-team application — maths-flavoured. Admins can rename,
 * reorder, add or delete any of this from the portal.
 */
export const DEFAULT_SCHEMA: RecruitmentSchema = [
  {
    id: "general",
    label: "General",
    emoji: "∑",
    blurb: "Not sure where you fit? Start here — we'll route you.",
    fields: [
      ...identity(),
      { id: uid(), name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "10-digit number" },
      {
        id: uid(),
        name: "team",
        label: "Which team interests you most?",
        type: "select",
        required: true,
        options: ["Public Relations", "Design", "Tech", "Video", "Content", "Still deciding"],
      },
      { id: uid(), name: "motivation", label: "Why do you want to join JU Maths Society?", type: "textarea", required: true, help: "A few honest sentences beat a polished paragraph." },
      { id: uid(), name: "referral", label: "How did you hear about us?", type: "text", placeholder: "Friend, Instagram, a seminar…" },
    ],
  },
  {
    id: "pr",
    label: "Public Relations",
    emoji: "📣",
    blurb: "Voice of the society — outreach, socials, partnerships.",
    fields: [
      ...identity(),
      { id: uid(), name: "sm_active", label: "How active are you on social media?", type: "radio", required: true, options: ["Very", "Moderately", "Rarely"] },
      { id: uid(), name: "comfortable_on_camera", label: "Comfortable being on camera / hosting?", type: "radio", options: ["Yes", "Sometimes", "No"] },
      { id: uid(), name: "handles", label: "Your public handles (Instagram / LinkedIn / X)", type: "textarea", placeholder: "Links or @handles" },
      { id: uid(), name: "pr_past", label: "Any past outreach / PR / event work?", type: "textarea" },
      { id: uid(), name: "best_work_link", label: "Link to your best work", type: "url", placeholder: "https://…" },
      { id: uid(), name: "growth_strategy", label: "How would you grow our reach in one month?", type: "textarea", required: true },
    ],
  },
  {
    id: "design",
    label: "Design",
    emoji: "🎨",
    blurb: "Posters, identity, the look of everything we publish.",
    fields: [
      ...identity(),
      { id: uid(), name: "portfolio", label: "Portfolio / Behance / Drive link", type: "url", required: true, placeholder: "https://…" },
      { id: uid(), name: "tools", label: "Tools you use", type: "checkbox", options: ["Photoshop", "Illustrator", "Figma", "Canva", "Lightroom", "Procreate", "Blender", "Other"] },
      { id: uid(), name: "ai_use", label: "Do you use AI in your workflow?", type: "radio", options: ["Yes, often", "Occasionally", "Never"] },
      { id: uid(), name: "turnaround", label: "Typical turnaround for one poster?", type: "text", placeholder: "e.g. a few hours" },
      { id: uid(), name: "design_philosophy", label: "Describe your design philosophy in 2–3 lines", type: "textarea", required: true },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    emoji: "⚙️",
    blurb: "The website, tools, automation, the occasional ML demo.",
    fields: [
      ...identity(),
      { id: uid(), name: "stack", label: "What are you comfortable with?", type: "checkbox", options: ["Python", "Web (JS/TS/React)", "Deep Learning", "Computer Vision", "Data / SQL", "Embedded", "Other"] },
      { id: uid(), name: "github", label: "GitHub / project link", type: "url", placeholder: "https://github.com/…" },
      { id: uid(), name: "math_level", label: "Your strongest area of mathematics", type: "text", placeholder: "e.g. Number theory, Linear algebra" },
      { id: uid(), name: "ideal_project", label: "A project you'd love to build for the society", type: "textarea", required: true },
      { id: uid(), name: "weekly_hours", label: "Hours you can commit weekly", type: "number", placeholder: "e.g. 5" },
    ],
  },
  {
    id: "video",
    label: "Video",
    emoji: "🎬",
    blurb: "Reels, recaps, after-movies — cut and motion.",
    fields: [
      ...identity(),
      { id: uid(), name: "software", label: "Editing software you use", type: "checkbox", options: ["Premiere Pro", "DaVinci Resolve", "Final Cut", "CapCut", "After Effects", "Blender", "Other"] },
      { id: uid(), name: "video_work", label: "Link to a video you're proud of", type: "url", required: true, placeholder: "https://…" },
      { id: uid(), name: "style_words", label: "Describe your editing style in 3 words", type: "text" },
      { id: uid(), name: "event_footage", label: "Can you shoot event footage on campus?", type: "radio", options: ["Yes", "No"] },
      { id: uid(), name: "turnaround", label: "Turnaround for a 60-second reel?", type: "text" },
    ],
  },
  {
    id: "content",
    label: "Content",
    emoji: "✍️",
    blurb: "Captions, articles, scripts — words that explain maths well.",
    fields: [
      ...identity(),
      { id: uid(), name: "content_types", label: "What do you like writing?", type: "checkbox", options: ["Captions", "Articles", "Scripts", "Research summaries", "Newsletter", "Creative"] },
      { id: uid(), name: "writing_sample", label: "Paste a short writing sample (or a link)", type: "textarea", required: true },
      { id: uid(), name: "live_caption", label: "Live task: write a 3-line caption for Euler's identity (e^{iπ}+1=0)", type: "textarea", help: "Make a stranger feel why it's beautiful." },
      { id: uid(), name: "reading", label: "What do you read regularly?", type: "checkbox", options: ["Books", "Journals", "News", "Blogs", "Social"] },
      { id: uid(), name: "math_fascination", label: "A piece of maths that fascinates you, and why", type: "textarea", required: true },
    ],
  },
];

// ── Validation / normalisation ───────────────────────────────────────────────
function asField(raw: unknown): RecruitField | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const label = typeof r.label === "string" ? r.label.trim() : "";
  if (!label) return null;
  const type = FIELD_TYPES.includes(r.type as FieldType) ? (r.type as FieldType) : "text";
  const name = typeof r.name === "string" && r.name.trim() ? slugify(r.name) : slugify(label);
  const field: RecruitField = {
    id: typeof r.id === "string" && r.id ? r.id : uid(),
    name,
    label,
    type,
    required: Boolean(r.required),
  };
  if (typeof r.placeholder === "string" && r.placeholder.trim()) field.placeholder = r.placeholder.trim();
  if (typeof r.help === "string" && r.help.trim()) field.help = r.help.trim();
  if (FIELDS_WITH_OPTIONS.includes(type) && Array.isArray(r.options)) {
    const opts = r.options.map((o) => String(o).trim()).filter(Boolean);
    if (opts.length) field.options = opts;
  }
  return field;
}

function asTeam(raw: unknown): RecruitTeam | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const label = typeof r.label === "string" ? r.label.trim() : "";
  if (!label) return null;
  const fields = Array.isArray(r.fields)
    ? (r.fields.map(asField).filter(Boolean) as RecruitField[])
    : [];
  return {
    id: typeof r.id === "string" && r.id ? r.id : slugify(label),
    label,
    emoji: typeof r.emoji === "string" ? r.emoji : undefined,
    blurb: typeof r.blurb === "string" ? r.blurb : undefined,
    fields,
  };
}

/**
 * Turn arbitrary JSON (from the DB or a form post) into a valid schema.
 * Falls back to DEFAULT_SCHEMA when the input is empty or unusable.
 */
export function coerceSchema(input: unknown): RecruitmentSchema {
  let data: unknown = input;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch {
      return DEFAULT_SCHEMA;
    }
  }
  if (!Array.isArray(data)) return DEFAULT_SCHEMA;
  const teams = data.map(asTeam).filter(Boolean) as RecruitmentSchema;
  const usable = teams.filter((t) => t.fields.length > 0);
  return usable.length ? usable : DEFAULT_SCHEMA;
}

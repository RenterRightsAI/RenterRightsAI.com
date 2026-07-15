const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.join(__dirname, "../../index.html"),
  "utf8"
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const base = path.join(__dirname, "../lib/data");
fs.mkdirSync(base, { recursive: true });

function sliceBetween(start, end) {
  const i = script.indexOf(start);
  const j = script.indexOf(end, i + start.length);
  return script.slice(i, j).trim();
}

const stateLaws = sliceBetween("const STATE_LAWS =", "const DEFAULT_LAW");
const defaultLaw = sliceBetween("const DEFAULT_LAW =", "function getStateLaw");
const issues = sliceBetween("const ISSUES =", "let currentIssue");
const clData = sliceBetween("const CL_DATA =", "let clChecked");
const placeholders = sliceBetween(
  "const LETTER_PLACEHOLDERS =",
  "function updateLetterPlaceholder"
);
const tlLabels = sliceBetween("const TL_TYPE_LABELS =", "function loadTimeline");
const vltLabels = sliceBetween("const VLT_TYPE_LABELS =", "function loadVault");
const supSubjects = sliceBetween(
  "const SUP_SUBJECTS =",
  "function submitSupportRequest"
);
const proScreens = sliceBetween(
  "const PRO_SCREENS =",
  "function toggleMobileNav"
);
const templates = sliceBetween("const TEMPLATES =", "function generateLetter");

fs.writeFileSync(
  path.join(base, "state-laws.ts"),
  `import type { StateLaw } from "@/types";\n\nexport const STATE_LAWS: Record<string, StateLaw> = ${stateLaws.replace("const STATE_LAWS =", "").trim()};\n\nexport const DEFAULT_LAW: StateLaw = ${defaultLaw.replace("const DEFAULT_LAW =", "").trim()};\n`
);

fs.writeFileSync(
  path.join(base, "issues.ts"),
  `import type { IssueData } from "@/types";\n\nexport const ISSUES: Record<string, IssueData> = ${issues.replace("const ISSUES =", "").trim()};\n`
);

fs.writeFileSync(
  path.join(base, "checklist.ts"),
  `export const CL_DATA = ${clData.replace("const CL_DATA =", "").trim()};\n`
);

fs.writeFileSync(
  path.join(base, "constants.ts"),
  `${placeholders.replace("const LETTER_PLACEHOLDERS", "export const LETTER_PLACEHOLDERS")}\n\n${tlLabels.replace("const TL_TYPE_LABELS", "export const TL_TYPE_LABELS")}\n\n${vltLabels.replace("const VLT_TYPE_LABELS", "export const VLT_TYPE_LABELS")}\n\n${supSubjects.replace("const SUP_SUBJECTS", "export const SUP_SUBJECTS")}\n\n${proScreens.replace("const PRO_SCREENS", "export const PRO_SCREENS")}\n\nexport const FREE_AI_LIMIT = 3;\nexport const FREE_LETTER_LIMIT = 1;\nexport const TL_KEY = "rra_timeline";\nexport const VLT_KEY = "rra_vault";\n`
);

fs.writeFileSync(
  path.join(base, "letter-templates.ts"),
  `import type { StateLaw } from "@/types";\n\nexport const TEMPLATES: Record<string, (n: string, l: string, la: string, a: string, date: string, d: string, law: StateLaw | null) => string> = ${templates.replace("const TEMPLATES =", "").trim()}\n`
);

// US states from select
const selectMatch = html.match(/id="state-select"[\s\S]*?<\/select>/);
const options = [...selectMatch[0].matchAll(/<option value="([^"]*)">([^<]*)<\/option>/g)];
const states = options
  .filter((m) => m[1])
  .map((m) => ({ code: m[1], name: m[2] }));
fs.writeFileSync(
  path.join(base, "us-states.ts"),
  `export const US_STATES = ${JSON.stringify(states, null, 2)} as const;\n`
);

console.log("Data extraction complete");

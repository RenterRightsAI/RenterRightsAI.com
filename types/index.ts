export type Plan = "free" | "pro" | "org";

export interface StateLaw {
  name?: string;
  depositDays: string;
  depositMultiplier: string;
  rentControl: boolean;
  rcNote: string;
  noticeDays: string;
  evictionNotice: string;
  legalAid: string;
  extra: string;
}

export interface IssueStep {
  t: string;
  b: string;
}

export interface IssueData {
  title: string;
  urgency: "warn" | "danger";
  urgencyText: string;
  steps: IssueStep[];
  rights: string[];
}

export type IssueType =
  | "repairs"
  | "deposit"
  | "eviction"
  | "privacy"
  | "rent"
  | "habitability";

export type LetterType =
  | "repairs"
  | "deposit"
  | "privacy"
  | "habitability"
  | "retaliation";

export interface TimelineEntry {
  id: number;
  date: string;
  type: string;
  note: string;
}

export interface VaultEntry {
  id: number;
  date: string;
  type: string;
  title: string;
  note: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ISSUES } from "@/lib/data/issues";
import { useApp } from "@/lib/context/AppProvider";
import type { IssueType } from "@/types";

const ISSUE_TILES: { id: IssueType; name: string; sub: string; bg: string; color: string; icon: React.ReactNode }[] = [
  {
    id: "repairs",
    name: "Repairs ignored",
    sub: "Landlord not responding",
    bg: "#e8f0fb",
    color: "var(--blue)",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "deposit",
    name: "Deposit dispute",
    sub: "Withheld or overcharged",
    bg: "#fef3dc",
    color: "var(--amber)",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: "eviction",
    name: "Eviction notice",
    sub: "Received notice to quit",
    bg: "#fee2e2",
    color: "var(--red)",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: "privacy",
    name: "Privacy violation",
    sub: "Entry without notice",
    bg: "#e0f4f0",
    color: "var(--teal)",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    id: "rent",
    name: "Rent increase",
    sub: "Is this increase legal?",
    bg: "#e8f0fb",
    color: "var(--blue)",
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "habitability",
    name: "Unsafe conditions",
    sub: "Mold, pests, no heat",
    bg: "#fee2e2",
    color: "var(--red)",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
  },
];

function IssueDetail({ type }: { type: IssueType }) {
  const { getStateLaw, navigate, setAiPrefill, setLetterTypePrefill, currentIssue } = useApp();
  const data = ISSUES[type];
  const law = getStateLaw();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [type]);

  const urgIcon =
    data.urgency === "danger" ? (
      <svg viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );

  let stateNote: React.ReactNode = null;
  if (law) {
    if (type === "deposit") {
      stateNote = (
        <div className="callout callout-blue" style={{ marginBottom: "1rem" }}>
          {urgIcon}
          <div>
            <strong>{law.name}:</strong> Landlords must return deposits within{" "}
            <strong>{law.depositDays}</strong>. Wrongful withholding can cost them{" "}
            <strong>{law.depositMultiplier}</strong> the deposit.
          </div>
        </div>
      );
    } else if (type === "eviction") {
      stateNote = (
        <div className="callout callout-blue" style={{ marginBottom: "1rem" }}>
          {urgIcon}
          <div>
            <strong>{law.name} eviction notice periods:</strong> {law.evictionNotice}. Free legal aid:{" "}
            <a href={law.legalAid} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>
              {law.legalAid.replace("https://", "")}
            </a>
          </div>
        </div>
      );
    } else if (type === "rent") {
      stateNote = (
        <div className="callout callout-blue" style={{ marginBottom: "1rem" }}>
          {urgIcon}
          <div>
            <strong>{law.name} rent control:</strong> {law.rcNote}
          </div>
        </div>
      );
    } else if (type === "privacy") {
      stateNote = (
        <div className="callout callout-blue" style={{ marginBottom: "1rem" }}>
          {urgIcon}
          <div>
            <strong>{law.name}:</strong> Required notice before entry — <strong>{law.noticeDays}</strong>.
          </div>
        </div>
      );
    }
  }

  const goToLetter = () => {
    const map: Record<string, string> = {
      repairs: "repairs",
      deposit: "deposit",
      privacy: "privacy",
      habitability: "habitability",
      eviction: "retaliation",
      rent: "repairs",
    };
    setLetterTypePrefill(map[type] || "repairs");
    navigate("/letter");
  };

  const prefillAI = () => {
    if (currentIssue && ISSUES[currentIssue]) {
      setAiPrefill(`I need help with: ${ISSUES[currentIssue].title}. `);
    }
    navigate("/ai");
  };

  return (
    <div id="issue-detail-panel" style={{ display: "block" }} ref={panelRef}>
      <div className="card" id="issue-detail-content">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: "var(--text)" }}>{data.title}</div>
          <span className={`pill ${data.urgency === "danger" ? "pill-red" : "pill-amber"}`}>
            {data.urgencyText}
          </span>
        </div>
        {stateNote}
        <div className="sec-label">Steps to take</div>
        <div className="steps-list">
          {data.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-content">
                <div className="step-title">{s.t}</div>
                <div className="step-body">{s.b}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider" />
        <div className="sec-label">Your legal rights</div>
        <div className="rights-list">
          {data.rights.map((r, i) => (
            <div className="rights-row" key={i}>
              <div className="rights-dot" style={{ background: "var(--blue)" }} />
              <div className="rights-text">{r}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" type="button" onClick={goToLetter}>
          <svg viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Draft a formal letter
        </button>
        <button className="btn" type="button" onClick={prefillAI}>
          <svg viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Ask AI about this
        </button>
      </div>
    </div>
  );
}

export function IssuesView() {
  const searchParams = useSearchParams();
  const { currentIssue, setCurrentIssue } = useApp();
  const issueParam = searchParams.get("issue") as IssueType | null;

  useEffect(() => {
    if (issueParam && ISSUES[issueParam]) {
      setCurrentIssue(issueParam);
    }
  }, [issueParam, setCurrentIssue]);

  const active = currentIssue && ISSUES[currentIssue] ? currentIssue : null;

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">My issue</div>
        <h1 className="page-title">Get help with your situation</h1>
        <p className="page-sub">
          Select the issue that best fits your situation for a step-by-step guide and your legal rights.
        </p>
      </div>

      <div className="issue-grid" id="issue-tiles">
        {ISSUE_TILES.map((tile) => (
          <div
            key={tile.id}
            className={`issue-tile${active === tile.id ? " active" : ""}`}
            id={`tile-${tile.id}`}
            onClick={() => setCurrentIssue(tile.id)}
            role="button"
            tabIndex={0}
          >
            <div className="issue-tile-icon" style={{ background: tile.bg, color: tile.color }}>
              {tile.icon}
            </div>
            <div className="issue-tile-name">{tile.name}</div>
            <div className="issue-tile-sub">{tile.sub}</div>
          </div>
        ))}
      </div>

      {active ? <IssueDetail type={active} /> : (
        <div id="issue-detail-panel" style={{ display: "none" }} />
      )}
    </>
  );
}

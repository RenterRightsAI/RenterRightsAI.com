"use client";

import { useApp } from "@/lib/context/AppProvider";
import type { IssueType } from "@/types";

export function HomeView() {
  const { navigate, setCurrentIssue } = useApp();

  const goIssue = (issue: IssueType) => {
    setCurrentIssue(issue);
    navigate("/issues");
  };

  return (
    <>
      <div className="hero">
        <div className="hero-logo-lockup">
          <svg
            width="48"
            height="48"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}
          >
            <rect width="44" height="44" rx="10" fill="rgba(255,255,255,0.15)" />
            <rect x="4" y="4" width="36" height="36" rx="7" fill="rgba(255,255,255,0.2)" />
            <text x="4" y="38" fontFamily="Georgia,serif" fontSize="34" fontWeight="700" fill="#FFFFFF">
              R
            </text>
            <rect x="28" y="4" width="13" height="13" rx="4" fill="#0FD8C9" />
            <text
              x="34.5"
              y="14.5"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontSize="9"
              fontWeight="800"
              fill="#0D3A6E"
            >
              2
            </text>
          </svg>
          <div>
            <div className="hero-brand-name">
              Renter Rights <span style={{ color: "#0FD8C9", fontWeight: 700 }}>AI</span>
            </div>
            <div className="hero-brand-tag">Free forever plan &mdash; no card required</div>
          </div>
        </div>
        <h1 className="hero-title">
          Know your rights.
          <br />
          <em>Protect your home.</em>
        </h1>
        <p className="hero-sub">
          Instant, state-specific answers for renters — from repair disputes to eviction notices — plus
          AI-drafted letters and a deposit-protecting move-in checklist.
        </p>
        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" type="button" onClick={() => navigate("/issues")}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
            Get help with my issue
          </button>
          <button className="hero-btn hero-btn-ghost" type="button" onClick={() => navigate("/ai")}>
            Ask the AI advisor
          </button>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            All 50 states covered
          </div>
          <div className="hero-trust-item">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Private &amp; confidential
          </div>
        </div>
      </div>

      <div className="house-icon-banner">
        <svg
          width="56"
          height="56"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Renter Rights AI house icon"
        >
          <rect width="44" height="44" rx="10" fill="#0D3A6E" />
          <polygon points="22,7 38,19 6,19" fill="#0FD8C9" />
          <rect x="19" y="3" width="6" height="7" rx="2" fill="#0FD8C9" />
          <rect x="8" y="18" width="28" height="20" rx="2" fill="#1A56A0" />
          <rect x="17" y="25" width="10" height="13" rx="3" fill="#0FD8C9" opacity="0.9" />
          <circle cx="25" cy="32" r="1.5" fill="#0D3A6E" />
          <rect x="9" y="21" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.3" />
          <rect x="28" y="21" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.3" />
          <rect x="29" y="30" width="13" height="10" rx="4" fill="#0FD8C9" />
          <text
            x="35.5"
            y="38"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize="7"
            fontWeight="800"
            fill="#0D3A6E"
          >
            AI
          </text>
        </svg>
        <div className="house-icon-text">
          <div className="house-icon-title">Renter Rights AI</div>
          <div className="house-icon-sub">50 states · attorney-reviewed · free to use</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">50</div>
          <div className="stat-label">States covered</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">6</div>
          <div className="stat-label">Issue categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">5</div>
          <div className="stat-label">Letter templates</div>
        </div>
      </div>

      <div className="sec-label">What do you need help with?</div>
      <div className="quick-grid">
        <div className="quick-card" onClick={() => goIssue("repairs")} role="button" tabIndex={0}>
          <div className="quick-card-icon">🔧</div>
          <div className="quick-card-title">Repairs ignored</div>
          <div className="quick-card-sub">Landlord not fixing issues</div>
        </div>
        <div className="quick-card" onClick={() => goIssue("deposit")} role="button" tabIndex={0}>
          <div className="quick-card-icon">💰</div>
          <div className="quick-card-title">Deposit dispute</div>
          <div className="quick-card-sub">Withheld or wrongly charged</div>
        </div>
        <div className="quick-card" onClick={() => goIssue("eviction")} role="button" tabIndex={0}>
          <div className="quick-card-icon">🚪</div>
          <div className="quick-card-title">Eviction notice</div>
          <div className="quick-card-sub">Received a notice to leave</div>
        </div>
        <div className="quick-card" onClick={() => goIssue("privacy")} role="button" tabIndex={0}>
          <div className="quick-card-icon">🔒</div>
          <div className="quick-card-title">Privacy violation</div>
          <div className="quick-card-sub">Landlord entering without notice</div>
        </div>
        <div className="quick-card" onClick={() => goIssue("rent")} role="button" tabIndex={0}>
          <div className="quick-card-icon">📈</div>
          <div className="quick-card-title">Rent increase</div>
          <div className="quick-card-sub">Is this legal in my state?</div>
        </div>
        <div className="quick-card" onClick={() => goIssue("habitability")} role="button" tabIndex={0}>
          <div className="quick-card-icon">🏚️</div>
          <div className="quick-card-title">Unsafe conditions</div>
          <div className="quick-card-sub">Mold, pests, no heat</div>
        </div>
        <div className="quick-card" onClick={() => navigate("/ai")} role="button" tabIndex={0}>
          <div className="quick-card-icon">💬</div>
          <div className="quick-card-title">Ask a question</div>
          <div className="quick-card-sub">AI advisor, free and private</div>
        </div>
        <div className="quick-card" onClick={() => navigate("/checklist")} role="button" tabIndex={0}>
          <div className="quick-card-icon">✅</div>
          <div className="quick-card-title">Move-in checklist</div>
          <div className="quick-card-sub">Protect your deposit</div>
        </div>
      </div>

      <div className="callout callout-blue">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          Select your state above to get laws specific to where you live — deposit return deadlines, rent
          control status, required notice periods, and more.
        </div>
      </div>
    </>
  );
}

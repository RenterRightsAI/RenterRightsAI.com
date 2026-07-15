"use client";

import { useApp } from "@/lib/context/AppProvider";
import { US_STATES } from "@/lib/data/us-states";

export function StateBar() {
  const { selectedState, setSelectedState, plan, navigate } = useApp();

  const pillStyle =
    plan === "pro"
      ? { background: "#e8f0fb", color: "#0d3a6e" }
      : plan === "org"
        ? { background: "#e0f4f0", color: "#085041" }
        : { background: "#f0efe8", color: "#5a5955" };

  const pillText =
    plan === "pro" ? "⭐ Pro" : plan === "org" ? "🏢 Org" : "Free plan";

  return (
    <div className="state-bar">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9a9890"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <label htmlFor="state-select">Your state:</label>
      <select
        id="state-select"
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        aria-label="Select your state"
      >
        <option value="">— Select your state —</option>
        {US_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      {selectedState ? (
        <span className="state-badge" id="state-badge" style={{ display: "inline-flex" }}>
          {selectedState}
        </span>
      ) : (
        <span className="state-badge" id="state-badge" style={{ display: "none" }} />
      )}
      <span
        className="plan-pill"
        id="plan-pill"
        onClick={() => navigate("/pricing")}
        style={{ ...pillStyle, marginLeft: "auto", cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate("/pricing");
        }}
      >
        {pillText}
      </span>
    </div>
  );
}

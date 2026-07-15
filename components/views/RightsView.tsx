"use client";

import { StateLawPanel } from "@/components/StateLawPanel";
import { useApp } from "@/lib/context/AppProvider";

const UNIVERSAL_RIGHTS = [
  {
    color: "var(--blue)",
    title: "Habitability is guaranteed.",
    body: 'Landlords must maintain safe, livable conditions — working heat, plumbing, weatherproofing, and structural integrity. This is called the "implied warranty of habitability" and applies in every state.',
  },
  {
    color: "var(--teal)",
    title: "Notice before entry is required.",
    body: "With very few exceptions (true emergencies), landlords must provide advance written notice before entering your home. Most states require 24 hours minimum.",
  },
  {
    color: "var(--green)",
    title: "Your deposit must be itemized.",
    body: 'If a landlord keeps part of your deposit, they must give you a written list of exactly what was deducted. "Normal wear and tear" — minor scuffs, carpet aging — cannot be charged to you.',
  },
  {
    color: "var(--amber)",
    title: "Retaliation is illegal everywhere.",
    body: "A landlord cannot raise your rent, refuse repairs, threaten eviction, or reduce services because you exercised a legal right — like complaining to a housing authority or organizing with neighbors.",
  },
  {
    color: "var(--red)",
    title: "Self-help eviction is a crime.",
    body: "Changing your locks, removing your belongings, or cutting off utilities to force you out is illegal in all 50 states. You are entitled to a formal court process before you can be removed.",
  },
  {
    color: "var(--blue-mid)",
    title: "You can withhold rent for severe issues.",
    body: "In most states, if your landlord refuses to fix conditions that make the unit uninhabitable, you have the right to withhold rent or pay it into escrow until repairs are made.",
  },
  {
    color: "var(--teal)",
    title: "Fair housing protections cover you.",
    body: "Under federal law, landlords cannot discriminate based on race, color, national origin, religion, sex, familial status, or disability. Many states extend this further.",
  },
];

export function RightsView() {
  const { getStateLaw } = useApp();
  const law = getStateLaw();

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Know your rights</div>
        <h1 className="page-title">What every renter is entitled to</h1>
        <p className="page-sub">
          These rights apply in all 50 states. Select your state to see additional protections specific
          to you.
        </p>
      </div>

      {law ? (
        <StateLawPanel />
      ) : (
        <div id="state-law-panel" style={{ display: "none", marginBottom: "1.5rem" }} />
      )}

      <div className="sec-label">Universal renter rights</div>
      <div className="card">
        <div className="rights-list">
          {UNIVERSAL_RIGHTS.map((row, i) => (
            <div className="rights-row" key={i}>
              <div className="rights-dot" style={{ background: row.color }} />
              <div className="rights-text">
                <strong>{row.title}</strong> {row.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

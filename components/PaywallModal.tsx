"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/AppProvider";

export function PaywallModal() {
  const {
    paywallOpen,
    paywallTitle,
    paywallSub,
    closePaywall,
    activatePro,
  } = useApp();
  const [busy, setBusy] = useState(false);

  const startCheckout = async (interval: "month" | "year") => {
    setBusy(true);
    try {
      await activatePro(interval);
      closePaywall();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`paywall-backdrop${paywallOpen ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Pro"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePaywall();
      }}
    >
      <div className="paywall-modal">
        <button
          className="paywall-close"
          onClick={closePaywall}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <div
          className="paywall-icon"
          style={{
            background: "none",
            padding: 0,
            width: "auto",
            height: "auto",
            borderRadius: 0,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="10" fill="#0D3A6E" />
            <rect x="4" y="4" width="36" height="36" rx="7" fill="#1A56A0" />
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
        </div>
        <div className="paywall-title" id="paywall-title">
          {paywallTitle}
        </div>
        <div className="paywall-sub" id="paywall-sub">
          {paywallSub}
        </div>
        <div className="paywall-perks">
          <div className="paywall-perk">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Unlimited AI advisor — ask anything, anytime
          </div>
          <div className="paywall-perk">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Unlimited letter generator with state-specific legal language
          </div>
          <div className="paywall-perk">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Document vault for photos, receipts &amp; notices
          </div>
          <div className="paywall-perk">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            1 free attorney consultation call (worth $150+)
          </div>
          <div className="paywall-perk">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Case timeline tracker
          </div>
        </div>
        <button
          className="paywall-btn paywall-btn-primary"
          type="button"
          disabled={busy}
          onClick={() => void startCheckout("month")}
        >
          {busy ? "Redirecting…" : "Upgrade to Pro — $8/month"}
        </button>
        <button
          className="paywall-btn paywall-btn-sec"
          type="button"
          disabled={busy}
          onClick={() => void startCheckout("year")}
        >
          Or save 18% — $79/year
        </button>
        <button className="paywall-btn paywall-btn-sec" type="button" onClick={closePaywall}>
          Maybe later
        </button>
        <div className="paywall-note">
          Secure checkout with Stripe. Cancel anytime.
        </div>
      </div>
    </div>
  );
}

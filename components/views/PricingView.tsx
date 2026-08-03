"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FREE_AI_LIMIT, FREE_LETTER_LIMIT } from "@/lib/data/constants";
import { useApp } from "@/lib/context/AppProvider";

export function PricingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    plan,
    aiQuestionsUsed,
    lettersUsed,
    isPro,
    selectFreePlan,
    activatePro,
    activateOrg,
    openBillingPortal,
    refreshPlan,
    showToast,
  } = useApp();
  const [busy, setBusy] = useState<"month" | "year" | "portal" | null>(null);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    if (checkout === "success") {
      void (async () => {
        // Webhook may land slightly after redirect
        await new Promise((r) => setTimeout(r, 800));
        await refreshPlan();
        showToast("Welcome to Renter Pro! All features unlocked.");
        router.replace("/pricing");
      })();
    } else if (checkout === "canceled") {
      showToast("Checkout canceled — no charge was made.");
      router.replace("/pricing");
    }
  }, [refreshPlan, router, searchParams, showToast]);

  const startCheckout = async (interval: "month" | "year") => {
    setBusy(interval);
    try {
      await activatePro(interval);
    } finally {
      setBusy(null);
    }
  };

  const manageBilling = async () => {
    setBusy("portal");
    try {
      await openBillingPortal();
    } finally {
      setBusy(null);
    }
  };

  const aiPct = Math.min(Math.round((aiQuestionsUsed / FREE_AI_LIMIT) * 100), 100);
  const lPct = Math.min(Math.round((lettersUsed / FREE_LETTER_LIMIT) * 100), 100);

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Plans &amp; pricing</div>
        <h1 className="page-title">Simple, transparent pricing</h1>
        <p className="page-sub">
          Start free — upgrade when your situation demands more. No hidden fees, cancel anytime.
        </p>
      </div>

      {plan === "pro" ? (
        <div id="current-plan-banner" style={{ display: "block", marginBottom: "1.5rem" }}>
          <div className="callout callout-green">
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 16,
                height: 16,
                stroke: "currentColor",
                fill: "none",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                flexShrink: 0,
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <strong>You&apos;re on Renter Pro.</strong> Unlimited AI questions, unlimited letters, and all
              Pro features unlocked.
            </div>
          </div>
        </div>
      ) : plan === "org" ? (
        <div id="current-plan-banner" style={{ display: "block", marginBottom: "1.5rem" }}>
          <div className="callout callout-green">
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 16,
                height: 16,
                stroke: "currentColor",
                fill: "none",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                flexShrink: 0,
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <strong>You&apos;re on the Organization plan.</strong> Full access for your entire team.
            </div>
          </div>
        </div>
      ) : (
        <div id="current-plan-banner" style={{ display: "none", marginBottom: "1.5rem" }} />
      )}

      <div className="pricing-grid">
        <div className="pricing-card" id="pc-free">
          <span className="pricing-badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
            Free
          </span>
          <div className="pricing-name">Renter</div>
          <div className="pricing-price">
            $0 <span>/ forever</span>
          </div>
          <div className="pricing-desc">Everything you need to understand your rights and get started.</div>
          <div className="pricing-divider" />
          <div className="pricing-features">
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>All 50-state law database
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>6 issue guides with action steps
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Move-in checklist (45 items)
            </div>
            <div className="pricing-feat">
              <span className="feat-icon partial">3</span>AI advisor — 3 free questions
            </div>
            <div className="pricing-feat">
              <span className="feat-icon partial">1</span>Letter generator — 1 free letter
            </div>
            <div className="pricing-feat locked">
              <span className="feat-icon no">–</span>Document vault
            </div>
            <div className="pricing-feat locked">
              <span className="feat-icon no">–</span>Attorney match &amp; consultation
            </div>
            <div className="pricing-feat locked">
              <span className="feat-icon no">–</span>Case timeline tracker
            </div>
          </div>
          <button
            className="pricing-cta"
            id="cta-free"
            type="button"
            onClick={selectFreePlan}
            disabled={plan === "free" || busy !== null}
            style={plan !== "free" ? { opacity: 0.6 } : undefined}
          >
            {plan === "free"
              ? "Current plan"
              : plan === "pro"
                ? "Manage / cancel in Stripe"
                : "Downgrade to Free"}
          </button>
        </div>

        <div className="pricing-card featured" id="pc-pro">
          <span className="pricing-badge" style={{ background: "var(--blue)", color: "#fff" }}>
            Most popular
          </span>
          <div className="pricing-name">Renter Pro</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 2px" }}>
            <div className="pricing-price">
              $8 <span>/ month</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>or $79/yr</span>
          </div>
          <div className="pricing-desc">
            Unlimited access for anyone actively dealing with a landlord dispute.
          </div>
          <div className="pricing-divider" />
          <div className="pricing-features">
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Everything in Free
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Unlimited AI advisor
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Unlimited letter generator
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Document vault (photos, receipts)
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>1 free attorney consultation call
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Case timeline tracker
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Priority support
            </div>
          </div>
          {plan === "pro" ? (
            <button
              className="pricing-cta primary"
              id="cta-pro"
              type="button"
              onClick={() => void manageBilling()}
              disabled={busy !== null}
              style={{ opacity: 0.95 }}
            >
              {busy === "portal" ? "Opening…" : "Manage billing ✓"}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <button
                className="pricing-cta primary"
                id="cta-pro"
                type="button"
                onClick={() => void startCheckout("month")}
                disabled={busy !== null}
              >
                {busy === "month" ? "Redirecting…" : "Upgrade — $8/mo"}
              </button>
              <button
                className="pricing-cta"
                type="button"
                onClick={() => void startCheckout("year")}
                disabled={busy !== null}
              >
                {busy === "year" ? "Redirecting…" : "Upgrade — $79/yr (save 18%)"}
              </button>
            </div>
          )}
        </div>

        <div className="pricing-card" id="pc-org">
          <span className="pricing-badge" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
            Organizations
          </span>
          <div className="pricing-name">Organization</div>
          <div className="pricing-price">
            $149 <span>/ month</span>
          </div>
          <div className="pricing-desc">
            For legal aid orgs, tenant unions, housing nonprofits, and social workers.
          </div>
          <div className="pricing-divider" />
          <div className="pricing-features">
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Everything in Pro
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Up to 50 staff/client seats
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Case management dashboard
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Bulk letter generation
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>White-label option (your branding)
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>API access
            </div>
            <div className="pricing-feat">
              <span className="feat-icon yes">✓</span>Dedicated onboarding &amp; support
            </div>
          </div>
          <button className="pricing-cta" type="button" onClick={activateOrg}>
            Contact us
          </button>
        </div>
      </div>

      <div className="callout callout-blue" style={{ marginTop: "0.5rem" }}>
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          All plans include access to our 50-state law database. Grant and subsidized pricing is available
          for qualifying nonprofit organizations — contact us for details.
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <div className="sec-label">Your usage this session</div>
        <div className="card card-sm">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                AI questions used
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text)" }} id="ui-ai-count">
                {aiQuestionsUsed}{" "}
                {isPro ? (
                  <span style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 400 }}>unlimited</span>
                ) : (
                  <span style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 400 }}>
                    of {FREE_AI_LIMIT} free
                  </span>
                )}
              </div>
              <div className="usage-bar-wrap">
                <div
                  className="usage-bar-fill"
                  id="ui-ai-bar"
                  style={{
                    width: isPro ? "100%" : aiPct + "%",
                    background: isPro
                      ? "#166534"
                      : aiQuestionsUsed >= FREE_AI_LIMIT
                        ? "#b91c1c"
                        : "#1a56a0",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                Letters generated
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text)" }} id="ui-letter-count">
                {lettersUsed}{" "}
                {isPro ? (
                  <span style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 400 }}>unlimited</span>
                ) : (
                  <span style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 400 }}>
                    of {FREE_LETTER_LIMIT} free
                  </span>
                )}
              </div>
              <div className="usage-bar-wrap">
                <div
                  className="usage-bar-fill"
                  id="ui-letter-bar"
                  style={{
                    width: isPro ? "100%" : lPct + "%",
                    background: isPro
                      ? "#166534"
                      : lettersUsed >= FREE_LETTER_LIMIT
                        ? "#b91c1c"
                        : "#1a56a0",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

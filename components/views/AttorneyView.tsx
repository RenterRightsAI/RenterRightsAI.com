"use client";

import { useEffect, useState } from "react";
import { PRO_SCREENS } from "@/lib/data/constants";
import { useApp } from "@/lib/context/AppProvider";

const ATTY_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

export function AttorneyView() {
  const { isPro, openPaywall, showToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [issue, setIssue] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [confirmState, setConfirmState] = useState("");

  useEffect(() => {
    try {
      const pending = localStorage.getItem("rra_atty_pending");
      if (pending) {
        const d = JSON.parse(pending);
        setConfirmName(d.name);
        setConfirmState(d.state);
        setConfirmed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const submitAttorneyRequest = () => {
    if (!isPro) {
      openPaywall("Attorney match — Pro only", PRO_SCREENS.attorney);
      return;
    }
    if (!name.trim() || !email.trim() || !state) {
      showToast("Please fill in your name, email, and state.");
      return;
    }
    if (!issue.trim()) {
      showToast("Please describe your situation so we can match you with the right attorney.");
      return;
    }

    const subject = encodeURIComponent(
      "Renter Rights AI — Attorney Referral Request (" + state + ")"
    );
    const body = encodeURIComponent(
      "ATTORNEY REFERRAL REQUEST\n" +
        "========================\n\n" +
        "Name: " +
        name +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "State: " +
        state +
        "\n\n" +
        "SITUATION:\n" +
        issue +
        "\n\n" +
        "---\nSent from Renter Rights AI (renterrightsai.com)"
    );
    window.location.href =
      "mailto:hello@renterrightsai.com?subject=" + subject + "&body=" + body;

    localStorage.setItem(
      "rra_atty_pending",
      JSON.stringify({
        name,
        email,
        state,
        issue,
        submitted: new Date().toISOString(),
      })
    );

    setConfirmName(name);
    setConfirmState(state);
    setConfirmed(true);
  };

  const resetAttorneyForm = () => {
    localStorage.removeItem("rra_atty_pending");
    setName("");
    setEmail("");
    setState("");
    setIssue("");
    setConfirmed(false);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Attorney match</div>
        <h1 className="page-title">Connect with a tenant attorney</h1>
        <p className="page-sub">
          As a Pro member you get one free 20-minute consultation call with a licensed tenant attorney in
          your state. No commitment required.
        </p>
      </div>

      <div className="callout callout-green">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div>
          <strong>Pro benefit included:</strong> 1 free attorney consultation call (value $150+).
          Additional consultations available at reduced member rates.
        </div>
      </div>

      {confirmed ? (
        <div
          id="atty-confirm-card"
          className="card callout-green"
          style={{ display: "block", marginBottom: "1rem", borderColor: "var(--green)" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="var(--green)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 2 }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)", marginBottom: 6 }}>
                Request submitted!
              </div>
              <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 10 }}>
                Your referral request for <strong id="atty-confirm-name">{confirmName}</strong> in{" "}
                <strong id="atty-confirm-state">{confirmState}</strong> has been sent to{" "}
                <a href="mailto:hello@renterrightsai.com" style={{ color: "var(--blue)" }}>
                  hello@renterrightsai.com
                </a>
                . A licensed tenant attorney will contact you within 1 business day.
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-3)", marginBottom: 12 }}>
                If your email client did not open, please email{" "}
                <a href="mailto:hello@renterrightsai.com" style={{ color: "var(--blue)" }}>
                  hello@renterrightsai.com
                </a>{" "}
                directly with your name, state, and situation.
              </p>
              <button className="btn btn-sm" type="button" onClick={resetAttorneyForm}>
                Submit another request
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!confirmed ? (
        <div id="atty-form-card" className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-title">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Request your free consultation
          </div>
          <p className="card-body" style={{ marginBottom: "1rem" }}>
            Tell us about your situation and we&apos;ll match you with a tenant attorney in your state,
            usually within 1 business day.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="atty-name">
              Your name
            </label>
            <input
              className="form-input"
              id="atty-name"
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="atty-email">
                Your email
              </label>
              <input
                className="form-input"
                id="atty-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="atty-state">
                Your state
              </label>
              <select
                className="form-input"
                id="atty-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">— Select state —</option>
                {ATTY_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="atty-issue">
              Describe your situation briefly
            </label>
            <textarea
              className="form-input"
              id="atty-issue"
              rows={3}
              placeholder="e.g. My landlord has refused to fix a mold problem for 3 months. I have sent two demand letters and filed a housing complaint. I want to understand my options."
              style={{ resize: "vertical" }}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <button className="btn btn-primary" type="button" onClick={submitAttorneyRequest}>
              Request consultation
            </button>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 10, lineHeight: 1.5 }}>
            By submitting this form you agree to be contacted by a licensed tenant attorney. This is a
            referral service — Renter Rights AI is not a law firm and does not provide legal advice.
          </p>
        </div>
      ) : (
        <div id="atty-form-card" className="card" style={{ display: "none", marginBottom: "1rem" }} />
      )}

      <div className="sec-label">What to expect</div>
      <div className="card">
        <div className="steps-list">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-content">
              <div className="step-title">We receive your request</div>
              <div className="step-body">
                Your case summary is reviewed and matched to an available tenant attorney licensed in your
                state.
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-content">
              <div className="step-title">Attorney contacts you</div>
              <div className="step-body">
                Within 1 business day, the attorney reaches out by email to schedule your free 20-minute
                call.
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-content">
              <div className="step-title">Your free consultation</div>
              <div className="step-body">
                A 20-minute call to review your situation, explain your options, and advise on next steps.
                No obligation to retain.
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div className="step-content">
              <div className="step-title">Continue if you choose</div>
              <div className="step-body">
                If you want to proceed with legal representation, the attorney will provide their rates. Pro
                members receive preferred pricing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

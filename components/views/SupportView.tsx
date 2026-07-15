"use client";

import { useState } from "react";
import { PRO_SCREENS, SUP_SUBJECTS } from "@/lib/data/constants";
import { useApp } from "@/lib/context/AppProvider";

export function SupportView() {
  const { isPro, openPaywall, showToast } = useApp();
  const [subject, setSubject] = useState("bug");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmSubject, setConfirmSubject] = useState("");

  const submitSupportRequest = () => {
    if (!isPro) {
      openPaywall("Priority support — Pro only", PRO_SCREENS.support);
      return;
    }
    if (!message.trim()) {
      showToast("Please enter a message before sending.");
      return;
    }

    const subjectLabel = SUP_SUBJECTS[subject as keyof typeof SUP_SUBJECTS] || "Support request";
    const mailSubject = encodeURIComponent("[Pro Support] " + subjectLabel);
    const body = encodeURIComponent(
      subjectLabel.toUpperCase() +
        "\n" +
        "=".repeat(subjectLabel.length) +
        "\n\n" +
        message +
        "\n\n" +
        "---\nSent from Renter Rights AI Pro (renterrightsai.com)\n" +
        "Time: " +
        new Date().toLocaleString()
    );
    window.location.href =
      "mailto:hello@renterrightsai.com?subject=" + mailSubject + "&body=" + body;

    setConfirmSubject(subjectLabel);
    setConfirmed(true);
    setMessage("");
  };

  const resetSupportForm = () => {
    setConfirmed(false);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Priority support</div>
        <h1 className="page-title">We&apos;re here to help</h1>
        <p className="page-sub">
          As a Pro member, your messages go to the front of the queue. Expect a response within 4 business
          hours.
        </p>
      </div>

      <div className="callout callout-green">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div>
          <strong>Pro response time: under 4 hours</strong> during business hours (Mon–Fri, 9am–6pm ET).
          Free plan support response time is 48–72 hours.
        </div>
      </div>

      {confirmed ? (
        <div
          id="sup-confirm-card"
          className="card"
          style={{
            display: "block",
            marginBottom: "1rem",
            borderColor: "var(--green)",
            background: "var(--green-light)",
          }}
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
                Message sent!
              </div>
              <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 6 }}>
                Your <strong id="sup-confirm-subject">{confirmSubject}</strong> has been sent to our support
                team. As a Pro member you&apos;ll hear back within 4 business hours (Mon–Fri, 9am–6pm ET).
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-3)", marginBottom: 12 }}>
                If your email client did not open, email{" "}
                <a href="mailto:hello@renterrightsai.com" style={{ color: "var(--blue)" }}>
                  hello@renterrightsai.com
                </a>{" "}
                directly — include [Pro Support] in the subject line.
              </p>
              <button className="btn btn-sm" type="button" onClick={resetSupportForm}>
                Send another message
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!confirmed ? (
        <div id="sup-form-card" className="card" style={{ marginBottom: "1rem" }}>
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
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Send a message
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sup-subject">
              Subject
            </label>
            <select
              className="form-input"
              id="sup-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="bug">Something isn&apos;t working</option>
              <option value="question">Question about my plan</option>
              <option value="billing">Billing issue</option>
              <option value="feature">Feature request</option>
              <option value="legal">Question about the legal information</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sup-message">
              Your message
            </label>
            <textarea
              className="form-input"
              id="sup-message"
              rows={4}
              placeholder="Describe your question or issue in detail. The more information you provide, the faster we can help."
              style={{ resize: "vertical" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <button className="btn btn-primary" type="button" onClick={submitSupportRequest}>
              Send message
            </button>
          </div>
        </div>
      ) : (
        <div id="sup-form-card" className="card" style={{ display: "none", marginBottom: "1rem" }} />
      )}

      <div className="sec-label">Other ways to get help</div>
      <div className="card">
        <div className="steps-list">
          <div className="step">
            <div className="step-num" style={{ background: "var(--teal)" }}>
              ?
            </div>
            <div className="step-content">
              <div className="step-title">Browse help articles</div>
              <div className="step-body">
                Visit{" "}
                <a
                  href="https://renterrightsai.com/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--blue)" }}
                >
                  renterrightsai.com/help
                </a>{" "}
                for guides on using every feature — letter generator, AI advisor, checklist, and more.
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-num" style={{ background: "var(--teal)" }}>
              @
            </div>
            <div className="step-content">
              <div className="step-title">Email us directly</div>
              <div className="step-body">
                Reach us at{" "}
                <a href="mailto:hello@renterrightsai.com" style={{ color: "var(--blue)" }}>
                  hello@renterrightsai.com
                </a>
                . Pro members are automatically prioritized in our inbox.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthBrandHeader } from "@/components/auth/AuthChrome";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        }
      );
      if (err) {
        setError(err.message);
        return;
      }
      setMessage(
        "If an account exists for that email, we sent a password reset link. Check your inbox."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <AuthBrandHeader />
        <div className="page-header" style={{ marginBottom: "1.25rem" }}>
          <div className="page-eyebrow">Account recovery</div>
          <h1 className="page-title" style={{ fontSize: 26 }}>
            Forgot your password?
          </h1>
          <p className="page-sub">
            Enter your email and we&apos;ll send a link to reset your password. Google
            sign-in users should reset their password with Google.
          </p>
        </div>

        {error ? (
          <div className="callout callout-red" style={{ marginBottom: "1rem" }}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>{error}</div>
          </div>
        ) : null}

        {message ? (
          <div className="callout callout-green" style={{ marginBottom: "1rem" }}>
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>{message}</div>
          </div>
        ) : null}

        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">
              Email
            </label>
            <input
              className="form-input"
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="auth-footer-text">
          Remembered it?{" "}
          <Link href="/login" className="auth-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

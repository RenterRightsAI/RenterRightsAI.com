"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthBrandHeader } from "@/components/auth/AuthChrome";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/");
      router.refresh();
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
            Choose a new password
          </h1>
          <p className="page-sub">Enter a new password for your account.</p>
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

        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="reset-password">
              New password
            </label>
            <input
              className="form-input"
              id="reset-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reset-confirm">
              Confirm new password
            </label>
            <input
              className="form-input"
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>

        <p className="auth-footer-text">
          <Link href="/login" className="auth-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

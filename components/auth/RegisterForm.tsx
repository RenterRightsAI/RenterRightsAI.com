"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthBrandHeader, GoogleIcon } from "@/components/auth/AuthChrome";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const safeNext =
    nextPath &&
    nextPath.startsWith("/") &&
    !nextPath.startsWith("//") &&
    nextPath !== "/"
      ? nextPath
      : "/home";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signUpWithGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });
      if (err) setError(err.message);
    } catch {
      setError("Could not start Google sign-up. Check your Supabase config.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

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
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        router.push(safeNext);
        router.refresh();
        return;
      }
      setMessage(
        "Check your email for a confirmation link to finish creating your account."
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
          <div className="page-eyebrow">Get started</div>
          <h1 className="page-title" style={{ fontSize: 26 }}>
            Create your account
          </h1>
          <p className="page-sub">
            Save your progress and unlock Pro features when you&apos;re ready.
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

        <button
          type="button"
          className="auth-oauth-btn"
          onClick={() => void signUpWithGoogle()}
          disabled={googleLoading || loading}
        >
          <GoogleIcon />
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Full name
            </label>
            <input
              className="form-input"
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email
            </label>
            <input
              className="form-input"
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <input
              className="form-input"
              id="reg-password"
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
            <label className="form-label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <input
              className="form-input"
              id="reg-confirm"
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
            disabled={loading || googleLoading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link
            href={
              safeNext !== "/home"
                ? `/login?next=${encodeURIComponent(safeNext)}`
                : "/login"
            }
            className="auth-link"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

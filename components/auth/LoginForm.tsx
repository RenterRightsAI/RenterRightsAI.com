"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthBrandHeader, GoogleIcon } from "@/components/auth/AuthChrome";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const safeNext =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
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
      setError("Could not start Google sign-in. Check your Supabase config.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push(safeNext);
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
          <div className="page-eyebrow">Welcome back</div>
          <h1 className="page-title" style={{ fontSize: 26 }}>
            Sign in to your account
          </h1>
          <p className="page-sub">
            Access your letters, checklist, and Pro features from any device.
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

        <button
          type="button"
          className="auth-oauth-btn"
          onClick={() => void signInWithGoogle()}
          disabled={googleLoading || loading}
        >
          <GoogleIcon />
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              className="form-input"
              id="login-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="auth-label-row">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
            <input
              className="form-input"
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

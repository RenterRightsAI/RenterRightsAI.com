"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, useNavActive } from "@/lib/context/AppProvider";
import { useAuth } from "@/lib/context/AuthProvider";

const NAV_ITEMS = [
  {
    path: "/home",
    label: "Home",
    aria: "Home",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/rights",
    label: "Know your rights",
    aria: "Know your rights",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    path: "/issues",
    label: "My issue",
    aria: "My issue",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    path: "/letter",
    label: "Draft a letter",
    aria: "Draft a letter",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    path: "/ai",
    label: "Ask AI advisor",
    aria: "Ask AI",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    path: "/checklist",
    label: "Move-in checklist",
    aria: "Move-in checklist",
    icon: (
      <svg viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    path: "/timeline",
    label: "Case timeline",
    aria: "Case timeline",
    pro: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: "/vault",
    label: "Document vault",
    aria: "Document vault",
    pro: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    path: "/attorney",
    label: "Attorney match",
    aria: "Attorney match",
    pro: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    path: "/support",
    label: "Priority support",
    aria: "Priority support",
    pro: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    path: "/pricing",
    label: "Plans & pricing",
    aria: "Plans & pricing",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

function NavButton({
  path,
  label,
  aria,
  icon,
  pro,
}: {
  path: string;
  label: string;
  aria: string;
  icon: React.ReactNode;
  pro?: boolean;
}) {
  const { navigate, isPro } = useApp();
  const active = useNavActive(path);

  if (pro) {
    return (
      <button
        className={`nav-item${active ? " active" : ""}`}
        onClick={() => navigate(path)}
        aria-label={aria}
        type="button"
        style={{ justifyContent: "space-between" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon}
          {label}
        </span>
        {!isPro && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 10,
              background: "var(--blue-light)",
              color: "var(--blue)",
              letterSpacing: "0.04em",
            }}
            className={path === "/timeline" ? "" : "pro-nav-badge"}
            id={path === "/timeline" ? "tl-nav-badge" : undefined}
          >
            PRO
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      className={`nav-item${active ? " active" : ""}`}
      onClick={() => navigate(path)}
      aria-label={aria}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

export function Sidebar() {
  const { mobileNavOpen, toggleMobileNav } = useApp();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className={`sidebar${mobileNavOpen ? " open" : ""}`}
      id="sidebar-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Renter Rights AI logo"
          >
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
              fontFamily="system-ui,sans-serif"
              fontSize="9"
              fontWeight="800"
              fill="#0D3A6E"
            >
              2
            </text>
          </svg>
          <div className="brand-text-wrap">
            <div className="brand-name">Renter Rights</div>
            <div className="brand-sub">AI &middot; renterrightsai.com</div>
          </div>
        </div>
        <button
          className="sidebar-close"
          onClick={() => toggleMobileNav(false)}
          aria-label="Close navigation menu"
          type="button"
        >
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="nav-label">Navigate</div>
      <div className="nav-items">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.path} {...item} />
        ))}
      </div>

      <div className="auth-user-chip">
        {loading ? (
          <span>Checking account…</span>
        ) : user ? (
          <>
            <div className="auth-user-email">
              {user.user_metadata?.full_name || user.email}
            </div>
            <div className="auth-user-actions">
              <button type="button" onClick={() => void handleSignOut()}>
                Sign out
              </button>
            </div>
          </>
        ) : (
          <div className="auth-user-actions">
            <Link href="/login">Sign in</Link>
            <span style={{ color: "var(--border-mid)" }}>·</span>
            <Link href="/register">Register</Link>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-domain">
          <svg
            width="18"
            height="18"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <rect width="44" height="44" rx="9" fill="#0D3A6E" />
            <rect x="4" y="4" width="36" height="36" rx="6" fill="#1A56A0" />
            <text x="4" y="38" fontFamily="Georgia,serif" fontSize="34" fontWeight="700" fill="#FFFFFF">
              R
            </text>
            <rect x="28" y="4" width="13" height="13" rx="3" fill="#0FD8C9" />
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
          <span>renterrightsai.com</span>
        </div>
        Not legal advice. For serious matters, contact a tenant attorney or local legal aid.
      </div>
    </nav>
  );
}

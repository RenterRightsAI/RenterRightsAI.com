"use client";

import { useApp } from "@/lib/context/AppProvider";

export function Topbar() {
  const { toggleMobileNav, mobileNavOpen } = useApp();

  return (
    <header className="topbar">
      <button
        className="hamburger-btn"
        id="hamburger-btn"
        aria-label="Open navigation menu"
        aria-expanded={mobileNavOpen}
        aria-controls="sidebar-nav"
        onClick={() => toggleMobileNav()}
        type="button"
      >
        <svg viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="topbar-brand">
        <svg
          width="28"
          height="28"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
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
            fontFamily="sans-serif"
            fontSize="9"
            fontWeight="800"
            fill="#0D3A6E"
          >
            2
          </text>
        </svg>
        <span className="topbar-brand-name">Renter Rights AI</span>
      </div>
    </header>
  );
}

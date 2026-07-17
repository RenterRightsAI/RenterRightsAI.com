"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/lib/context/AppProvider";
import { PaywallModal } from "@/components/PaywallModal";
import { Toast } from "@/components/Toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { StateBar } from "@/components/layout/StateBar";
import { Topbar } from "@/components/layout/Topbar";

const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth",
];

function isShellLessRoute(pathname: string) {
  if (pathname === "/") return true;
  return AUTH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mobileNavOpen, toggleMobileNav } = useApp();

  if (isShellLessRoute(pathname)) {
    return (
      <>
        {children}
        <Toast />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div
        className={`nav-scrim${mobileNavOpen ? " open" : ""}`}
        id="nav-scrim"
        onClick={() => toggleMobileNav(false)}
        aria-hidden="true"
      />
      <div className="app-shell">
        <Sidebar />
        <main className="main" role="main">
          <StateBar />
          {children}
        </main>
      </div>
      <PaywallModal />
      <Toast />
    </>
  );
}

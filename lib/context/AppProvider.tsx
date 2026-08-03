"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { PRO_SCREENS, FREE_AI_LIMIT, FREE_LETTER_LIMIT } from "@/lib/data/constants";
import { STATE_LAWS } from "@/lib/data/state-laws";
import { useAuth } from "@/lib/context/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { IssueType, Plan, StateLaw } from "@/types";

const PRO_ROUTES: Record<string, keyof typeof PRO_SCREENS> = {
  "/timeline": "timeline",
  "/vault": "vault",
  "/attorney": "attorney",
  "/support": "support",
};

const PRO_TITLES: Record<string, string> = {
  timeline: "Case timeline — Pro only",
  vault: "Document vault — Pro only",
  attorney: "Attorney match — Pro only",
  support: "Priority support — Pro only",
};

interface AppContextValue {
  plan: Plan;
  isPro: boolean;
  planLoading: boolean;
  selectedState: string;
  setSelectedState: (state: string) => void;
  getStateLaw: () => StateLaw | null;
  aiQuestionsUsed: number;
  lettersUsed: number;
  currentIssue: IssueType | null;
  setCurrentIssue: (issue: IssueType | null) => void;
  aiPrefill: string;
  setAiPrefill: (text: string) => void;
  letterTypePrefill: string | null;
  setLetterTypePrefill: (type: string | null) => void;
  mobileNavOpen: boolean;
  toggleMobileNav: (force?: boolean) => void;
  navigate: (path: string) => void;
  showToast: (msg: string) => void;
  toastMessage: string;
  toastVisible: boolean;
  paywallOpen: boolean;
  paywallTitle: string;
  paywallSub: string;
  openPaywall: (title?: string, sub?: string) => void;
  closePaywall: () => void;
  activatePro: (interval?: "month" | "year") => Promise<void>;
  openBillingPortal: () => Promise<void>;
  refreshPlan: () => Promise<void>;
  activateOrg: () => void;
  selectFreePlan: () => void;
  tryUseAi: () => boolean;
  tryUseLetter: () => boolean;
  incrementAiUsage: () => void;
  incrementLetterUsage: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function normalizePlan(value: unknown): Plan {
  if (value === "pro" || value === "org" || value === "free") return value;
  return "free";
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [plan, setPlan] = useState<Plan>("free");
  const [planLoading, setPlanLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [aiQuestionsUsed, setAiQuestionsUsed] = useState(0);
  const [lettersUsed, setLettersUsed] = useState(0);
  const [currentIssue, setCurrentIssue] = useState<IssueType | null>(null);
  const [aiPrefill, setAiPrefill] = useState("");
  const [letterTypePrefill, setLetterTypePrefill] = useState<string | null>(
    null
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState(
    "You've reached your free limit"
  );
  const [paywallSub, setPaywallSub] = useState(
    "Upgrade to Renter Pro for unlimited access — $8/month."
  );

  const isPro = plan === "pro" || plan === "org";

  const getStateLaw = useCallback((): StateLaw | null => {
    if (!selectedState) return null;
    return STATE_LAWS[selectedState] ?? null;
  }, [selectedState]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const refreshPlan = useCallback(async () => {
    if (!user) {
      setPlan("free");
      setPlanLoading(false);
      return;
    }
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    setPlanLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("[plan] load failed", error.message);
        return;
      }

      if (!data) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email ?? null,
          plan: "free",
        });
        setPlan("free");
        return;
      }

      setPlan(normalizePlan(data.plan));
    } finally {
      setPlanLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshPlan();
  }, [refreshPlan]);

  const openPaywall = useCallback((title?: string, sub?: string) => {
    if (title) setPaywallTitle(title);
    if (sub) setPaywallSub(sub);
    setPaywallOpen(true);
  }, []);

  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const toggleMobileNav = useCallback((force?: boolean) => {
    setMobileNavOpen((open) => {
      const next = typeof force === "boolean" ? force : !open;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  const navigate = useCallback(
    (path: string) => {
      const proKey = PRO_ROUTES[path];
      if (proKey && !isPro) {
        openPaywall(PRO_TITLES[proKey], PRO_SCREENS[proKey]);
        return;
      }
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        toggleMobileNav(false);
      }
      router.push(path);
    },
    [isPro, openPaywall, router, toggleMobileNav]
  );

  const activatePro = useCallback(
    async (interval: "month" | "year" = "month") => {
      if (!user) {
        router.push("/login?next=/pricing");
        return;
      }
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval }),
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          showToast(data.error || "Could not start checkout.");
          return;
        }
        window.location.href = data.url;
      } catch {
        showToast("Could not start checkout. Try again.");
      }
    },
    [router, showToast, user]
  );

  const openBillingPortal = useCallback(async () => {
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        showToast(data.error || "Could not open billing portal.");
        return;
      }
      window.location.href = data.url;
    } catch {
      showToast("Could not open billing portal.");
    }
  }, [router, showToast, user]);

  const activateOrg = useCallback(() => {
    showToast(
      "Contact us at hello@renterrightsai.com for organization pricing."
    );
  }, [showToast]);

  const selectFreePlan = useCallback(() => {
    if (plan === "pro") {
      void openBillingPortal();
      return;
    }
    if (plan !== "free") {
      setAiQuestionsUsed(0);
      setLettersUsed(0);
      showToast("Downgraded to Free plan.");
      setPlan("free");
    }
  }, [openBillingPortal, plan, showToast]);

  const tryUseAi = useCallback(() => {
    if (!isPro && aiQuestionsUsed >= FREE_AI_LIMIT) {
      openPaywall(
        "You've used all 3 free questions",
        "Upgrade to Renter Pro for unlimited AI advice — get answers to every question about your lease, your landlord, and your rights."
      );
      return false;
    }
    return true;
  }, [aiQuestionsUsed, isPro, openPaywall]);

  const tryUseLetter = useCallback(() => {
    if (!isPro && lettersUsed >= FREE_LETTER_LIMIT) {
      openPaywall(
        "You've used your free letter",
        "Upgrade to Renter Pro for unlimited demand letters — all 5 templates with state-specific legal language, ready to send."
      );
      return false;
    }
    return true;
  }, [isPro, lettersUsed, openPaywall]);

  const incrementAiUsage = useCallback(() => {
    setAiQuestionsUsed((n) => {
      const next = n + 1;
      if (!isPro && next === FREE_AI_LIMIT) {
        showToast(
          "That was your last free question. Upgrade for unlimited advice."
        );
      }
      return next;
    });
  }, [isPro, showToast]);

  const incrementLetterUsage = useCallback(() => {
    setLettersUsed((n) => {
      const next = n + 1;
      if (!isPro && next === FREE_LETTER_LIMIT) {
        showToast("Free letter generated. Upgrade Pro for unlimited letters.");
      }
      return next;
    });
  }, [isPro, showToast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleMobileNav(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggleMobileNav]);

  const value = useMemo(
    () => ({
      plan,
      isPro,
      planLoading,
      selectedState,
      setSelectedState,
      getStateLaw,
      aiQuestionsUsed,
      lettersUsed,
      currentIssue,
      setCurrentIssue,
      aiPrefill,
      setAiPrefill,
      letterTypePrefill,
      setLetterTypePrefill,
      mobileNavOpen,
      toggleMobileNav,
      navigate,
      showToast,
      toastMessage,
      toastVisible,
      paywallOpen,
      paywallTitle,
      paywallSub,
      openPaywall,
      closePaywall,
      activatePro,
      openBillingPortal,
      refreshPlan,
      activateOrg,
      selectFreePlan,
      tryUseAi,
      tryUseLetter,
      incrementAiUsage,
      incrementLetterUsage,
    }),
    [
      plan,
      isPro,
      planLoading,
      selectedState,
      getStateLaw,
      aiQuestionsUsed,
      lettersUsed,
      currentIssue,
      aiPrefill,
      letterTypePrefill,
      mobileNavOpen,
      toggleMobileNav,
      navigate,
      showToast,
      toastMessage,
      toastVisible,
      paywallOpen,
      paywallTitle,
      paywallSub,
      openPaywall,
      closePaywall,
      activatePro,
      openBillingPortal,
      refreshPlan,
      activateOrg,
      selectFreePlan,
      tryUseAi,
      tryUseLetter,
      incrementAiUsage,
      incrementLetterUsage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useNavActive(path: string) {
  const pathname = usePathname();
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

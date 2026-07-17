import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Renter Rights AI — Know Your Rights. Protect Your Home.",
  description:
    "Instant, state-specific answers for renters — from repair disputes to eviction notices — plus AI-drafted letters and a deposit-protecting move-in checklist.",
};

export default function Page() {
  return <LandingPage />;
}

import { Suspense } from "react";
import { PricingView } from "@/components/views/PricingView";

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingView />
    </Suspense>
  );
}

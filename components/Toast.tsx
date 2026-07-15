"use client";

import { useApp } from "@/lib/context/AppProvider";

export function Toast() {
  const { toastMessage, toastVisible } = useApp();
  return (
    <div className={`toast${toastVisible ? " show" : ""}`} role="status" aria-live="polite">
      {toastMessage}
    </div>
  );
}

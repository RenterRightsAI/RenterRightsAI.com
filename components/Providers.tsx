"use client";

import { AppProvider } from "@/lib/context/AppProvider";
import { AuthProvider } from "@/lib/context/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}

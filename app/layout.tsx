import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Renter Rights AI — Know Your Rights",
  description:
    "Instant, state-specific answers for renters — from repair disputes to eviction notices — plus AI-drafted letters and a deposit-protecting move-in checklist.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Crect width='44' height='44' rx='10' fill='%230D3A6E'/%3E%3Crect x='4' y='4' width='36' height='36' rx='7' fill='%231A56A0'/%3E%3Ctext x='4' y='38' font-family='Georgia,serif' font-size='34' font-weight='700' fill='%23FFFFFF'%3ER%3C/text%3E%3Crect x='28' y='4' width='13' height='13' rx='4' fill='%230FD8C9'/%3E%3Ctext x='34.5' y='14.5' text-anchor='middle' font-family='sans-serif' font-size='9' font-weight='800' fill='%230D3A6E'%3E2%3C/text%3E%3C/svg%3E",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

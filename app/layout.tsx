import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import { AppProvider } from "@/components/providers/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluently — Your AI speaking partner between lessons",
  description:
    "Fluently helps language students practise real conversations with an AI speaking partner and gives teachers visibility into speaking progress. Portfolio demo.",
};

export const viewport: Viewport = {
  themeColor: "#F8F8F4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

import ReduxProvider from "@/components/reusable/ReduxProvider";
import { AppConfig } from "@/config/app.config";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const metroR = localFont({
  src: "../public/font/Segoe UI.ttf",
});

export const metadata: Metadata = {
  title: "MindUnite",
  description: AppConfig().app.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${metroR.className}`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

import ReduxProvider from "@/components/reusable/ReduxProvider";
import { AppConfig } from "@/config/app.config";
import "antd/dist/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });
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
      <body className={`${inter.className}`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

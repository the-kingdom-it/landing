import type { ReactNode } from "react";
import { content } from "@/content";
import { buildMetadata } from "@/lib/metadata";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata = buildMetadata(content.meta);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

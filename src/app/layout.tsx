import type { ReactNode } from "react";
import { fontVariables } from "./fonts";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

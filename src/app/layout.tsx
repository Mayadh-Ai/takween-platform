import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TAKWEEN — Thoughtful digital experiences",
    template: "%s | TAKWEEN",
  },
  description:
    "A considered approach to strategy, design, and digital experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

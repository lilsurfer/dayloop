import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dayloop — Every Daily Game & Its Unlimited Twin",
  description:
    "A sleek dark-mode playground for 39+ daily browser games and their play-forever Unlimited counterparts.",
  openGraph: {
    title: "Dayloop — Daily & Unlimited Browser Games",
    description:
      "Every daily game. And the endless versions when one isn't enough.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090B10] text-[#F8FAFC] font-sans antialiased selection:bg-sky-500/30 selection:text-sky-100">
        {children}
      </body>
    </html>
  );
}

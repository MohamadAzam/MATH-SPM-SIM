import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPM Math Exam Simulator",
  description: "Comprehensive SPM Mathematics and Additional Mathematics exam simulator with 10 random questions, timed interface, and detailed reporting.",
  keywords: ["SPM", "Mathematics", "Exam", "Simulator", "Malaysia", "Education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

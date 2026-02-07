import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polaris Cloud — GPU & CPU Compute for Africa",
  description:
    "Instant access to GPU and CPU compute power. Built for AI, machine learning, and high-performance computing across Africa and beyond.",
  icons: {
    icon: "/favicon-blue.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider dynamic appearance={{ baseTheme: undefined, variables: { colorBackground: "#0c0f20", colorText: "#E4E7F1", colorPrimary: "#2222D6", colorInputBackground: "#0e1128", colorInputText: "#E4E7F1" } }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

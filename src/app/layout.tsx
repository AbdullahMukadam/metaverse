import type { Metadata } from "next";
import { Geist, Geist_Mono, Michroma, Michroma } from "next/font/google";
import "./globals.css";
import CommonLayout from "@/common-layout/commonLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sansMichroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Meteverse",
  description: "2d Metaverse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sansMichroma.variable} antialiased max-w-[80rem] mx-auto bg-zinc-900`}
      >
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}

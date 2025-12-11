
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import "./globals.css";
import CommonLayout from "@/common-layout/commonLayout";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "./StoreProvider";

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
  title: "Metaverse",
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
        className={`${geistSans.variable} ${geistMono.variable} ${sansMichroma.variable} antialiased max-w-[90rem] mx-auto bg-zinc-900`}
        suppressHydrationWarning
      >
        <Analytics />
        <StoreProvider>
          <CommonLayout>{children}</CommonLayout>
          <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            toastOptions={{
              style: {
                zIndex: 9999,
              },
            }}
          />
        </StoreProvider>


      </body>
    </html>
  );
}

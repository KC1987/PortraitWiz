import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar/Navbar"
import ThemeProvider from "@/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer/footer"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { cn } from "@/lib/utils"
import AuthProvider from "@/providers/AuthProvider"
import { getSiteUrl } from "@/lib/seo"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const siteUrl = getSiteUrl()
const defaultDescription =
  "PortraitWiz turns reference photos into studio-quality AI headshots for LinkedIn, sales decks, and corporate branding in under a minute."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PortraitWiz | AI Professional Headshots in Minutes",
    template: "%s | PortraitWiz",
  },
  description: defaultDescription,
  keywords: [
    "AI headshot generator",
    "professional portraits",
    "LinkedIn photo",
    "PortraitWiz",
    "AI photography",
  ],
  category: "technology",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "PortraitWiz | AI Professional Headshots in Minutes",
    description: defaultDescription,
    siteName: "PortraitWiz",
    images: [
      {
        url: `${siteUrl}/bg.jpg`,
        width: 1200,
        height: 630,
        alt: "PortraitWiz AI-generated professional headshot preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PortraitWiz | AI Professional Headshots in Minutes",
    description: defaultDescription,
    images: [`${siteUrl}/bg.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <AuthProvider>
          <ThemeProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
              <Analytics />
              <SpeedInsights />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Great_Vibes, Inter, Imperial_Script, Cinzel } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { siteConfig } from "@/content/site"
import { ClientLayout } from "@/components/client-layout"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://callie-marie-baptism.vercel.app/"
const canonicalUrl = siteUrl.replace(/\/$/, "")
const desktopHero = "/Details/LinkPreview.png"
const mobileHero = "/Details/LinkPreview.png"
const eventImageUrl = `${canonicalUrl}${desktopHero}`

const coupleNames = `${siteConfig.couple.child}`
const eventTitle = `${siteConfig.couple.child} - Christening Celebration`
const eventDescription = `Celebrate the Christening of ${siteConfig.couple.child} on ${siteConfig.wedding.date} at ${siteConfig.ceremony.venue}. RSVP, explore their story, and find everything you need to join the celebration.`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${coupleNames} - Christening Celebration`,
  startDate: "2026-03-21T09:30:00+08:00",
  endDate: "2026-03-21T21:30:00+08:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: [
    {
      "@type": "Place",
      name: siteConfig.ceremony.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.ceremony.venue,
        addressLocality: siteConfig.ceremony.location,
        addressRegion: siteConfig.ceremony.location,
        addressCountry: "PH",
      },
    },
    {
      "@type": "Place",
      name: siteConfig.reception.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.reception.location,
        addressLocality: siteConfig.reception.location,
        addressRegion: siteConfig.reception.location,
        addressCountry: "PH",
      },
    },
  ],
  image: [eventImageUrl],
  description:
        `You're invited to celebrate the Christening of ${siteConfig.couple.child}. Discover ceremony and reception details, RSVP, and explore their story.`,
  organizer: {
    "@type": "Person",
    name: coupleNames,
  },
  eventHashtag: `#${siteConfig.couple.child}Christening`,
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-serif" })
const imperialScript = Imperial_Script({ subsets: ["latin"], weight: "400", variable: "--font-imperial-script" })
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cinzel" })

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: eventTitle,
    template: `%s | ${coupleNames}`,
  },
  description: eventDescription,
  keywords:
    `${siteConfig.couple.child}, Christening Celebration, ${siteConfig.ceremony.venue} Christening, ${siteConfig.reception.venue} Christening, Christening Invitation, RSVP, Christening Gallery, Message Wall, Love Story, #${siteConfig.couple.child}Christening`,
  applicationName: `${coupleNames} Christening Celebration`,
  authors: [
    { name: siteConfig.couple.child },
  ],
  creator: coupleNames,
  publisher: coupleNames,
  category: "Event",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: canonicalUrl,
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/favicon_io/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicon_io/android-chrome-512x512.png" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: `${coupleNames} - Christening Celebration`,
    description:
      `Celebrate the Christening of ${siteConfig.couple.child} on ${siteConfig.wedding.date}. Discover their story, RSVP, and find important details for the ceremony and reception.`,
    url: canonicalUrl,
    siteName: `${coupleNames} Christening Celebration`,
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: eventImageUrl,
        secureUrl: eventImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${coupleNames} - Christening Celebration`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.couple.child} - Christening Celebration`,
    description:
      `You're invited to the Christening of ${siteConfig.couple.child} on ${siteConfig.wedding.date}. RSVP, explore their story, and get all the details for the big day! #${siteConfig.couple.child}Christening`,
    images: [eventImageUrl],
    creator: `@${siteConfig.couple.child}`,
    site: `@${siteConfig.couple.child}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    title: coupleNames,
    statusBarStyle: "default",
    capable: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#D2A4A4",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#D2A4A4" />
        <meta name="format-detection" content="telephone=yes,email=no,address=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Style+Script&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kapakana:wght@300..400&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href={mobileHero} media="(max-width: 767px)" />
        <link rel="preload" as="image" href={desktopHero} media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/Details/St. Augustine Parish Church.jpg" />
        <link rel="preload" as="image" href="/Details/La Mariposa Tagaytay Events Place.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body
       className={`${inter.variable} ${greatVibes.variable} ${imperialScript.variable} ${cinzel.variable} font-inter antialiased text-foreground`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
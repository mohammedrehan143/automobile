import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BUSINESS_INFO } from "@/lib/data";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = "https://indianwheelalignment.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "INDIAN TWO AND FOUR WHEELER ALIGNMENT AND REPAIR | Bengaluru",
    template: "%s | Indian Wheel Alignment Kammanahalli",
  },
  description:
    "Expert computerized wheel alignment, motorcycle fork truing, suspension repair, alloy rim repair, and precision automotive service for cars and bikes in Kammanahalli, Bengaluru. Call 093438 42301.",
  keywords: [
    "wheel alignment in Bengaluru",
    "wheel alignment Kammanahalli",
    "car repair in Bengaluru",
    "bike repair in Bengaluru",
    "car service Kammanahalli",
    "bike service Kammanahalli",
    "wheel alignment near Kammanahalli",
    "vehicle repair Bengaluru",
    "alloy wheel repair Bengaluru",
    "suspension repair Bengaluru",
    "motorcycle handle alignment Bangalore",
    "bike fork straightening Kammanahalli",
  ],
  authors: [{ name: "Indian Two and Four Wheeler Alignment and Repair" }],
  creator: "Indian Two and Four Wheeler Alignment and Repair",
  publisher: "Indian Two and Four Wheeler Alignment and Repair",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "INDIAN TWO AND FOUR WHEELER ALIGNMENT AND REPAIR | Bengaluru",
    description:
      "Precision computerized laser wheel alignment, motorcycle fork & handle alignment, suspension overhaul, and alloy wheel repair in Kammanahalli, Bengaluru.",
    siteName: "Indian Two and Four Wheeler Alignment and Repair",
    images: [
      {
        url: "/main.avif",
        width: 1200,
        height: 630,
        alt: "Indian Two and Four Wheeler Alignment and Repair Workshop Kammanahalli Bengaluru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INDIAN TWO AND FOUR WHEELER ALIGNMENT AND REPAIR | Bengaluru",
    description:
      "Precision alignment, suspension checks, alloy wheel truing, and automotive repair for cars and bikes in Bengaluru. Call 093438 42301.",
    images: ["/main.avif"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness / AutoRepair JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: BUSINESS_INFO.name,
    alternateName: "Indian Wheel Alignment and Repair",
    image: "/main.avif",
    telephone: BUSINESS_INFO.phone,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: "60/1, Nehru Road, Opp. NKGSB Bank, St Thomas Town Extension",
      addressLocality: "Kammanahalli, Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560084",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.latitude,
      longitude: BUSINESS_INFO.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:30",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "180",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automotive Alignment and Mechanical Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Car 3D Laser Wheel Alignment",
            description: "Computerized camber, caster, and toe alignment for four-wheelers.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Two-Wheeler Handle & Fork Alignment",
            description: "Hydraulic front fork straightening, T-stem calibration, and wheel truing for motorcycles.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Alloy Wheel Repair & Truing",
            description: "Hydraulic bend removal and radial runout correction for alloy wheels.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Suspension Checks & Overhaul",
            description: "Inspection and restoration of dampers, link rods, and bushings.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Argon TIG Welding",
            description: "Precision welding for aluminium alloys, silencers, and mounts.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#08090B] text-foreground antialiased selection:bg-accent/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}

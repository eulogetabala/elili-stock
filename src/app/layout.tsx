import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elilistock.com";

export const metadata: Metadata = {
  title: {
    default: "Elili Stock | Photos, vidéos, vecteurs et fichiers sources premium",
    template: "%s | Elili Stock",
  },
  description:
    "Elili Stock : millions de photos, clips, vecteurs, PSD et fichiers Adobe Illustrator — gratuits et premium. Une marketplace moderne pour créateurs et marques.",
  keywords: [
    "stock photos",
    "vidéos stock",
    "vecteurs",
    "PSD",
    "Adobe Illustrator",
    "marketplace",
    "licence commerciale",
    "assets premium",
  ],
  authors: [{ name: "Elili Stock" }],
  creator: "Elili Stock",
  publisher: "Elili Stock",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Elili Stock",
    title: "Elili Stock | Photos, vidéos et vecteurs premium",
    description:
      "Découvrez des millions d’assets visuels et sources créatives sur Elili Stock — gratuit et premium.",
    images: [
      {
        url: "/logo-elili-stock.jpg",
        width: 1200,
        height: 630,
        alt: "Elili Stock — logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elili Stock | Photos, vidéos et vecteurs premium",
    description:
      "Banque d’images, vidéos, vecteurs et fichiers sources — Elili Stock.",
    images: ["/logo-elili-stock.jpg"],
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
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} antialiased selection:bg-primary selection:text-white font-outfit transition-colors duration-300`}
      >
        <Providers>
          <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

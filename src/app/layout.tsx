import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://maikeldrukuje.pl"),
  title: {
    default: "Maikel Drukuje - Druk 3D, Wizytówki NFC, Gadżety",
    template: "%s | Maikel Drukuje",
  },
  description: "Profesjonalny druk 3D na zamówienie, inteligentne wizytówki NFC, breloki zbliżeniowe i gadżety reklamowe. Sprawdź naszą ofertę!",
  keywords: [
    "druk 3d",
    "drukarki 3d",
    "breloki",
    "breloki 3d",
    "wizytówki",
    "wizytówki 3d",
    "wizytówki nfc",
    "gadżety reklamowe",
    "breloki nfc",
    "druk na zamówienie",
    "maikel drukuje",
    "usługi druku 3d",
    "gadżety 3d"
  ],
  authors: [{ name: "Maikel Drukuje" }],
  creator: "Maikel Drukuje",
  publisher: "Maikel Drukuje",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
  openGraph: {
    title: "Maikel Drukuje - Druk 3D i Gadżety NFC",
    description: "Profesjonalny druk 3D, wizytówki NFC i gadżety reklamowe. Zamów online!",
    url: "https://maikeldrukuje.pl",
    siteName: "Maikel Drukuje",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/hero-bg.jpg", // Upewnij się, że masz taki obrazek w public/ lub zmień na inny
        width: 1200,
        height: 630,
        alt: "Maikel Drukuje - Druk 3D",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maikel Drukuje - Druk 3D",
    description: "Profesjonalny druk 3D i gadżety NFC.",
    images: ["/hero-bg.jpg"],
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
  verification: {
    google: "TU_WPISZ_KOD_WERYFIKACJI_GOOGLE", // Użytkownik będzie musiał to uzupełnić z Search Console
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Maikel Drukuje",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`font-sans bg-gray-50 flex flex-col min-h-screen`}>
        <Providers>
            {children}
            <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
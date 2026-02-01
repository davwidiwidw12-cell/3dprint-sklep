import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maikel Drukuje",
  description: "Profesjonalny Druk 3D, Wizytówki NFC, Gadżety",
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
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
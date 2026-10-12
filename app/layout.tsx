import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TrustBadges from "@/app/components/TrustBadges";
import Toast from "@/app/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://marketplace.javnet.com.ng'),
  title: {
    default: 'Javnet Marketplace | Software, PCs and PC Gadgets in Nigeria',
    template: '%s | Javnet Marketplace',
  },
  description:
    'Buy genuine software licenses (antivirus, Windows, Office, design software), laptops, desktops and PC gadgets in Nigeria. Secure Paystack payments and fast delivery.',
  openGraph: {
    type: 'website',
    siteName: 'Javnet Marketplace',
    locale: 'en_NG',
    images: ['/logo.png'],
  },
  twitter: { card: 'summary_large_image' },
  verification: {
    google: 'fiF_6flyON5EMwu-A51tNtiXWFGbmnZ1FuiTK89GfUY',
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
     <AuthProvider>
  <CartProvider>
    <Header />
    <TrustBadges />
    <main className="flex-1">{children}</main>
    <Footer />
    <Toast />
  </CartProvider>
</AuthProvider>
      </body>
    </html>
  );
}
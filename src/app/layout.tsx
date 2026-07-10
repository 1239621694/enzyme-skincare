import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { TikTokPixel } from "@/components/tracking/TikTokPixel";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { ClarityAnalytics } from "@/components/tracking/ClarityAnalytics";

export const metadata: Metadata = {
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  },
  title: "Enzyme Skincare — Professional Enzyme-Based Skincare",
  description:
    "Science-backed enzyme skincare that activates your skin's natural renewal. Dermatologist tested, cruelty-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
        <WishlistProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSidebar />
          <CookieBanner />
          <BackToTop />
          <ToastProvider />
                </WishlistProvider>
      </CartProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
        <TikTokPixel pixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? ""} />
        <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""} />
        <ClarityAnalytics projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? ""} />
      </body>
    </html>
  );
}
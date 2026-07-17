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
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enzymeskincare.com"),
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  },
  title: {
    default: "Enzyme Skincare — Professional Enzyme-Based Skincare by BELOYAN",
    template: "%s | Enzyme Skincare",
  },
  description:
    "Enzyme Skincare offers BELOYAN professional enzyme-based skincare products. Science-backed formulations for healthier-looking skin. Worldwide shipping.",
  openGraph: {
    siteName: "Enzyme Skincare",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
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

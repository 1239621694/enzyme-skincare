"use client";
import Script from "next/script";
export function TikTokPixel({ pixelId }: { pixelId?: string }) {
  if (!pixelId) return null;
  return (<><Script id="tiktok-pixel" strategy="afterInteractive">{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setDomainNames=ttq.setDomainNames||[];(function(){var ttq=document.createElement("script");ttq.type="text/javascript";ttq.async=true;ttq.src="https://analytics.tiktok.com/i18n/pixel/events.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ttq,s)})();ttq.load("${pixelId}");ttq.page()})(window,document,"ttq");`}</Script></>);
}
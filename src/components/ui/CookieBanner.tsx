"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (level: string) => {
    localStorage.setItem("cookie-consent", level);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-neutral-300">
          We use cookies to improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => accept("essential")}>
            Essential Only
          </Button>
          <Button size="sm" onClick={() => accept("all")}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
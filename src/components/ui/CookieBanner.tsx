"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
    else {
      const saved = JSON.parse(consent);
      if (typeof saved === "object") setPrefs(saved);
    }
  }, []);

  const save = (level: string, p?: typeof prefs) => {
    if (level === "all") {
      const all = { essential: true, analytics: true, marketing: true };
      localStorage.setItem("cookie-consent", JSON.stringify(all));
      setPrefs(all);
      setShowPreferences(false);
      setVisible(false);
    } else if (level === "essential") {
      const essential = { essential: true, analytics: false, marketing: false };
      localStorage.setItem("cookie-consent", JSON.stringify(essential));
      setPrefs(essential);
      setShowPreferences(false);
      setVisible(false);
    } else if (level === "custom" && p) {
      localStorage.setItem("cookie-consent", JSON.stringify(p));
      setPrefs(p);
      setShowPreferences(false);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        {!showPreferences ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-neutral-300">
              We use cookies to improve your experience and analyze site traffic. By clicking "Accept All", you consent to our use of cookies. Read our <a href="/cookie-policy" className="underline text-primary-300 hover:text-primary-200">Cookie Policy</a> and <a href="/privacy-policy" className="underline text-primary-300 hover:text-primary-200">Privacy Policy</a>.
            </p>
            <div className="flex gap-2 flex-shrink-0 flex-wrap justify-center">
              <button className="px-3 py-1.5 text-xs rounded-full border border-white/30 text-white hover:bg-white/10" onClick={() => setShowPreferences(true)}>
                Manage Preferences
              </button>
              <button className="px-3 py-1.5 text-xs rounded-full border border-white/30 text-white hover:bg-white/10" onClick={() => save("essential")}>
                Essential Only
              </button>
              <button className="px-4 py-1.5 text-xs rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-200" onClick={() => save("all")}>
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <h3 className="text-sm font-semibold mb-3">Cookie Preferences</h3>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" checked={prefs.essential} disabled className="accent-primary-500" />
                <span>Essential (required)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} className="accent-primary-500" />
                <span>Analytics</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })} className="accent-primary-500" />
                <span>Marketing</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-200" onClick={() => save("custom", prefs)}>
                Save Preferences
              </button>
              <button className="px-4 py-1.5 text-xs rounded-full border border-white/30 text-white hover:bg-white/10" onClick={() => save("all")}>
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

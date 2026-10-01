"use client";

import { useEffect, useState } from "react";

type Settings = { enabled: boolean; autoAds: boolean; publisherId: string };

export default function AdSenseLoader() {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    fetch("/api/monetization", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!settings?.enabled || !settings.autoAds || !settings.publisherId) return;
    if (document.querySelector('script[data-carltoons-adsense="true"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(settings.publisherId)}`;
    script.crossOrigin = "anonymous";
    script.dataset.carltoonsAdsense = "true";
    document.head.appendChild(script);
  }, [settings]);

  return null;
}

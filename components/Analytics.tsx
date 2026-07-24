"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent status
    if (localStorage.getItem("cookieConsent") === "accepted") {
      setHasConsent(true);
    }

    // Listen for consent granted event from CookieBanner
    const handleConsent = () => {
      setHasConsent(true);
    };

    window.addEventListener("cookieConsentAccepted", handleConsent);

    return () => {
      window.removeEventListener("cookieConsentAccepted", handleConsent);
    };
  }, []);

  if (!hasConsent || !process.env.NEXT_PUBLIC_GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  );
}

"use client";

import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function updateGoogleConsent(granted: boolean) {
  if (typeof window !== "undefined") {
    const status = granted ? "granted" : "denied";
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: status,
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
      });
    } else {
      window.dataLayer.push([
        "consent",
        "update",
        {
          analytics_storage: status,
          ad_storage: status,
          ad_user_data: status,
          ad_personalization: status,
        },
      ]);
    }
  }
}

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      {/* Google Consent Mode v2 Defaults */}
      <Script id="google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};

          var storedConsent = typeof localStorage !== 'undefined' ? localStorage.getItem('cookieConsent') : null;
          var consentState = storedConsent === 'accepted' ? 'granted' : 'denied';

          window.gtag('consent', 'default', {
            'analytics_storage': consentState,
            'ad_storage': consentState,
            'ad_user_data': consentState,
            'ad_personalization': consentState,
            'wait_for_update': 500
          });
        `}
      </Script>

      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Google Analytics Config */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}


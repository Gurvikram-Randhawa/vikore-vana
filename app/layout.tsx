import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, Great_Vibes, Cormorant_Garamond, Jost, Alex_Brush, Sacramento } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SwarmBackground } from "@/components/SwarmBackground";
import { EntranceReveal } from "@/components/EntranceReveal";
import { QuizPopup } from "@/components/QuizPopup";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { site } from "@/lib/site";
import { getProducts } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-calligraphy", display: "swap" });
const cormorant = Cormorant_Garamond({ 
  weight: ["300", "400", "500", "600"], 
  style: ["normal", "italic"],
  subsets: ["latin"], 
  variable: "--font-cormorant", 
  display: "swap" 
});
const jost = Jost({ weight: "300", subsets: ["latin"], variable: "--font-jost", display: "swap" });
const alexBrush = Alex_Brush({ weight: "400", subsets: ["latin"], variable: "--font-alex-brush", display: "swap" });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"], variable: "--font-sacramento", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Home Decor & Interior Design Inspiration`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url
  },
  twitter: {
    card: "summary_large_image"
  },
  other: {
    "pinterest-rich-pin": "true",
    "google-site-verification": "KRtxf-ldKOW9N6uHexTvZwzj1H4kQ6z4w6I12UMapxE",
    "p:domain_verify": "f62176cdc2626f54e31126000d5c7504"
  }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="p:domain_verify"
          content="f62176cdc2626f54e31126000d5c7504"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} ${cormorant.variable} ${jost.variable} ${alexBrush.variable} ${sacramento.variable} font-sans antialiased`}>
        <Preloader />
        <EntranceReveal />
        <SmoothScroll>
          <ThemeProvider>
            <SwarmBackground />
            <Header />
            <main>{children}</main>
            <Footer />
            <QuizPopup allProducts={getProducts()} />
          </ThemeProvider>
        </SmoothScroll>

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
      </body>
    </html>
  );
}

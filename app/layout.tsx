import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, Great_Vibes, Cormorant_Garamond, Jost, Alex_Brush, Sacramento, Pinyon_Script, Italianno, Oooh_Baby, Allison } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SwarmBackground } from "@/components/SwarmBackground";
import { EntranceReveal } from "@/components/EntranceReveal";
import { QuizPopup } from "@/components/QuizPopup";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@/components/Analytics";
import { InstallPWA } from "@/components/InstallPWA";
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
const pinyonScript = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon", display: "swap" });
const italianno = Italianno({ weight: "400", subsets: ["latin"], variable: "--font-italianno", display: "swap" });
const ooohBaby = Oooh_Baby({ weight: "400", subsets: ["latin"], variable: "--font-oooh-baby", display: "swap" });
const tempting = localFont({
  src: "../public/fonts/Tempting.otf",
  variable: "--font-tempting",
  display: "swap",
});

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
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/icon.png' }
    ]
  },
  other: {
    "pinterest-rich-pin": "true",
    "google-site-verification": "KRtxf-ldKOW9N6uHexTvZwzj1H4kQ6z4w6I12UMapxE",
    "p:domain_verify": "f62176cdc2626f54e31126000d5c7504"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Optional: ensures Safari doesn't zoom out or in uncontrollably.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="p:domain_verify"
          content="f62176cdc2626f54e31126000d5c7504"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7093347-39ae-4177-ac3c-32cf55a8cc761.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} ${cormorant.variable} ${jost.variable} ${alexBrush.variable} ${sacramento.variable} ${pinyonScript.variable} ${italianno.variable} ${ooohBaby.variable} ${tempting.variable} font-sans antialiased`}>
        <Preloader />
        <EntranceReveal />
        <SmoothScroll>
          <ThemeProvider>
            <Header />
            <div className="h-14 md:h-16" /> {/* Spacer for fixed header */}
            <main>{children}</main>
            <Footer />
            <QuizPopup allProducts={getProducts()} />
          </ThemeProvider>
        </SmoothScroll>

        <CookieBanner />
        <InstallPWA />
        <Analytics />
      </body>
    </html>
  );
}

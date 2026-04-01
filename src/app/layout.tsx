import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const SITE_URL = "https://recast.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Recast — Repurpose Any Content for Every Platform",
    template: "%s | Recast",
  },
  description: "Turn blog posts and articles into Twitter threads, LinkedIn posts, video scripts, and newsletters in seconds. Free AI-powered content repurposing tool. No sign-up needed.",
  keywords: [
    "content repurposing", "repurpose content", "blog to twitter thread",
    "blog to linkedin post", "content marketing tool", "AI content generator",
    "twitter thread generator", "linkedin post generator", "video script generator",
    "newsletter generator", "content creator tools", "social media content",
    "repurpose blog posts", "content distribution", "multi-platform content",
    "content repurposing tool free", "turn article into tweet", "article to social media",
    "recast content", "content automation", "social media repurposing",
  ],
  authors: [{ name: "Recast" }],
  creator: "Recast",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Recast",
    title: "Recast — Repurpose Any Content for Every Platform",
    description: "Turn blog posts into Twitter threads, LinkedIn posts, video scripts & newsletters in seconds. Free, no sign-up needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recast — Repurpose Any Content for Every Platform",
    description: "Turn blog posts into Twitter threads, LinkedIn posts, video scripts & newsletters in seconds.",
    creator: "@joinmouse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', t === 'dark');
          } catch(e) {}
        ` }} />
        {/* Google Analytics */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            ` }} />
          </>
        )}
        {/* Structured Data — WebApplication */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Recast",
          url: SITE_URL,
          description: "Turn blog posts and articles into Twitter threads, LinkedIn posts, video scripts, and newsletters in seconds.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          author: {
            "@type": "Organization",
            name: "Recast",
          },
        }) }} />
        {/* Structured Data — FAQPage for rich snippets */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Recast?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Recast is a free AI-powered tool that turns blog posts and articles into Twitter threads, LinkedIn posts, video scripts, and newsletters in seconds.",
              },
            },
            {
              "@type": "Question",
              name: "Is Recast free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Recast is completely free. No sign-up or credit card needed. Just paste your content and generate.",
              },
            },
            {
              "@type": "Question",
              name: "What platforms does Recast support?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Recast generates content for 4 platforms: Twitter threads (with hooks and CTAs), LinkedIn posts (professional narrative), 60-second video scripts (for Reels/TikTok/Shorts), and newsletter digests.",
              },
            },
            {
              "@type": "Question",
              name: "Can I use a URL to generate content?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, you can paste any blog post or article URL and Recast will automatically extract the content and generate platform-optimized versions.",
              },
            },
          ],
        }) }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

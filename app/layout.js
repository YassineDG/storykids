import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'StoryKids by Yassine Dorgâa - AI-Powered Storytelling for Children',
  description: 'Explore StoryKids, an innovative AI-powered storytelling platform for children created by Yassine Dorgâa. Create, translate, and listen to unique stories.',
  keywords: 'Yassine Dorgâa, StoryKids, AI storytelling, children\'s stories, creative writing, technology',
  author: 'Yassine Dorgâa',
  openGraph: {
    title: 'StoryKids by Yassine Dorgâa - AI Storytelling for Kids',
    description: 'Create, translate, and listen to unique stories for children with StoryKids, an AI-powered platform by Yassine Dorgâa.',
    type: 'website',
    url: 'https://storykids.tech',
    image: 'https://storykids.tech/og-image.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://storykids.tech" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebApplication",
              "name": "StoryKids",
              "url": "https://storykids.tech",
              "description": "An innovative AI-powered platform for creating, translating, and listening to unique stories for children.",
              "applicationCategory": "EducationalApplication",
              "author": {
                "@type": "Person",
                "name": "Yassine Dorgâa",
                "url": "https://yassinedorgaa.dev",
                "sameAs": [
                  "https://x.com/yassinedorgaa",
                  "https://www.linkedin.com/in/yassinedorgaa/",
                  "https://github.com/YassineDG"
                ]
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
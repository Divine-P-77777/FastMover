import type { Metadata } from "next";

import "./globals.css";
import { Provider } from './Provider'
import Navbar from "@/components/common/Navbar";
import Script from 'next/script';
import Footer from "@/components/common/Footer";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en">
      <head>
        <title>FastMover | Your Transport Partner</title>
        <meta name="description" content="Explore the beauty and culture of India through Bharat Vibes." />
        <meta property="og:title" content="Bharat Vibes | Explore India’s Culture" />
        <meta property="og:description" content="Explore the beauty and culture of India through Bharat Vibes." />
        <meta property="og:url" content="https://fastmover.vercel.app" />
        <meta property="og:site_name" content="Fast Mover" />
        <meta property="og:image" content="https://ik.imagekit.io/sdm2vyawn77777/Images%20/logo.png?updatedAt=1745677256653" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bharat Vibes | Explore India’s Culture" />
        <meta name="twitter:description" content="Explore the beauty and culture of India through Bharat Vibes." />
        <meta name="twitter:image" content="https://ik.imagekit.io/sdm2vyawn77777/Images%20/logo.png?updatedAt=1745677256653" />
        <link rel="icon" href="/3Dlogo.png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Slab:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <link rel="manifest" href="/manifest.json" />
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="beforeInteractive"
        />
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>
      <body>
         <Provider>
        <Navbar />
       {children}
       <Footer />
       </Provider>
      </body>
    </html>
  );
}

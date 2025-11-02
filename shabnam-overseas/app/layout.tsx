// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./fonts/fonts.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/app/context/UserAuthContext";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shabnam Overseas",
  description: "Luxury Traditional Rugs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 1) Load Crisp */}
        <Script
          id="crisp-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp = window.$crisp || [];
              window.CRISP_WEBSITE_ID = "109de629-798f-4fee-954c-114b46fe90eb";
              (function() {
                var d = document;
                var s = d.createElement("script");
                s.src = "https://client.crisp.chat/l.js";
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
        {/* 2) Apply theme color when Crisp is ready */}
        <Script
          id="crisp-theme"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function applyCrispTheme(){
                function setTheme(){
                  try {
                    window.$crisp.push(["config", "color:theme", "#742402"]);
                  } catch(e) {}
                }
                // Queue it once immediately (queue will be flushed by Crisp)
                setTheme();
                // And again when Crisp signals it's ready (belt & suspenders)
                window.addEventListener("crisp:ready", setTheme);
              })();
            `,
          }}
        />

        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}

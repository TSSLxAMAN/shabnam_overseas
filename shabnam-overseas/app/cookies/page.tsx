'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CookiePolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[160px] bg-white text-black min-h-screen">
        {/* Hero — same style as Terms/Privacy */}
        <section className="relative bg-[#f5e0d8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide mb-4">
              Cookie Policy
            </h1>
            <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto">
              This Cookie Policy explains how <span className="font-semibold">SHABNAM OVERSEAS</span> uses cookies and similar technologies
              to provide, protect, and improve our website and services.
            </p>

            {/* Helpful links (centered, side-by-side) */}
            <div className="mt-6 flex justify-center gap-8 text-sm">
              <Link
                href="/privacy"
                className="underline text-[#742402] hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Privacy Policy <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/terms"
                className="underline text-[#742402] hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Terms &amp; Conditions <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Centered TOC & content */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-24">
          {/* TOC centered */}
          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-neutral-700">
            {[
              { id: 'what', label: '1. What Are Cookies?' },
              { id: 'types', label: '2. Types of Cookies We Use' },
              { id: 'list', label: '3. Cookies on This Site' },
              { id: 'manage', label: '4. Managing Cookies' },
              { id: 'consent', label: '5. Your Consent' },
              { id: 'third', label: '6. Third-Party Cookies' },
              { id: 'retention', label: '7. Retention & Lifespan' },
              { id: 'changes', label: '8. Changes to This Policy' },
              { id: 'contact', label: '9. Contact SHABNAM OVERSEAS' },
            ].map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="hover:text-[#742402] transition-colors">
                {label}
              </a>
            ))}
          </nav>

          {/* Article — centered headings & paragraphs; lists centered as blocks */}
          <article className="mt-10 mx-auto max-w-4xl text-center">
            <section id="what" className="scroll-mt-28">
              <H2>1. What Are Cookies?</H2>
              <P>
                Cookies are small text files that a website stores on your device when you visit. They help the site
                remember your actions and preferences (such as login, language, and cart items) over a period of time,
                so you don’t have to re-enter them whenever you come back to the site or browse from one page to another.
              </P>
            </section>

            <Hr />

            <section id="types" className="scroll-mt-28">
              <H2>2. Types of Cookies We Use</H2>
              <UL>
                <li>
                  <strong>Strictly Necessary:</strong> Required for core functionality (e.g., cart, checkout, security).
                </li>
                <li>
                  <strong>Performance/Analytics:</strong> Help us understand how visitors use the site so we can improve UX.
                </li>
                <li>
                  <strong>Functionality:</strong> Remember choices (like language, region, or saved preferences).
                </li>
                <li>
                  <strong>Advertising/Marketing:</strong> Used to deliver relevant ads and measure campaign performance.
                </li>
              </UL>
            </section>

            <Hr />

            <section id="list" className="scroll-mt-28">
              <H2>3. Cookies on This Site</H2>
              <P>
                Below are examples of cookies we may use. The exact set can vary over time as we update features and
                improve our website.
              </P>

              {/* Simple table centered */}
              <div className="mt-6 overflow-x-auto">
                <table className="mx-auto w-full max-w-3xl text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-3 px-2">Cookie</th>
                      <th className="py-3 px-2">Purpose</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="[&_td]:py-3 [&_td]:px-2">
                    <tr className="border-b">
                      <td>_session_id</td>
                      <td>Maintains user session (e.g., cart/login state)</td>
                      <td>Strictly Necessary</td>
                      <td>Session</td>
                    </tr>
                    <tr className="border-b">
                      <td>_prefs</td>
                      <td>Stores user preferences (region, currency)</td>
                      <td>Functionality</td>
                      <td>Up to 12 months</td>
                    </tr>
                    <tr className="border-b">
                      <td>_ga / _gid</td>
                      <td>Analytics of site usage to improve performance</td>
                      <td>Performance</td>
                      <td>Up to 24 months</td>
                    </tr>
                    <tr>
                      <td>_ad_track</td>
                      <td>Helps deliver relevant ads and measure conversions</td>
                      <td>Advertising</td>
                      <td>Varies (typically 3–12 months)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <Hr />

            <section id="manage" className="scroll-mt-28">
              <H2>4. Managing Cookies</H2>
              <P>
                You can manage or disable cookies through your browser settings. Most browsers allow you to refuse
                cookies, delete existing cookies, or receive a warning before a cookie is stored. If you disable
                certain cookies, parts of our site (like checkout) may not function properly.
              </P>
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#742402] hover:text-black transition-colors"
                >
                  Manage in Chrome
                </a>
                <a
                  href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#742402] hover:text-black transition-colors"
                >
                  Manage in Firefox
                </a>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#742402] hover:text-black transition-colors"
                >
                  Manage in Safari
                </a>
                <a
                  href="https://support.microsoft.com/microsoft-edge/view-cookies-in-microsoft-edge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#742402] hover:text-black transition-colors"
                >
                  Manage in Edge
                </a>
              </div>
            </section>

            <Hr />

            <section id="consent" className="scroll-mt-28">
              <H2>5. Your Consent</H2>
              <P>
                By using our website, you consent to the placement of cookies on your device as described in this
                policy. Where required by law, we display a cookie banner to capture your preferences.
              </P>
            </section>

            <Hr />

            <section id="third" className="scroll-mt-28">
              <H2>6. Third-Party Cookies</H2>
              <P>
                Some cookies on our site may be set by third parties (e.g., analytics, advertising partners,
                embedded content providers). We do not control these cookies. Please review the respective providers’
                policies for details on their cookie practices.
              </P>
            </section>

            <Hr />

            <section id="retention" className="scroll-mt-28">
              <H2>7. Retention &amp; Lifespan</H2>
              <P>
                Cookies can be “session” (deleted when you close your browser) or “persistent” (remain until they
                expire or you delete them). We strive to use reasonable durations aligned with their purposes.
              </P>
            </section>

            <Hr />

            <section id="changes" className="scroll-mt-28">
              <H2>8. Changes to This Policy</H2>
              <P>
                We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements,
                or our practices. Updates will be posted on this page.
              </P>
            </section>

            <Hr />

            <section id="contact" className="scroll-mt-28">
              <H2>9. Contact SHABNAM OVERSEAS</H2>
              <P>If you have questions about our use of cookies, reach us at:</P>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-6 text-sm">
                <a
                  href="mailto:cookie@shabnamoverseas.com"
                  className="underline text-[#742402]"
                >
                  cookie@shabnamoverseas.com
                </a>
                <span>+91-XXXXXXXXXX</span>
                <span>123 Handmade St, Jaipur, Rajasthan, India</span>
                <a
                  href="https://www.shabnamoverseas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#742402]"
                >
                  www.shabnamoverseas.com
                </a>
              </div>
            </section>
          </article>
        </section>
      </main>
    </>
  );
}

/* ---------- Small UI helpers (centered style) ---------- */

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl sm:text-3xl font-semibold mb-3">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed text-neutral-800 max-w-3xl mx-auto">
      {children}
    </p>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  // Center block; keep bullets aligned within the block
  return (
    <ul className="list-disc list-inside inline-block text-left text-sm leading-relaxed space-y-2 max-w-3xl mx-auto">
      {children}
    </ul>
  );
}

function Hr() {
  return <hr className="my-10 border-neutral-200 max-w-3xl mx-auto" />;
}

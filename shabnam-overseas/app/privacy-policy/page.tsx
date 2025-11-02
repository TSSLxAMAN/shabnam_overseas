'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[160px] bg-white text-black min-h-screen">
        {/* Hero — same vibe as your Terms hero */}
        <section className="relative bg-[#f5e0d8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide mb-4">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto">
              At <span className="font-semibold">SHABNAM OVERSEAS</span>, we respect your privacy and are committed to protecting it.
              This policy explains how we collect, use, and safeguard your information when you visit
              or make a purchase from our website.
            </p>

            {/* Inline helpful links (centered, side-by-side) */}
            <div className="mt-6 flex justify-center gap-8 text-sm">
              <Link
                href="/terms"
                className="underline text-[#742402] hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Terms &amp; Conditions <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cookies"
                className="underline text-[#742402] hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Cookie Policy <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Centered TOC & content */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-24">
          {/* TOC centered, side-by-side with wrap */}
          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-neutral-700">
            {[
              { id: 'collect', label: '1. Information We Collect' },
              { id: 'use', label: '2. How We Use Information' },
              { id: 'share', label: '3. Sharing Your Information' },
              { id: 'cookies', label: '4. Cookies' },
              { id: 'security', label: '5. Data Security' },
              { id: 'rights', label: '6. Your Rights' },
              { id: 'retention', label: '7. Data Retention' },
              { id: 'children', label: '8. Children’s Privacy' },
              { id: 'intl', label: '9. International Transfers' },
              { id: 'changes', label: '10. Changes to this Policy' },
              { id: 'contact', label: '11. Contact SHABNAM OVERSEAS' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="hover:text-[#742402] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Article — centered headings & paragraphs; lists centered as blocks */}
          <article className="mt-10 mx-auto max-w-4xl text-center">
            <section id="collect" className="scroll-mt-28">
              <H2>1. Information We Collect</H2>
              <P>We may collect the following information when you use our site:</P>
              <UL>
                <li>Personal details (name, email, phone number, shipping/billing address)</li>
                <li>Payment information (processed securely via third-party gateways)</li>
                <li>Device information (IP address, browser type, time zone)</li>
                <li>Browsing behavior (pages visited, items viewed or added to cart)</li>
                <li>Communications you send us (support requests, feedback)</li>
              </UL>
            </section>

            <Hr />

            <section id="use" className="scroll-mt-28">
              <H2>2. How We Use Information</H2>
              <UL>
                <li>To fulfill and manage your orders and provide customer support</li>
                <li>To communicate updates, confirmations, and relevant promotions</li>
                <li>To improve our website, products, and overall customer experience</li>
                <li>To detect and prevent fraudulent or malicious activities</li>
                <li>To comply with legal obligations</li>
              </UL>
            </section>

            <Hr />

            <section id="share" className="scroll-mt-28">
              <H2>3. Sharing Your Information</H2>
              <P>
                We share data only with trusted third parties necessary to operate our business
                (e.g., payment processors, shipping partners, analytics providers). We do <strong>not</strong> sell
                your personal information.
              </P>
            </section>

            <Hr />

            <section id="cookies" className="scroll-mt-28">
              <H2>4. Cookies</H2>
              <P>
                We use cookies to enhance your browsing experience, remember preferences, and analyze site traffic.
                You can manage cookies in your browser settings. For more details, see our{' '}
                <Link href="/cookies" className="underline text-[#742402]">
                  Cookie Policy
                </Link>.
              </P>
            </section>

            <Hr />

            <section id="security" className="scroll-mt-28">
              <H2>5. Data Security</H2>
              <P>
                We use industry-standard measures to protect your data. While no method is 100% secure, we continuously
                work to protect your information and maintain reasonable safeguards.
              </P>
            </section>

            <Hr />

            <section id="rights" className="scroll-mt-28">
              <H2>6. Your Rights</H2>
              <UL>
                <li>Request access to, correction of, or deletion of your personal data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Withdraw consent where we rely on consent</li>
              </UL>
              <P>
                To exercise your rights, contact us at{' '}
                <a href="mailto:privacy@shabnamoverseas.com" className="underline text-[#742402]">
                  privacy@shabnamoverseas.com
                </a>.
              </P>
            </section>

            <Hr />

            <section id="retention" className="scroll-mt-28">
              <H2>7. Data Retention</H2>
              <P>
                We retain personal data only as long as necessary for the purposes described in this policy—such as
                fulfilling orders, complying with legal and accounting obligations, and resolving disputes.
              </P>
            </section>

            <Hr />

            <section id="children" className="scroll-mt-28">
              <H2>8. Children’s Privacy</H2>
              <P>
                Our website is not intended for children under 13. We do not knowingly collect personal information
                from children. If you believe a child has provided us personal data, please contact us for removal.
              </P>
            </section>

            <Hr />

            <section id="intl" className="scroll-mt-28">
              <H2>9. International Data Transfers</H2>
              <P>
                Your information may be processed in countries outside your own. Where we transfer data, we take
                reasonable steps to ensure appropriate protections consistent with applicable laws.
              </P>
            </section>

            <Hr />

            <section id="changes" className="scroll-mt-28">
              <H2>10. Changes to this Policy</H2>
              <P>
                We may update this Privacy Policy from time to time. Changes will be posted on this page.
                Continued use of the site after updates constitutes acceptance of the revised policy.
              </P>
            </section>

            <Hr />

            <section id="contact" className="scroll-mt-28">
              <H2>11. Contact SHABNAM OVERSEAS</H2>
              <P>If you have privacy-related questions or requests, reach us at:</P>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-6 text-sm">
                <a href="mailto:privacy@shabnamoverseas.com" className="underline text-[#742402]">
                  privacy@shabnamoverseas.com
                </a>
                <span>+91-XXXXXXXXXX</span>
                <span>123 Handmade St, Jaipur, Rajasthan, India</span>
                <a
                  href="https://www.shabnamoverseas.com"
                  className="underline text-[#742402]"
                  target="_blank"
                  rel="noopener noreferrer"
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

/* ---------- UI helpers (centered style) ---------- */

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
  // Center the block; keep bullets aligned within the block
  return (
    <ul className="list-disc list-inside inline-block text-left text-sm leading-relaxed space-y-2 max-w-3xl mx-auto">
      {children}
    </ul>
  );
}

function Hr() {
  return <hr className="my-10 border-neutral-200 max-w-3xl mx-auto" />;
}

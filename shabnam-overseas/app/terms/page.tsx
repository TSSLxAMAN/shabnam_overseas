'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Force white version of the navbar and disable scroll-based transitions */}
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[160px] bg-white text-black min-h-screen">
        {/* Hero — match “Customize & Create” look */}
        <section className="relative bg-[#f5e0d8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto">
              Please read these terms carefully before using or purchasing from{' '}
              <span className="font-semibold">SHABNAM OVERSEAS</span>.
            </p>

            {/* Inline links (centered, side-by-side) */}
            <div className="mt-6 flex justify-center gap-8 text-sm">
              <Link
                href="/privacy-policy"
                className="underline text-[#742402] hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Privacy Policy <ArrowUpRight className="w-4 h-4" />
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

        {/* Centered content + centered TOC */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-24">
          {/* TOC centered */}
          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-neutral-700">
            {[
              { id: 'intro', label: 'Introduction' },
              { id: 'visual', label: 'Product Visual Discrepancies' },
              { id: 'copyright', label: 'Website Copyright' },
              { id: 'links', label: 'Third-Party Links' },
              { id: 'prohibited', label: 'Prohibited Activities' },
              { id: 'cards', label: 'Card & Payment Details' },
              { id: 'trademarks', label: 'Trademarks & IP' },
              { id: 'orders', label: 'Orders, Pricing & Availability' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'returns', label: 'Returns & Cancellations' },
              { id: 'warranty', label: 'Warranties & Liability' },
              { id: 'accounts', label: 'User Accounts & Security' },
              { id: 'privacy', label: 'Privacy & Cookies' },
              { id: 'arbitration', label: 'Arbitration' },
              { id: 'law', label: 'Governing Law & Jurisdiction' },
              { id: 'changes', label: 'Changes to Terms' },
              { id: 'contact', label: 'Contact SHABNAM OVERSEAS' },
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

          {/* Article — centered headings & paragraphs */}
          <article className="mt-10 mx-auto max-w-4xl text-center">
            <section id="intro" className="scroll-mt-28">
              <H2>Introduction</H2>
              <P>
                By accessing or using this website, you agree to be bound by these Terms &amp; Conditions (“Terms”).
                We may review and update these Terms at any time at our sole discretion. Each purchase made through
                our website and services is subject to these Terms. This site is owned and operated by{' '}
                <strong>SHABNAM OVERSEAS</strong>. The domain{' '}
                <strong>www.shabnamoverseas.com</strong> is registered to{' '}
                <strong>SHABNAM OVERSEAS</strong>, an entity incorporated under applicable Indian law.
              </P>
            </section>

            <Hr />

            <section id="visual" className="scroll-mt-28">
              <H2>Product Visual Discrepancies</H2>
              <P>
                We strive to depict products as accurately as possible. However, actual colors, textures, and finishes
                may vary slightly due to individual screen settings, device calibration, lighting conditions, or
                hand-crafted variations. You may request additional product photos or videos by writing to
                <a href="mailto:support@shabnamoverseas.com" className="underline text-[#742402] ml-1">
                  support@shabnamoverseas.com
                </a>.
              </P>
            </section>

            <Hr />

            <section id="copyright" className="scroll-mt-28">
              <H2>Website Copyright</H2>
              <P>
                This website (including layout, copy, imagery, and graphics) is protected by copyright.
                Any reproduction, distribution, or imitation, in whole or in part, without prior written consent from{' '}
                <strong>SHABNAM OVERSEAS</strong> is strictly prohibited. Content shared across our official social channels
                is likewise owned and protected by <strong>SHABNAM OVERSEAS</strong>.
              </P>
            </section>

            <Hr />

            <section id="links" className="scroll-mt-28">
              <H2>Third-Party Links</H2>
              <P>
                Our website may contain links to third-party sites. We do not control, endorse, or assume responsibility
                for the content, policies, or practices of any third-party websites. Accessing third-party sites is at
                your own risk.
              </P>
            </section>

            <Hr />

            <section id="prohibited" className="scroll-mt-28">
              <H2>Prohibited Activities</H2>
              <UL>
                <li>Belongs to someone else without authorization.</li>
                <li>Is harmful, unlawful, defamatory, obscene, or otherwise objectionable.</li>
                <li>Infringes any intellectual property, privacy, or publicity rights.</li>
                <li>Contains viruses, malware, or harmful code.</li>
                <li>Threatens national security or public order.</li>
                <li>Impersonates any person or entity, or misrepresents your affiliation.</li>
              </UL>
            </section>

            <Hr />

            <section id="cards" className="scroll-mt-28">
              <H2>Card &amp; Payment Details</H2>
              <P>
                You agree to provide valid, accurate payment details for transactions. Sensitive payment data is not
                stored on our servers and will not be shared except as required by law or payment processing.{' '}
                <strong>SHABNAM OVERSEAS</strong> is not liable for unauthorized use of cards, account details, or
                payment instruments.
              </P>
            </section>

            <Hr />

            <section id="trademarks" className="scroll-mt-28">
              <H2>Trademarks &amp; Intellectual Property</H2>
              <P>
                All trademarks, logos, service marks, designs, and content on this website are the property of{' '}
                <strong>SHABNAM OVERSEAS</strong> or their respective owners. No license is granted to use any intellectual
                property without prior written permission.
              </P>
            </section>

            <Hr />

            <section id="orders" className="scroll-mt-28">
              <H2>Orders, Pricing &amp; Availability</H2>
              <UL>
                <li>
                  <strong>Order Acceptance:</strong> We may refuse or cancel orders due to product unavailability,
                  pricing errors, or suspected fraud.
                </li>
                <li>
                  <strong>Pricing:</strong> Prices are listed in INR unless stated otherwise and are subject to change
                  without notice.
                </li>
                <li>
                  <strong>Taxes &amp; Duties:</strong> Applicable taxes and duties may be added at checkout.
                </li>
                <li>
                  <strong>Custom Orders:</strong> Made-to-order or customized items may have longer lead times and may
                  not be eligible for returns.
                </li>
              </UL>
            </section>

            <Hr />

            <section id="shipping" className="scroll-mt-28">
              <H2>Shipping &amp; Delivery</H2>
              <P>
                Dispatch and delivery timelines are estimates and may vary due to logistics constraints, address
                accuracy, or force majeure events. You will receive tracking details where available. Risk of loss
                passes to you upon delivery to the address provided.
              </P>
            </section>

            <Hr />

            <section id="returns" className="scroll-mt-28">
              <H2>Returns &amp; Cancellations</H2>
              <UL>
                <li>
                  Eligible returns must be requested within the specified return window and in unused, resaleable
                  condition with original packaging.
                </li>
                <li>Custom or personalized products may be non-returnable except for manufacturing defects.</li>
                <li>
                  Refunds (if applicable) will be processed to the original payment method after inspection.
                </li>
                <li>Cancellation requests are subject to processing status; shipped orders cannot be cancelled.</li>
              </UL>
            </section>

            <Hr />

            <section id="warranty" className="scroll-mt-28">
              <H2>Warranties &amp; Limitation of Liability</H2>
              <P>
                Except as expressly stated, products and services are provided “as is” without warranties of any kind,
                whether express or implied. To the fullest extent permitted by law, <strong>SHABNAM OVERSEAS</strong> shall
                not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use
                of the site or products.
              </P>
            </section>

            <Hr />

            <section id="accounts" className="scroll-mt-28">
              <H2>User Accounts &amp; Security</H2>
              <P>
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities under your account. Notify us immediately of any unauthorized use or security breach.
              </P>
            </section>

            <Hr />

            <section id="privacy" className="scroll-mt-28">
              <H2>Privacy &amp; Cookies</H2>
              <P>
                Your use of the website is also governed by our Privacy Policy and Cookie Policy. By using this site,
                you consent to the collection and use of information as described therein.
              </P>
              <div className="mt-6 flex justify-center gap-8 text-sm">
                <Link href="/privacy-policy" className="underline text-[#742402] hover:text-black transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/cookies" className="underline text-[#742402] hover:text-black transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </section>

            <Hr />

            <section id="arbitration" className="scroll-mt-28">
              <H2>Arbitration</H2>
              <P>
                In case of disputes, arbitration shall be conducted by a neutral arbitrator in Jaipur in accordance with
                the Arbitration &amp; Conciliation Act, 1996. Proceedings shall be held in English.
              </P>
            </section>

            <Hr />

            <section id="law" className="scroll-mt-28">
              <H2>Governing Law &amp; Jurisdiction</H2>
              <P>
                These Terms shall be governed by and construed in accordance with the laws of India. All disputes shall
                be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.
              </P>
            </section>

            <Hr />

            <section id="changes" className="scroll-mt-28">
              <H2>Changes to These Terms</H2>
              <P>
                We reserve the right to amend or update these Terms at any time. Material changes will be reflected by
                updating the “Last updated” date where applicable. Continued use of the website constitutes acceptance
                of the revised Terms.
              </P>
            </section>

            <Hr />

            <section id="contact" className="scroll-mt-28">
              <H2>Contact SHABNAM OVERSEAS</H2>
              <P>For questions or concerns related to these Terms, contact us:</P>

              {/* Centered contact row */}
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-6 text-sm">
                <a
                  href="mailto:support@shabnamoverseas.com"
                  className="underline text-[#742402]"
                >
                  support@shabnamoverseas.com
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

/* ---------- Small UI helpers (centered styles) ---------- */

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
  // Center the block, keep bullets aligned within
  return (
    <ul className="list-disc list-inside inline-block text-left text-sm leading-relaxed space-y-2 max-w-3xl mx-auto">
      {children}
    </ul>
  );
}

function Hr() {
  return <hr className="my-10 border-neutral-200 max-w-3xl mx-auto" />;
}

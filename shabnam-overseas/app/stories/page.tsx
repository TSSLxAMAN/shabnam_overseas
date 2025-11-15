"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StoriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[125px] bg-white text-black w-full pb-20">
        {/* Header Section (Full Width Text) */}
        <section className="text-center py-20 bg-[#f5dfd6] h-[300px] px-6">
          <h1 className="text-7xl font-[AdvercaseFont-Demo-Regular] mb-2">
            OUR STORY
          </h1>
          <p className="text-4x1 text-gray-600">
            {" "}
            CRAFTING TRADITION. WEAVING HERITAGE
          </p>
        </section>

        {/* Mirzapur Heritage */}
        <section className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mt-33 mb-20">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-[ClashDisplay-Semibold] text-center mb-4">
              A Legacy from the Heart of Mirzapur
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Nestled along the banks of the Ganges, <strong>Mirzapur</strong>{" "}
              in Uttar Pradesh has been a renowned center for handwoven carpets
              and rugs for centuries. With a history that dates back to the
              Mughal era, this city earned its reputation as one of the primary
              carpet weaving hubs of India. Known for intricate designs, vibrant
              dyes, and time-honored techniques passed down generations,
              Mirzapur rugs are not just products — they are living legacies of
              Indian craftsmanship.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md order-1 lg:order-2">
            <img
              src="/images/stories.png"
              alt="Mirzapur heritage"
              className="w-full h-[440] object-cover"
            />
          </div>
        </section>

        {/* Beginning of Shabnam Overseas */}
        <section className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src="/images/S1.jpg"
              alt="Shabnam Overseas Foundation"
              className="w-full h-[440] object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-[ClashDisplay-Semibold] text-center mb-4">
              The Beginning of Shabnam Overseas
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Born from this rich cultural tapestry,{" "}
              <strong>Shabnam Overseas</strong> began its humble journey in
              [insert founding year here]. What started as a small-scale unit
              with a handful of weavers and a shared vision has now grown into a
              recognized name in the rug export and retail market.
            </p>
            <p className="mt-4 text-base text-gray-700 leading-relaxed">
              Our foundation was built on a commitment to quality, authenticity,
              and fair trade. With deep roots in Mirzapur’s artisan communities,
              we set out to bring traditional Indian rugs to the global stage —
              without compromising on the soul of the craft.
            </p>
          </div>
        </section>

        {/* The Man Behind the Vision */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-[ClashDisplay-Semibold] mb-4">
            The Man Behind the Vision
          </h2>
          <div className="rounded-xl overflow-hidden shadow-md order-1 lg:order-2">
            <img
              src="/images/S2.jpg"
              alt="Mirzapur heritage"
              className="w-full h-[440] object-cover"
            />
          </div>
          <p className="text-base text-gray-700 leading-relaxed">
            At the helm of Shabnam Overseas is <strong>[Founder’s Name]</strong>
            , a visionary deeply connected to both the land and the loom. With a
            passion for art, culture, and entrepreneurship, he transformed a
            local weaving initiative into an international business.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Having grown up around the textures and colors of Mirzapur rugs,
            [Founder’s Name] combined his love for tradition with a keen
            business mind. His leadership has not only expanded our global
            footprint but also empowered countless artisans through consistent
            work, better wages, and skill development.
          </p>
        </section>

        {/* Growth and Recognition */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-[ClashDisplay-Semibold] mb-4">
            A Journey of Growth and Recognition
          </h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Over the years, Shabnam Overseas has grown from regional markets to
            clients across Europe, the US, the Middle East, and beyond. We’ve
            showcased our collections at international trade fairs, collaborated
            with designers and interior stylists, and become a trusted partner
            for handcrafted excellence.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Our success is rooted in maintaining integrity at every level — from
            sourcing raw materials to ensuring each rug meets international
            quality standards.
          </p>
        </section>

        {/* How We Work */}
        <section className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-[ClashDisplay-Semibold] mb-4">
            How We Work – The Art of Every Thread
          </h2>
          <ul className="text-left text-gray-700 leading-relaxed list-disc list-inside">
            <li>
              <strong>Design & Concept</strong>: Blending tradition with
              innovation, our design team works closely with weavers to create
              timeless and contemporary patterns.
            </li>
            <li>
              <strong>Material Selection</strong>: We source premium wool,
              cotton, silk, and jute — each carefully chosen for durability and
              richness.
            </li>
            <li>
              <strong>Hand Weaving</strong>: Skilled artisans, many of whom are
              second- or third-generation weavers, use time-honored techniques
              to bring designs to life.
            </li>
            <li>
              <strong>Finishing Touches</strong>: Washing, trimming, and
              quality-checking are done with utmost precision to ensure every
              rug meets our standards.
            </li>
            <li>
              <strong>Global Delivery</strong>: Our logistics team ensures
              timely and secure delivery to customers around the world.
            </li>
          </ul>
        </section>

        {/* Looking Ahead */}
        <section className="text-center max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-[ClashDisplay-Semibold] mb-4">
            Looking Ahead
          </h2>
          <p className="text-base text-gray-700 mb-6">
            As we continue to grow, our focus remains the same: honoring the
            craft, supporting our artisans, and delivering exceptional products
            to our customers. At Shabnam Overseas, we believe that every rug
            tells a story — and we are proud to be the storytellers.
          </p>
          <a
            href="/shop"
            className="inline-block bg-[#742402] hover:bg-[#5a1a01] text-white px-6 py-3 rounded-full transition"
          >
            Explore Our Collection
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}

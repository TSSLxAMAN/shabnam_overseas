"use client";

import Image from "next/image";

const featuredSections = [
  {
    id: 1,
    title: "Most-Loved & Moving Quickly",
    description:
      "Tried, true, and nearly gone. Shop the pieces everyone's loving, before they sell out.",
    buttonText: "Shop Now",
    buttonLink: "/shop?sort=popular",
    image: "/images/contact-banner.png",
  },
  {
    id: 2,
    title: "A Restful Fall Foundation",
    description:
      "Layer balance and beauty with enduring silhouettes that anchor your bedroom.",
    buttonText: "Shop Bedroom",
    buttonLink: "/shop?category=bedroom",
    image: "/images/IMG_1370.png",
  },
];

export default function FeaturedSections() {
  return (
    <section className="w-full bg-white py-16 px-6">
      <h2 className="text-center text-4xl font-[ClashDisplay-Semibold] mb-12 text-black">
        TRADITIONAL & MODERN
      </h2>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSections.map((section) => (
            <div
              key={section.id}
              className="relative group overflow-hidden bg-gray-50"
            >
              {/* Image Container */}
              <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-[ClashDisplay-Semibold] text-white mb-3">
                  {section.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base mb-4 max-w-md">
                  {section.description}
                </p>
                <a
                  href={section.buttonLink}
                  className="inline-block border border-white px-6 py-2 text-white text-sm uppercase transition duration-300 rounded-full bg-transparent hover:bg-white hover:text-black"
                >
                  {section.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

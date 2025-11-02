"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const images = [
  {
    src: "/images/homepage3.png",
    tag: "For spaces that don’t follow trends",
    headline: "Modernism, Redefined.",
  },
  {
    src: "/images/homepage2.png",
    tag: "Elegant and Enduring",
    headline: "Floral Wool Rugs",
  },
  {
    src: "/images/homepage1.png",
    tag: "Tradition Meets Modern",
    headline: "Now Trending: Flatweaves",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateText, setAnimateText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateText(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setAnimateText(true);
      }, 0);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleArrow = (dir: "left" | "right") => {
    setAnimateText(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        dir === "left"
          ? (prev - 1 + images.length) % images.length
          : (prev + 1) % images.length
      );
      setAnimateText(true);
    }, 0);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Navbar />

      {/* Slides */}
      <div
        className="absolute inset-0 w-full h-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <Image
              src={img.src}
              alt={img.headline}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Centered Overlay */}
      <div className="absolute inset-0 bg-black/40 z-20">
        <div
          className={`
            w-full h-full
            flex items-center justify-center
            px-4 sm:px-6
          `}
        >
          <div
            className={`
              max-w-2xl text-center
              transition-all duration-700
              ${
                animateText
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }
            `}
          >
            <h4 className="text-white/90 text-xs sm:text-sm font-[ClashDisplay-Semibold] uppercase tracking-wide mb-2">
              <i>{images[currentIndex].tag}</i>
            </h4>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-[AdvercaseFont-Demo-Regular] mb-6">
              {images[currentIndex].headline}
            </h1>

            <Link
              href="/style"
              aria-label="Explore Style"
              className="inline-block border border-[#742402] px-6 py-2 text-white text-sm uppercase rounded-full transition duration-300 bg-transparent hover:bg-[#742402] hover:text-[#FFFDFC]"
            >
              Explore Style
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => handleArrow("left")}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-white hover:text-sand text-2xl z-30"
      >
        ❮
      </button>
      <button
        onClick={() => handleArrow("right")}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-white hover:text-sand text-2xl z-30"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === currentIndex ? "bg-[#742402]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

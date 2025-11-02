"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const newArrivals = [
  {
    id: 1,
    title: "HAND KNOTTED",
    price: "$985.00",
    image1: "/images/best1.png",
    image2: "/images/best1.2.png",
  },
  {
    id: 2,
    title: "HAND TUFFED",
    price: "$698.00",
    image1: "/images/best2.png",
    image2: "/images/best2.2.png",
  },
  {
    id: 3,
    title: "FLAT WEAVED",
    price: "$348.00",
    image1: "/images/best3.png",
    image2: "/images/best3.3.png",
  },
  {
    id: 4,
    title: "LIVING ROOM",
    price: "From $58.00",
    image1: "/images/best4.png",
    image2: "/images/best4.4.png",
  },
];

export default function BestOfShabnam() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset:number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += offset;
    }
  };

  return (
    <section className="w-full bg-white py-16 px-6">
      <h2 className="text-center text-4xl font-[ClashDisplay-Semibold] mb-12 text-black">
        WOVEN & WORTHY
      </h2>

      <div className="relative max-w-7xl mx-auto">
        {/* Arrows */}
        <button
          onClick={() => scroll(-300)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 text-white rounded-full shadow transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-[#742402] hover:ring-2 hover:ring-[#742402]"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth sm:overflow-hidden sm:grid sm:grid-cols-2 lg:grid-cols-4"
        >
          {newArrivals.map((item) => (
            <div
              key={item.id}
              className="relative group min-w-[250px] flex-shrink-0 sm:min-w-0 overflow-hidden"
            >
              <span className="absolute top-2 left-2 bg-[#742402] text-white text-xs px-2 py-1 uppercase z-10">
                NEW
              </span>
              <div className="w-full h-80 relative overflow-hidden">
                <Image
                  src={item.image1}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:opacity-0 transition duration-500"
                />
                <Image
                  src={item.image2}
                  alt={`${item.title} Hover`}
                  layout="fill"
                  objectFit="cover"
                  className="opacity-0 group-hover:opacity-100 absolute top-0 left-0 transition duration-500"
                />
                <a href="/shop">
                  <button className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-24 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black w-[94%] py-3 text-xs uppercase shadow-md whitespace-nowrap">
                    Shop Now
                  </button>
                </a>
              </div>
              <h3 className="mt-4 text-lg font-medium text-center text-black">
                {item.title}
              </h3>
              <p className="text-sm text-center text-black">{item.price}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(300)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 text-white rounded-full shadow transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-[#742402] hover:ring-2 hover:ring-[#742402]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href="/shop?sort=newest"
          className="border border-[#742402] px-6 py-2 text-[#742402] text-sm uppercase transition duration-300 rounded-full bg-transparent hover:bg-[#742402] hover:text-[#FFFDFC]"
        >
          Explore More
        </a>
      </div>
    </section>
  );
}

'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: 'MODERN',
    image: '/images/best2.png',
    link: '/shop?category=dining-chairs'
  },
  {
    id: 2,
    title: 'TRADITIONAL',
    image: '/images/IMG_1582.png',
    link: '/shop?category=table-lamps'
  },
  {
    id: 3,
    title: 'VINTAGE',
    image: '/images/IMG_1653.png',
    link: '/shop?category=bar-stools'
  },
]

export default function ShopByCategory() {
  const scrollRef = useRef(null)

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += offset
    }
  }

  return (
    <section className="w-full bg-[#f6f5f5] py-16 px-6 overflow-x-hidden">
      <h2 className="text-center text-4xl font-[AdvercaseFont-Demo-Regular] mb-12 text-black">SHOP BY CATEGORY</h2>

      <div className="relative w-full hidden md:block">
        {/* Arrows */}
        <button
          onClick={() => scroll(-300)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 text-white rounded-full transition duration-300 hover:scale-110 hover:bg-white hover:text-[#742402] hover:ring-2 hover:ring-[#742402]"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 w-full px-2 overflow-hidden"
        >
          {categories.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="w-1/3 flex-shrink-0 group"
            >
              <div className="w-full h-[460px] relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-lg text-center text-black uppercase">{item.title}</h3>
            </a>
          ))}
        </div>

        <button
          onClick={() => scroll(300)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 text-white rounded-full transition duration-300 hover:scale-110 hover:bg-white hover:text-[#742402] hover:ring-2 hover:ring-[#742402]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Mobile View Horizontal Scroll */}
      <div className="block md:hidden overflow-x-auto scroll-smooth whitespace-nowrap space-x-4 px-2 no-scrollbar">
        {categories.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="inline-block w-[80%] align-top group"
          >
            <div className="w-full h-[400px] relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 text-base text-center text-black uppercase">{item.title}</h3>
          </a>
        ))}
      </div>

      {/* Full Width Banner */}
      <div className="relative mt-16 w-screen left-1/2 right-1/2 -translate-x-1/2 h-[400px] overflow-hidden">
        <Image
          src="/images/homepage4.png"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
  <h2 className="text-3xl md:text-4xl font-[ClashDisplay-Semibold] mb-3">
    EXPLORE OUR CRAFT
  </h2>
  <p className="text-sm md:text-base mb-4">
    <i>Timeless designs. Thoughtful materials. Crafted for your space.</i>
  </p>

  <Link
    href="/shop"
    className="border border-[#742402] px-6 py-2 text-white text-sm uppercase rounded-full hover:bg-white hover:text-[#742402] transition"
  >
    Shop Now
  </Link>
</div>
      </div>
    </section>
  )
}

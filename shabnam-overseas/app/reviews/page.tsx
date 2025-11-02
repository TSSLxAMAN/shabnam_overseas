'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Aarav Mehta',
    rating: 5,
    text: 'Absolutely beautiful rugs! The craftsmanship and texture are beyond expectations. Shabnam Exports exceeded my hopes.',
    date: 'March 2025',
  },
  {
    name: 'Priya Sharma',
    rating: 4,
    text: 'Customer service was excellent and delivery was timely. I’d love more variety in smaller sizes though.',
    date: 'April 2025',
  },
  {
    name: 'Jonathan Lee',
    rating: 5,
    text: 'I booked a call with a rug expert and it truly changed how I look at my space. Elegant service!',
    date: 'May 2025',
  },
]

export default function ReviewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[150px] bg-white text-black">
        {/* Intro Text */}
        <section className="text-center py-20 bg-[#f5dfd6] px-6">
          <h1 className="text-7xl font-[AdvercaseFont-Demo-Regular] mb-2">YOUR WORDS MATTER</h1>
          <p className="text-base text-gray-600">HEAR WHAT OUR CUSTOMERS HAVE TO SAY.</p>
        </section>


        

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <div className="space-y-8">
    {reviews.map((review, index) => (
      <div
        key={index}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6"
      >
        {/* Left: Profile + Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
            {review.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{review.name}</h3>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>

        {/* Middle: Review Text */}
        <p className="flex-1 text-sm text-gray-700 italic leading-relaxed">
          “{review.text}”
        </p>

        {/* Right: Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating
                  ? 'text-yellow-500 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

        {/* Banner Image */}
        <section className="relative  w-full h-[300px] lg:h-[400px] mt-10">
          <Image
            src="/images/contact-banner2.png" // Upload this in public/
            alt="Customer Reviews Banner"
            fill
            className="object-cover"
            priority
          />
        </section>


        {/* CTA Section */}
        <section className="text-center py-16 px-6 bg-[#f9f8f4]">
          <h2 className="text-3xl font-light mb-4">Have a story to share?</h2>
          <p className="text-sm text-gray-600 mb-6">We’d love to hear how our rugs made a difference in your space.</p>
          <a
            href="/contact"
            className="inline-block bg-[#742402] text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#742402] transition-all duration-300"
          >
            Share Your Experience
          </a>
        </section>

        <Footer />
      </main>
    </>
  )
}

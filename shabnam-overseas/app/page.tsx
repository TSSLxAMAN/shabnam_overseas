'use client'

import HeroSection from '@/components/HeroSection'
import BestOfShabnam from '@/components/BestOfShabnam'
import ShopByCategory from '@/components/ShopByCategory'
import WovenWorthy from '@/components/woven&worthy'
import Footer from '@/components/Footer'
import FeaturedSections from '@/components/FeaturedSection'


export default function Home() {
  return (
    <main>
      <HeroSection />
      <BestOfShabnam />
      <FeaturedSections/>
      <ShopByCategory />
      <WovenWorthy />
      <Footer />
      {/* Add other sections below */}
    </main>
  )
}
'use client'

import HeroSection from '@/components/HeroSection'
import BestOfShabnam from '@/components/BestOfShabnam'
import ShopByCategory from '@/components/ShopByCategory'
import WovenWorthy from '@/components/woven&worthy'
import Footer from '@/components/Footer'


export default function Home() {
  return (
    <main>
      <HeroSection />
      <BestOfShabnam />
      <ShopByCategory />
      <WovenWorthy />
      <Footer />
      {/* Add other sections below */}
    </main>
  )
}
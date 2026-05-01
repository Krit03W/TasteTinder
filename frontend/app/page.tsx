'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const CITIES = ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Koh Samui']

export default function OnboardingPage() {
  const [selected, setSelected] = useState('Bangkok')
  const router = useRouter()

  function start() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tt_location', selected)
      localStorage.removeItem('tt_liked_items')
      localStorage.removeItem('tt_trip_result')
    }
    router.push('/swipe')
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 pb-10 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-fixed opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-secondary-fixed opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-60 rounded-full bg-tertiary-fixed opacity-25 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-primary shadow-btn mb-6"
        >
          <span className="text-4xl">🍜</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[40px] font-extrabold leading-[1.1] tracking-tight text-on-surface"
        >
          Taste<span className="text-primary">Swipe</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3 text-lg font-medium text-on-surface-variant leading-relaxed"
        >
          Swipe food & places.<br />Get your perfect 1-day trip.
        </motion.p>
      </div>

      {/* Hero card collage */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative h-52 mb-10 mx-4"
      >
        {[
          { id: 'R002', label: 'Jay Fai', rotate: '-6deg', left: '0%', zIndex: 1 },
          { id: 'A002', label: 'Wat Arun', rotate: '2deg', left: '28%', zIndex: 3 },
          { id: 'A004', label: 'Yaowarat', rotate: '10deg', left: '52%', zIndex: 2 },
        ].map((card, i) => {
          const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
          return (
            <div
              key={i}
              className="absolute top-0 w-36 h-48 rounded-[24px] overflow-hidden shadow-card-float"
              style={{ left: card.left, transform: `rotate(${card.rotate})`, zIndex: card.zIndex }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${base}/pics/${card.id}.jpg`} alt={card.label} className="w-full h-full object-cover" />
            </div>
          )
        })}
      </motion.div>

      {/* Location selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mb-6"
      >
        <p className="text-sm font-semibold tracking-widest text-outline uppercase mb-3 text-center">
          Choose Your City
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelected(city)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                selected === city
                  ? 'bg-primary text-on-primary shadow-btn'
                  : 'bg-surface-high text-on-surface-variant hover:bg-surface-highest'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-auto"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={start}
          className="w-full py-4 rounded-full btn-primary-gradient text-on-primary text-lg font-bold shadow-btn tracking-wide"
        >
          Start Swiping in {selected} →
        </motion.button>
        <p className="text-center text-xs text-outline mt-3">
          Swipe right to like · Swipe left to skip
        </p>
      </motion.div>
    </div>
  )
}

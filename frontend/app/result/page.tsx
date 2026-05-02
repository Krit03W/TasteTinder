'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ItineraryTimeline from '@/components/ItineraryTimeline'
import type { TripResult } from '@/lib/types'

export default function ResultPage() {
  const [result, setResult] = useState<TripResult | null>(null)
  const [location, setLocation] = useState('Bangkok')
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('tt_trip_result')
    const loc = localStorage.getItem('tt_location')
    if (raw) setResult(JSON.parse(raw))
    if (loc) setLocation(loc)
  }, [])

  if (!result) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-5 text-center">
        <span className="text-5xl">🗺️</span>
        <p className="text-lg font-semibold text-on-surface">No trip yet</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 rounded-full bg-primary text-on-primary font-semibold shadow-btn"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Hero banner */}
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.itinerary[0]?.image || 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80'}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-card-overlay" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">Your 1-Day Trip in</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{location}</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass-nav flex items-center justify-center text-on-surface shadow"
        >
          ←
        </button>
      </div>

      {/* AI Insight card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-5 -mt-5 z-10 relative bg-primary-fixed rounded-[24px] p-5 shadow-card-coral"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1.5">AI Insight</p>
            <p className="text-sm font-medium text-on-primary-container leading-relaxed">{result.insight}</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="px-5 pt-6 pb-24">
        <h2 className="text-xl font-bold text-on-surface mb-5">Today's Itinerary</h2>
        <ItineraryTimeline items={result.itinerary} />
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-8 pt-4 glass-nav border-t border-outline-variant/30">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              localStorage.removeItem('tt_liked_items')
              localStorage.removeItem('tt_trip_result')
              router.push('/')
            }}
            className="flex-1 py-3.5 rounded-full bg-surface-high text-on-surface font-semibold text-sm"
          >
            Start Over
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/match')}
            className="flex-1 py-3.5 rounded-full btn-primary-gradient text-on-primary font-bold text-sm shadow-btn"
          >
            ✨ Re-generate
          </motion.button>
        </div>
      </div>
    </div>
  )
}

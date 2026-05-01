'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import TagChip from '@/components/TagChip'
import { generateTrip } from '@/lib/api'
import type { Item } from '@/lib/types'

export default function MatchPage() {
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('tt_liked_items')
    if (raw) setLikedItems(JSON.parse(raw))
  }, [])

  async function handleGenerate() {
    setGenerating(true)
    try {
      const ids = likedItems.map(i => i.id)
      const result = await generateTrip(ids)
      localStorage.setItem('tt_trip_result', JSON.stringify(result))
      router.push('/result')
    } catch {
      alert('Could not generate trip. Is the backend running?')
      setGenerating(false)
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }
  const cardAnim = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } },
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={() => router.push('/swipe')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-high text-on-surface-variant"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Your Matches</h1>
          <p className="text-sm text-on-surface-variant">{likedItems.length} places you loved</p>
        </div>
      </div>

      {likedItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <span className="text-6xl">😶</span>
          <p className="text-lg font-semibold text-on-surface">No likes yet</p>
          <p className="text-sm text-on-surface-variant">Go back and swipe some places!</p>
          <button
            onClick={() => router.push('/swipe')}
            className="mt-2 px-8 py-3 rounded-full bg-primary text-on-primary font-semibold shadow-btn"
          >
            Back to Swiping
          </button>
        </div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 mt-5 flex-1"
          >
            {likedItems.map(item => (
              <motion.div
                key={item.id}
                variants={cardAnim}
                className="rounded-[24px] overflow-hidden shadow-card-coral bg-surface-lowest relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-bold text-on-surface leading-tight line-clamp-2">{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.tags.slice(0, 2).map(tag => (
                      <TagChip key={tag} label={tag} small />
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow">
                  <span className="text-xs text-white">♥</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-6 left-0 right-0 px-5 max-w-md mx-auto"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 rounded-full btn-primary-gradient text-on-primary text-lg font-bold shadow-btn flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                  />
                  Analysing your taste…
                </>
              ) : (
                <>✨ Generate My Trip</>
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  )
}

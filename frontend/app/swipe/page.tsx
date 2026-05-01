'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeStack from '@/components/SwipeStack'
import { fetchItems } from '@/lib/api'
import type { Item } from '@/lib/types'

export default function SwipePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch(() => setError('Could not load items. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  function handleComplete(likedIds: string[], likedItems: Item[], dislikedIds: string[], dislikedItems: Item[]) {
    localStorage.setItem('tt_liked_items', JSON.stringify(likedItems))
    localStorage.setItem('tt_disliked_ids', JSON.stringify(dislikedIds))
    router.push('/match')
  }

  const location = typeof window !== 'undefined' ? localStorage.getItem('tt_location') || 'Bangkok' : 'Bangkok'

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-surface-high border-t-primary"
        />
        <p className="text-on-surface-variant font-medium">Loading tastes…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-5 text-center">
        <span className="text-5xl">⚠️</span>
        <p className="text-on-surface font-semibold text-lg">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-3 rounded-full bg-primary text-on-primary font-semibold"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-high text-on-surface-variant hover:bg-surface-highest transition-colors">
          ←
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-outline uppercase">{location}</p>
          <h1 className="text-lg font-bold text-on-surface">Discover</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{items.length}</span>
        </div>
      </div>

      <AnimatePresence>
        <SwipeStack items={items} onComplete={handleComplete} />
      </AnimatePresence>
    </div>
  )
}

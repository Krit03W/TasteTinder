'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import SwipeCard from './SwipeCard'
import type { Item } from '@/lib/types'

interface Props {
  items: Item[]
  onComplete: (likedIds: string[], likedItems: Item[], dislikedIds: string[], dislikedItems: Item[]) => void
}

const TYPE_COLORS: Record<string, string> = {
  food: 'bg-secondary-container text-on-secondary-container',
  cafe: 'bg-tertiary-fixed text-on-tertiary-fixed',
  place: 'bg-primary-fixed text-on-primary-container',
  dessert: 'bg-secondary-fixed text-on-secondary-container',
  activity: 'bg-surface-high text-on-surface',
}

export default function SwipeStack({ items, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [dislikedIds, setDislikedIds] = useState<string[]>([])
  const [dislikedItems, setDislikedItems] = useState<Item[]>([])
  const [lastAction, setLastAction] = useState<'like' | 'skip' | null>(null)

  const remaining = items.length - currentIndex
  const progress = currentIndex / items.length
  const visibleItems = items.slice(currentIndex, currentIndex + 3)

  function advance(liked: boolean) {
    const item = items[currentIndex]
    const nextLikedIds = liked ? [...likedIds, item.id] : likedIds
    const nextLikedItems = liked ? [...likedItems, item] : likedItems
    const nextDislikedIds = !liked ? [...dislikedIds, item.id] : dislikedIds
    const nextDislikedItems = !liked ? [...dislikedItems, item] : dislikedItems
    const nextIndex = currentIndex + 1

    setLastAction(liked ? 'like' : 'skip')
    if (liked) {
      setLikedIds(nextLikedIds)
      setLikedItems(nextLikedItems)
    } else {
      setDislikedIds(nextDislikedIds)
      setDislikedItems(nextDislikedItems)
    }
    setCurrentIndex(nextIndex)

    if (nextIndex >= items.length) {
      setTimeout(() => onComplete(nextLikedIds, nextLikedItems, nextDislikedIds, nextDislikedItems), 600)
    }
  }

  if (remaining === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="text-7xl mb-2"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-extrabold text-on-surface">All Done!</h2>
        <p className="text-on-surface-variant">{likedIds.length} places liked</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-outline mb-2">
          <span>{currentIndex} swiped</span>
          <span>{remaining} left</span>
        </div>
        <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>

      {/* Type label for current card */}
      {visibleItems[0] && (
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[visibleItems[0].type] || 'bg-surface-high text-on-surface'}`}>
            {visibleItems[0].type.toUpperCase()}
          </span>
          {lastAction === 'like' && (
            <motion.span
              key="liked"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-green-600 font-semibold"
            >
              ♥ Liked!
            </motion.span>
          )}
          {lastAction === 'skip' && (
            <motion.span
              key="skipped"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-on-surface-variant font-semibold"
            >
              Skipped
            </motion.span>
          )}
        </div>
      )}

      {/* Card stack */}
      <div className="relative flex-1" style={{ minHeight: '420px' }}>
        {[...visibleItems].reverse().map((item, reversedIndex) => {
          const stackIndex = visibleItems.length - 1 - reversedIndex
          return (
            <SwipeCard
              key={item.id}
              item={item}
              isTop={stackIndex === 0}
              stackIndex={stackIndex}
              onLike={() => advance(true)}
              onSkip={() => advance(false)}
            />
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-6 pb-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => advance(false)}
          className="w-16 h-16 rounded-full bg-surface-lowest shadow-card-coral flex items-center justify-center text-2xl border-2 border-outline-variant"
          aria-label="Skip"
        >
          ✕
        </motion.button>

        <div className="text-center">
          <p className="text-xs text-outline font-medium">
            {likedIds.length} liked
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => advance(true)}
          className="w-16 h-16 rounded-full bg-primary shadow-btn flex items-center justify-center text-2xl"
          aria-label="Like"
        >
          <span className="text-white">♥</span>
        </motion.button>
      </div>

      <p className="text-center text-xs text-outline mt-3">
        Drag the card or use buttons
      </p>
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import TagChip from './TagChip'
import type { Item } from '@/lib/types'

interface Props {
  item: Item
  isTop: boolean
  stackIndex: number
  onLike: () => void
  onSkip: () => void
}

const TYPE_EMOJI: Record<string, string> = {
  food: '🍜',
  cafe: '☕',
  place: '🏛️',
  dessert: '🍨',
  activity: '🎯',
}

export default function SwipeCard({ item, isTop, stackIndex, onLike, onSkip }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-22, 22])
  const likeOpacity = useTransform(x, [30, 110], [0, 1])
  const skipOpacity = useTransform(x, [-110, -30], [1, 0])
  const cardOpacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0])

  const isDragging = useRef(false)

  const scale = 1 - stackIndex * 0.045
  const yOffset = stackIndex * 14
  const zIndex = 10 - stackIndex

  async function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    isDragging.current = false
    const swipeVelocity = Math.abs(info.velocity.x)
    const swipeOffset = info.offset.x

    if (Math.abs(swipeOffset) > 90 || swipeVelocity > 600) {
      const dir = swipeOffset > 0 ? 1 : -1
      await animate(x, dir * 700, { duration: 0.28, ease: 'easeOut' })
      if (dir > 0) onLike()
      else onSkip()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 })
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? cardOpacity : 1,
        zIndex,
      }}
      animate={{ scale, y: yOffset }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => { isDragging.current = true }}
      onDragEnd={isTop ? handleDragEnd : undefined}
    >
      {/* Like indicator */}
      {isTop && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-7 left-6 z-20 px-4 py-1.5 rounded-full bg-green-500 border-2 border-green-400 shadow-lg pointer-events-none"
          aria-hidden
        >
          <span className="text-white font-extrabold text-base tracking-wider" style={{ transform: 'rotate(-12deg)', display: 'block' }}>
            LIKE ♥
          </span>
        </motion.div>
      )}

      {/* Skip indicator */}
      {isTop && (
        <motion.div
          style={{ opacity: skipOpacity }}
          className="absolute top-7 right-6 z-20 px-4 py-1.5 rounded-full bg-red-500 border-2 border-red-400 shadow-lg pointer-events-none"
          aria-hidden
        >
          <span className="text-white font-extrabold text-base tracking-wider" style={{ transform: 'rotate(12deg)', display: 'block' }}>
            SKIP ✕
          </span>
        </motion.div>
      )}

      {/* Card body */}
      <div
        className={`w-full h-full rounded-[32px] overflow-hidden shadow-card-float bg-surface-lowest select-none ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 gradient-card-overlay rounded-[32px]" />

        {/* Type badge */}
        <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-surface-lowest/90 backdrop-blur flex items-center justify-center shadow text-xl">
          {TYPE_EMOJI[item.type] || '📍'}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between mb-2">
            <h2 className="text-white text-[22px] font-extrabold leading-tight flex-1 mr-2 drop-shadow-sm">
              {item.name}
            </h2>
            <div className="bg-white/20 backdrop-blur rounded-full px-2.5 py-1 shrink-0">
              <span className="text-white text-sm font-bold">⭐ {item.rating}</span>
            </div>
          </div>

          <p className="text-white/75 text-sm mb-3 drop-shadow-sm flex items-center gap-1">
            <span>📍</span> {item.location}
          </p>

          <p className="text-white/80 text-sm leading-snug mb-3 line-clamp-2">{item.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map(tag => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import type { ItineraryItem } from '@/lib/types'

interface Props {
  items: ItineraryItem[]
}

const TYPE_EMOJI: Record<string, string> = {
  food: '🍜',
  cafe: '☕',
  place: '🏛️',
  dessert: '🍨',
  activity: '🎯',
}

const TYPE_LABEL: Record<string, string> = {
  food: 'Dining',
  cafe: 'Café Stop',
  place: 'Sightseeing',
  dessert: 'Dessert Break',
  activity: 'Activity',
}

const SLOT_LABEL: Record<string, string> = {
  '09:00': 'Morning',
  '12:00': 'Lunch',
  '14:30': 'Afternoon',
  '17:00': 'Golden Hour',
  '19:00': 'Evening',
}

export default function ItineraryTimeline({ items }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-outline-variant rounded-full" />

      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <motion.div
            key={`${item.name}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            className="flex gap-4"
          >
            {/* Timeline dot */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-btn z-10 relative text-lg">
                {TYPE_EMOJI[item.type] || '📍'}
              </div>
            </div>

            {/* Card */}
            <div className="flex-1 bg-surface-lowest rounded-[24px] overflow-hidden shadow-card-coral">
              {/* Image */}
              <div className="relative h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 gradient-card-overlay" />
                {/* Time badge */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur rounded-full px-3 py-1">
                  <span className="text-white text-xs font-bold">{item.time}</span>
                  {SLOT_LABEL[item.time] && (
                    <span className="text-white/70 text-xs ml-1.5">{SLOT_LABEL[item.time]}</span>
                  )}
                </div>
                {/* Type badge */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur rounded-full px-2.5 py-1">
                  <span className="text-white text-xs font-semibold">{TYPE_LABEL[item.type] || item.type}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-on-surface leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                  <span>📍</span>{item.location}
                  {item.distanceKm !== undefined && (
                    <span className="ml-1 text-outline">· {item.distanceKm} km</span>
                  )}
                </p>
                <p className="text-sm text-on-surface-variant leading-snug line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-outline">
                    {item.rating && <span>⭐ {item.rating}</span>}
                    {item.price && <span>{item.price}</span>}
                  </div>
                  {item.mapUrl && (
                    <a
                      href={item.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-primary text-xs font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      🗺️ Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

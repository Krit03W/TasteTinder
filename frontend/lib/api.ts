import type { Item, TripResult } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${BASE}/items`)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export async function generateTrip(likedIds: string[]): Promise<TripResult> {
  const res = await fetch(`${BASE}/generate-trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liked_ids: likedIds }),
  })
  if (!res.ok) throw new Error('Failed to generate trip')
  return res.json()
}

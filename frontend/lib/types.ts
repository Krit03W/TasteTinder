export interface Item {
  id: string
  name: string
  type: 'food' | 'place' | 'cafe' | 'dessert' | 'activity'
  category: string
  tags: string[]
  description: string
  image: string
  lat: number
  lng: number
  location: string
  rating: number
  price: string
}

export interface ItineraryItem {
  time: string
  type: string
  name: string
  description: string
  image: string
  lat: number
  lng: number
  location: string
  rating: number
  price: string
  distanceKm: number
  mapUrl: string
}

export interface TripResult {
  itinerary: ItineraryItem[]
  insight: string
}

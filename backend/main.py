import json
import math
import random
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="TasteTinder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent.parent / "shared" / "mockData.json"

def load_items():
    with open(DATA_PATH) as f:
        return json.load(f)

def haversine(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

class TripRequest(BaseModel):
    liked_ids: list[str]

@app.get("/items")
def get_items():
    all_items = load_items()
    return random.sample(all_items, min(20, len(all_items)))

@app.post("/generate-trip")
def generate_trip(req: TripRequest):
    all_items = load_items()
    liked = [i for i in all_items if i["id"] in req.liked_ids]

    # Count tag frequency from liked items
    tag_freq: dict[str, int] = {}
    for item in liked:
        for tag in item["tags"]:
            tag_freq[tag] = tag_freq.get(tag, 0) + 1

    # Score each item by tag match
    def score(item):
        return sum(tag_freq.get(t, 0) for t in item["tags"])

    candidates = sorted(all_items, key=score, reverse=True)

    # Pick centre point from liked items (or Bangkok centre)
    if liked:
        centre_lat = sum(i["lat"] for i in liked) / len(liked)
        centre_lng = sum(i["lng"] for i in liked) / len(liked)
    else:
        centre_lat, centre_lng = 13.7563, 100.5018

    # Build itinerary slots: cafe → food → place → food/dessert → place
    SLOTS = [
        ("09:00", ["cafe"]),
        ("12:00", ["food"]),
        ("14:30", ["place"]),
        ("17:00", ["dessert", "cafe"]),
        ("19:00", ["food", "place"]),
    ]

    itinerary = []
    used_ids: set[str] = set()

    for time_str, preferred_types in SLOTS:
        # Try preferred types first, then any
        search_order = preferred_types + [t for t in ["cafe", "food", "place", "dessert"] if t not in preferred_types]
        for slot_type in search_order:
            found = False
            for item in candidates:
                if item["id"] not in used_ids and item["type"] == slot_type:
                    # Small randomization: occasionally pick 2nd-best
                    if random.random() < 0.15 and candidates.index(item) < len(candidates) - 1:
                        continue
                    dist = haversine(centre_lat, centre_lng, item["lat"], item["lng"])
                    itinerary.append({
                        "time": time_str,
                        "type": item["type"],
                        "name": item["name"],
                        "description": item["description"],
                        "image": item["image"],
                        "lat": item["lat"],
                        "lng": item["lng"],
                        "location": item["location"],
                        "rating": item["rating"],
                        "price": item["price"],
                        "distanceKm": round(dist, 1),
                        "mapUrl": f"https://www.google.com/maps?q={item['lat']},{item['lng']}"
                    })
                    used_ids.add(item["id"])
                    found = True
                    break
            if found:
                break

    # Build insight text
    top_tags = sorted(tag_freq.items(), key=lambda x: x[1], reverse=True)[:3]
    tag_labels = [t.replace("-", " ") for t, _ in top_tags] if top_tags else ["local food", "culture", "cafés"]
    names = [i["name"] for i in itinerary]

    insight = (
        f"Your taste profile is all about {', '.join(tag_labels)}. "
        f"We curated a golden-hour Bangkok day that starts slow with morning coffee, "
        f"moves through iconic flavours at {names[1] if len(names) > 1 else 'lunch'}, "
        f"and winds down with an unforgettable evening at {names[-1] if names else 'the city'}. "
        f"Every stop was chosen to match your swipes — enjoy every bite and every moment!"
    )

    return {"itinerary": itinerary, "insight": insight}

import csv
import json
import math
import os
import random
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv(Path(__file__).parent.parent / ".env")

app = FastAPI(title="TasteSwipe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = Path(__file__).parent.parent
PICS_DIR = ROOT / "pics"
CSV_PATH = ROOT / "pics_detail.csv"

app.mount("/pics", StaticFiles(directory=str(PICS_DIR)), name="pics")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
GEMINI_MODEL = "gemini-2.5-flash"

# Approximate Bangkok coordinates per ID
COORDS: dict[str, tuple[float, float]] = {
    "A001": (13.7517, 100.4919), "A002": (13.7436, 100.4888), "A003": (13.7446, 100.4940),
    "A004": (13.7394, 100.5104), "A005": (13.7534, 100.5073), "A006": (13.7453, 100.5316),
    "A007": (13.7254, 100.5107), "A008": (13.7999, 100.5514), "A009": (13.7441, 100.5404),
    "A010": (13.7247, 100.5614), "A011": (13.7474, 100.5000), "A012": (13.7467, 100.4929),
    "A013": (13.7489, 100.5005), "A014": (13.7222, 100.5143), "A015": (13.7382, 100.4874),
    "A016": (13.7464, 100.5342), "A017": (13.7189, 100.4994), "A018": (13.7340, 100.4736),
    "A019": (13.7465, 100.5321), "A020": (13.7291, 100.5419), "A021": (13.7517, 100.4919),
    "A022": (13.7394, 100.5104), "A023": (13.7590, 100.4876), "A024": (13.7590, 100.4870),
    "A025": (13.7370, 100.5140), "A026": (13.6861, 100.4344), "A027": (13.8083, 100.5344),
    "A028": (13.7834, 100.4696), "A029": (13.7592, 100.4872), "A030": (13.7390, 100.4932),
    "A031": (13.7218, 100.5631), "A032": (13.7631, 100.5425), "A033": (13.7364, 100.5091),
    "A034": (13.7534, 100.5073), "A035": (13.7612, 100.4921), "A036": (13.7672, 100.4856),
    "A037": (13.7250, 100.5342), "A038": (13.7614, 100.5414), "A039": (13.7621, 100.5024),
    "R001": (13.7483, 100.5008), "R002": (13.7546, 100.5049), "R003": (13.7432, 100.4907),
    "R004": (13.7381, 100.5115), "R005": (13.7474, 100.5195), "R006": (13.7192, 100.5319),
    "R007": (13.7278, 100.5274), "R008": (13.7392, 100.5241), "R009": (13.7396, 100.5694),
    "R010": (13.7264, 100.5356), "R011": (13.7241, 100.5244), "R012": (13.7282, 100.5335),
    "R013": (13.7336, 100.5381), "R014": (13.7386, 100.5237), "R015": (13.7542, 100.5236),
    "R016": (13.7278, 100.5161), "R017": (13.7229, 100.5344), "R018": (13.7364, 100.5156),
    "R019": (13.8267, 100.5596), "R020": (13.7542, 100.5230), "R021": (13.7406, 100.5170),
    "R022": (13.7336, 100.5381), "R023": (13.7183, 100.5018), "R024": (13.7330, 100.5385),
    "R025": (13.7339, 100.5236), "R026": (13.7383, 100.5106), "R027": (13.7456, 100.5215),
    "R028": (13.7468, 100.5176), "R029": (13.7394, 100.5114), "R030": (13.7463, 100.5178),
    "R031": (13.7372, 100.4998),
}

LOCATION: dict[str, str] = {
    "A001": "Rattanakosin Island", "A002": "Thonburi Riverside", "A003": "Old Town",
    "A004": "Yaowarat, Chinatown", "A005": "Old Town", "A006": "Siam Area",
    "A007": "Charoennakorn", "A008": "Chatuchak", "A009": "Ratchaprasong",
    "A010": "Sukhumvit", "A011": "Old Town Riverside", "A012": "Rattanakosin",
    "A013": "Old Town Canal", "A014": "Sathorn", "A015": "Thonburi Canal",
    "A016": "Siam Paragon", "A017": "Charoen Krung Riverside", "A018": "Thonburi Canal",
    "A019": "Siam", "A020": "Silom / Lumpini", "A021": "Rattanakosin Island",
    "A022": "Chinatown", "A023": "Thonburi Riverside", "A024": "Thonburi Riverside",
    "A025": "Chinatown", "A026": "Taling Chan", "A027": "Min Buri",
    "A028": "Taling Chan", "A029": "Thonburi", "A030": "Thonburi Riverside",
    "A031": "Bangna", "A032": "Lat Phrao", "A033": "Chinatown Riverside",
    "A034": "Old Town", "A035": "Banglampu", "A036": "Thonburi",
    "A037": "Silom / Sathorn", "A038": "Dusit", "A039": "Dusit",
    "R001": "Old Town", "R002": "Old Town", "R003": "Thonburi Riverside",
    "R004": "Chinatown", "R005": "Chulalongkorn Area", "R006": "Sathorn",
    "R007": "Sathorn", "R008": "Silom", "R009": "Sukhumvit",
    "R010": "Silom", "R011": "Sathorn", "R012": "Silom",
    "R013": "Wireless Road", "R014": "Hua Ro Market", "R015": "Ekkamai",
    "R016": "Thanon Chan", "R017": "Sathorn", "R018": "Charoen Krung",
    "R019": "Pracha Chuen", "R020": "Old Town", "R021": "Chinatown",
    "R022": "Polo", "R023": "Thonburi Riverside", "R024": "Sukhumvit",
    "R025": "Yaowarat", "R026": "Chinatown", "R027": "Ratchadamnoen",
    "R028": "Old Town", "R029": "Chinatown", "R030": "Old Town",
    "R031": "Makkasan",
}

CATEGORY_TO_TYPE = {
    "Temple": "place", "Street Food": "food", "Casual Dining": "food",
    "Fine Dining": "food", "Cafe": "cafe", "Museum": "place",
    "Neighborhood": "place", "Park": "place", "Market": "place",
    "Cultural Site": "place", "Aquarium": "activity", "Viewpoint": "place",
    "Shopping": "place", "Culture": "place",
}

CATEGORY_TO_PRICE = {
    "Street Food": "฿", "Casual Dining": "฿฿", "Fine Dining": "฿฿฿฿",
    "Cafe": "฿฿", "Museum": "฿฿", "Temple": "฿", "Park": "฿",
    "Market": "฿", "Neighborhood": "฿", "Cultural Site": "฿",
    "Aquarium": "฿฿฿", "Viewpoint": "฿฿฿", "Shopping": "฿฿", "Culture": "฿",
}


def _stable_rating(item_id: str) -> float:
    h = sum(ord(c) for c in item_id)
    return round(4.1 + (h % 9) * 0.1, 1)


def load_items() -> list[dict]:
    api_base = os.getenv("API_BASE_URL", "http://localhost:8000")
    items = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item_id = row["ID"].strip()
            category = row["Category"].strip()
            tags = [t.strip() for t in row["TAG"].split(",") if t.strip()]
            lat, lng = COORDS.get(item_id, (13.7563, 100.5018))
            if not (PICS_DIR / f"{item_id}.jpg").exists():
                continue
            items.append({
                "id": item_id,
                "name": row["Name"].strip(),
                "type": CATEGORY_TO_TYPE.get(category, "place"),
                "category": category,
                "tags": tags,
                "description": row["description"].strip(),
                "image": f"{api_base}/pics/{item_id}.jpg",
                "lat": lat,
                "lng": lng,
                "location": LOCATION.get(item_id, "Bangkok"),
                "rating": _stable_rating(item_id),
                "price": CATEGORY_TO_PRICE.get(category, "฿฿"),
            })
    return items


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class TripRequest(BaseModel):
    liked_ids: list[str]
    disliked_ids: list[str] = []


@app.get("/items")
def get_items():
    all_items = load_items()
    return random.sample(all_items, min(20, len(all_items)))


def _analyze_style(liked: list[dict], disliked: list[dict]) -> dict:
    """Part 1: Use Gemini to analyze user's taste profile from liked/disliked items."""
    liked_lines = "\n".join(
        f"- {i['name']} ({i['category']}, Tags: {', '.join(i['tags'])}): \"{i['description']}\""
        for i in liked
    ) or "None"
    disliked_lines = "\n".join(
        f"- {i['name']} ({i['category']}, Tags: {', '.join(i['tags'])}): \"{i['description']}\""
        for i in disliked
    ) or "None"

    prompt = f"""You are a Bangkok travel expert. Analyze this user's taste profile from their swipe history.

LIKED places:
{liked_lines}

DISLIKED / SKIPPED places:
{disliked_lines}

Return ONLY a valid JSON object with no markdown fencing:
{{
  "vibe": "one concise sentence (10-15 words) describing the user's travel personality",
  "preferred_styles": ["tag1", "tag2", "tag3"],
  "preferred_types": ["food", "place"],
  "avoid_styles": ["tag1", "tag2"],
  "tag_weights": {{"TagName": 2, "AnotherTag": -1}}
}}

Rules:
- preferred_styles: 3-5 most representative tags from liked items
- preferred_types: item types the user prefers (food/place/cafe/activity)
- avoid_styles: 2-3 tags from disliked items
- tag_weights: positive integers (1-3) for liked tags, negative (-1 to -2) for disliked tags
"""
    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        return json.loads(response.text)
    except Exception:
        tag_freq: dict[str, int] = {}
        for item in liked:
            for tag in item["tags"]:
                tag_freq[tag] = tag_freq.get(tag, 0) + 1
        top_tags = sorted(tag_freq, key=lambda t: tag_freq[t], reverse=True)[:3]
        return {
            "vibe": "authentic explorer who loves local Bangkok flavors",
            "preferred_styles": top_tags,
            "preferred_types": list({i["type"] for i in liked}),
            "avoid_styles": [],
            "tag_weights": {t: v for t, v in tag_freq.items()},
        }


def _generate_insight(itinerary: list[dict], style: dict) -> str:
    """Part 2: Use Gemini to write a personalized AI Insight summary."""
    stops = "\n".join(
        f"{s['time']} — {s['name']} ({s['type']}): \"{s['description']}\""
        for s in itinerary
    )
    vibe = style.get("vibe", "adventurous local explorer")
    styles = ", ".join(style.get("preferred_styles", []))

    prompt = f"""You are a warm, enthusiastic Bangkok travel curator. Write a personalized summary for this curated day trip.

User's vibe: {vibe}
User's preferred styles: {styles}

Today's curated itinerary:
{stops}

Write exactly 2-3 sentences that:
- Feel personal and warm, not generic
- Mention 1-2 specific place names from the itinerary
- Explain why this day fits the user's taste
- End with a short encouraging note
- Use conversational, enthusiastic tone

Return ONLY the summary text, no formatting or extra text.
"""
    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        return response.text.strip()
    except Exception:
        names = [s["name"] for s in itinerary]
        preferred = style.get("preferred_styles", ["local food", "culture"])
        return (
            f"Your taste profile is all about {', '.join(preferred[:2])}. "
            f"We curated a golden Bangkok day starting at {names[0] if names else 'a cozy café'} "
            f"and winding down at {names[-1] if len(names) > 1 else 'an iconic spot'}. "
            f"Every stop was chosen to match your swipes — enjoy every bite and every moment!"
        )


@app.post("/generate-trip")
def generate_trip(req: TripRequest):
    all_items = load_items()
    items_by_id = {i["id"]: i for i in all_items}

    liked = [items_by_id[id] for id in req.liked_ids if id in items_by_id]
    disliked = [items_by_id[id] for id in req.disliked_ids if id in items_by_id]

    # Part 1: Gemini analyzes user style from liked vs disliked items
    style = _analyze_style(liked, disliked)
    tag_weights: dict[str, float] = style.get("tag_weights", {})
    preferred_types: list[str] = style.get("preferred_types", [])

    def score(item: dict) -> float:
        s = sum(tag_weights.get(t, 0) for t in item["tags"])
        if item["type"] in preferred_types:
            s += 1.5
        return s

    candidates = sorted(all_items, key=score, reverse=True)

    centre_lat, centre_lng = (
        (sum(i["lat"] for i in liked) / len(liked), sum(i["lng"] for i in liked) / len(liked))
        if liked else (13.7563, 100.5018)
    )

    SLOTS = [
        ("09:00", ["cafe", "place"]),
        ("12:00", ["food"]),
        ("14:30", ["place"]),
        ("17:00", ["cafe", "dessert"]),
        ("19:00", ["food", "place"]),
    ]

    itinerary = []
    used_ids: set[str] = set()

    all_types = ["cafe", "food", "place", "dessert", "activity"]
    for time_str, preferred_slot_types in SLOTS:
        search_order = preferred_slot_types + [t for t in all_types if t not in preferred_slot_types]
        slot_filled = False
        for slot_type in search_order:
            if slot_filled:
                break
            for item in candidates:
                if item["id"] not in used_ids and item["type"] == slot_type:
                    if random.random() < 0.15:
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
                        "mapUrl": f"https://www.google.com/maps?q={item['lat']},{item['lng']}",
                    })
                    used_ids.add(item["id"])
                    slot_filled = True
                    break

    # Part 2: Gemini writes personalized AI Insight
    insight = _generate_insight(itinerary, style)

    return {"itinerary": itinerary, "insight": insight, "style": style}

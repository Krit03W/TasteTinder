# TasteSwipe – Swipe-to-Trip App

Swipe food & places → get a curated 1-day Bangkok itinerary.

---

## Project Structure

```
tasteswipe/
├── frontend/   Next.js 14 (React + TypeScript + Tailwind + Framer Motion)
├── backend/    FastAPI (Python)
└── shared/     mockData.json (25 Bangkok items)
```

---

## Run the Backend

```bash
cd backend
pip3 install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API available at **http://localhost:8000**
- `GET  /items`          — returns 25 mock items
- `POST /generate-trip`  — body: `{"liked_ids": ["1","3",...]}` → itinerary + AI insight

---

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at **http://localhost:3000**

---

## User Flow

1. `/`       — Pick a city (Bangkok default) → "Start Swiping"
2. `/swipe`  — Drag cards left (skip) or right (like), or use buttons
3. `/match`  — See all liked items → "Generate My Trip"
4. `/result` — Timeline itinerary with map links and AI insight

---

## Tech Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14, React 18, TypeScript        |
| Styling   | Tailwind CSS (design.md tokens)         |
| Animation | Framer Motion (swipe drag, spring)      |
| Backend   | FastAPI, Uvicorn                        |
| Data      | JSON mock (no DB)                       |
| Font      | Plus Jakarta Sans (Google Fonts)        |

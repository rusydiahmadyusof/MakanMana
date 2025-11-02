# 🍽️ Where to Eat — Web App (Warm Foodie Theme)

## 🧭 Project Overview

**Goal:**  
Help users decide where to eat nearby — either by searching or letting the app “surprise” them.

**Theme:**  
Warm, inviting, foodie-inspired aesthetic. Amber tones, cozy vibe, smooth animations, rounded cards, minimal clutter.

**Tech Stack:**

- React (Vite)
- Tailwind CSS
- React Context + useReducer
- Framer Motion (animations)
- Google Maps / Places API
- (Optional) Recharts for analytics
- Vercel / Netlify for deployment

**Core Features:**

- Sidebar + topbar navigation
- Restaurant search + filters
- “Surprise Me” random picker
- Favorites (localStorage)
- Responsive layout
- Optional analytics dashboard

---

## 🧩 Information Architecture & Best Practices

### State Management

- Use **React Context + useReducer** for global state (`userLocation`, `restaurants`, `favorites`, `filters`, etc.)
- Use **localStorage** for favorites and theme
- Debounce input/filter changes to reduce API calls
- Separate business logic (API fetch, context) from UI components
- Store API key in `.env` (restricted by HTTP referrer)

### File Structure

src/
┣ api/
┣ components/
┣ context/
┣ hooks/
┣ pages/
┣ assets/
┣ styles/
┣ App.jsx
┗ main.jsx

yaml
Copy code

---

## 🎨 Warm Foodie Theme — Visual Style Guide

### Brand Identity

Mood: cozy, comforting, casual dining energy.  
Design goal: blend functionality with warmth.

### Color Palette

| Role          | Color   | Tailwind  | Use                 |
| ------------- | ------- | --------- | ------------------- |
| Primary       | #F59E0B | amber-500 | Buttons, highlights |
| Primary Light | #FEF3C7 | amber-100 | Backgrounds         |
| Accent        | #F87171 | red-400   | Favorites, alerts   |
| Secondary     | #78350F | amber-900 | Text, icons         |
| Neutral       | #FFF8E7 | —         | Page background     |
| Text Primary  | #374151 | gray-700  | Body text           |
| Text Light    | #9CA3AF | gray-400  | Muted text          |

**Tailwind Config:**

```js
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#F59E0B',
        light: '#FEF3C7',
        accent: '#F87171',
        dark: '#78350F',
        neutral: '#FFF8E7'
      }
    },
    boxShadow: {
      soft: '0 4px 12px rgba(0,0,0,0.08)'
    },
    borderRadius: {
      xl: '1rem',
      '2xl': '1.5rem'
    }
  }
}
Typography
Headings: Manrope or Poppins (600–700)

Body: Inter (400–500)

Apply font-manrope for headings, font-inter for body.

Components Design Rules
Component	Style
Buttons	Rounded-xl, soft shadow, hover → darker + scale
Cards	Rounded-2xl, soft shadow, image top, padded content
Navbar	Semi-transparent, sticky top
Inputs	Rounded, focus:ring-amber-300
Modals	Soft background, fade/scale motion
Empty States	Friendly emoji + warm message

Motion
Use Framer Motion for all transitions:

Card hover → scale: 1.05

Modal → fade + scale

Page transitions → slide / fade

Surprise animation → bounce/spin

🧱 UI Component Reference Library
<Navbar />
Left: 🍴 Logo + name

Right: “Favorites ❤️”, “🎲 Surprise Me”, “Dashboard 📊”

Style: bg-amber-50/80 backdrop-blur-md sticky top-0

Logic: triggers surprise modal

Motion: fade-in slide from top

<Filters />
Dropdowns: price, rating

Text input: search

Style: bg-amber-100 p-4 rounded-xl shadow-soft

Debounce input (500ms)

Dispatches SET_FILTERS

<RestaurantCard />
Image, name, rating, price, ❤️ favorite button

bg-white rounded-2xl shadow-soft hover:shadow-lg

Favorite toggles via context

Links to Google Maps

Hover animation via Framer Motion

<SurpriseModal />
Random restaurant display

Overlay + animated pop-in modal

Info + “Let’s Go!” (opens Google Maps)

Motion: fade & spring scale-in

<FavoritesPage />
Grid of saved restaurants

Persistent via localStorage

Empty state → “No favorites yet 🍕”

<DashboardPage /> (optional)
Recharts: top cuisines, avg ratings, favorites over time

Styled cards, warm theme

<LocationPrompt />
Ask for location or manual entry

Handles geolocation + fallback

Updates context → triggers fetch

<AppContext />
State:

js
Copy code
{
  userLocation: null,
  restaurants: [],
  favorites: [],
  filters: { cuisine: '', price: '', rating: '' },
  selectedRestaurant: null,
  loading: false,
  error: null
}
Actions:
SET_LOCATION, FETCH_SUCCESS, SET_FILTERS, ADD_FAVORITE, REMOVE_FAVORITE, SET_SELECTED_RESTAURANT, SET_ERROR

<SearchBar />
Search name/cuisine

Debounced input

Clear (×) button

Warm cream background

<EmptyState />
Friendly emoji + text message

Centered with soft gray tone

🧩 Project Roadmap
Phase 1 — Architecture Setup
Scaffold Vite + Tailwind + Context

Create reducer, hooks, structure

Validate: runs successfully, no context errors

Phase 2 — API Integration
Use Google Places API

Fetch restaurants by location

Cache in sessionStorage

Handle denied location gracefully

Validate: results appear, errors handled

Phase 3 — UI Layout
Build Navbar, Filters, RestaurantCard

Warm amber theme, responsive grid

Validate: responsive + consistent style

Phase 4 — Surprise Me
Add random restaurant picker

Modal with smooth animation

Validate: modal works and closes cleanly

Phase 5 — Favorites
Save/remove favorites

Sync with localStorage

Validate: persists on reload

Phase 6 — Filters & Search
Add price/rating filters + search

Debounce calls

Validate: instant results without API spam

Phase 7 — Optional Dashboard
Add charts for top cuisines, ratings

Animate charts

Validate: visual consistency

Phase 8 — QA & Deployment
Lighthouse score ≥ 90

API key restricted

Deploy via Vercel

Add favicon + meta tags + about page

✅ Final Cursor Instructions
You are an expert front-end developer.
Follow the roadmap sequentially, validating each phase before moving on.
Use the Warm Foodie visual guide and component library for all designs.
Prioritize clean architecture, modular React code, and mobile responsiveness.
Use Framer Motion for all animations.
After each phase, run a brief internal test (UI, responsiveness, data fetching).

🧪 Validation Summary
Phase	Validation
1	App boots, Context initialized
2	API connected, data fetched
3	Responsive layout OK
4	Surprise modal working
5	Favorites persist
6	Filters accurate
7	Charts render correctly
8	Lighthouse ≥90, deploy successful

🌟 Deliverables
✅ Responsive web app
✅ Google Maps integration
✅ Warm Foodie UI
✅ Favorites persistence
✅ Surprise Me feature
✅ Optional analytics dashboard
✅ Clean, testable, scalable code
```

# 🍽️ Makan Dekat Mana Oi!!!

> A warm, inviting web app that helps you decide where to eat nearby. Search for restaurants or let the app "surprise" you with a random pick!

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔍 **Restaurant Search** - Find nearby restaurants using Google Places API with real-time filtering
- 🎲 **Surprise Me** - Get a random restaurant recommendation when you can't decide
- ❤️ **Favorites** - Save your favorite restaurants (persisted in localStorage)
- 📊 **Dashboard** - View dining insights and statistics about your searches
- 🎨 **Warm Foodie Theme** - Beautiful amber-toned UI with smooth animations
- 📍 **Location-based** - Uses your browser location or enter an area/town name
- 🎯 **Advanced Filters** - Filter by price level, rating, cuisine type, search terms, and distance
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🖼️ **Image Support** - Displays restaurant photos from Google Places API
- ⚡ **Fast Performance** - Optimized with caching and debounced search

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Google Cloud Account** with billing enabled (for Places API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/makan-mana.git
   cd makan-mana
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Places API**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - **Places API (New)** or **Places API**
     - **Geocoding API**
   - Create credentials (API Key)
   - **Important**: Restrict your API key for security:
     - Go to "API restrictions" → Select "Restrict key"
     - Choose "Places API" and "Geocoding API"
     - Go to "Application restrictions" → Select "HTTP referrers"
     - Add your domain(s):
       - `localhost:5173/*`
       - `http://localhost:5173/*`
       - Your production domain (e.g., `https://yourdomain.com/*`)

4. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
   
   > ⚠️ **Important**: Replace `your_api_key_here` with your actual Google Maps API key

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
makan-mana/
├── public/
│   └── favicon.svg           # App favicon
├── src/
│   ├── api/
│   │   ├── geocodingApi.js   # Google Geocoding API integration
│   │   └── placesApi.js      # Google Places API integration
│   ├── components/
│   │   ├── EmptyState.jsx    # Empty state component
│   │   ├── Filters.jsx       # Restaurant filter controls
│   │   ├── LocationPrompt.jsx # Location input component
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── RestaurantCard.jsx # Restaurant card component
│   │   └── SurpriseModal.jsx # Surprise me modal
│   ├── context/
│   │   └── AppContext.jsx     # Global state management
│   ├── hooks/
│   │   ├── useDebounce.js    # Debounce hook for search
│   │   └── useGoogleMaps.js   # Google Maps API loader hook
│   ├── pages/
│   │   ├── DashboardPage.jsx # Analytics dashboard
│   │   ├── FavoritesPage.jsx # Favorites page
│   │   └── HomePage.jsx      # Main search page
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles and Tailwind imports
├── .env                      # Environment variables (not in git)
├── .gitignore                # Git ignore file
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md                 # This file
```

## 🎨 Tech Stack

- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Router DOM 6.20** - Client-side routing
- **Framer Motion 10.16** - Animation library
- **Google Places API** - Restaurant data
- **Google Geocoding API** - Address to coordinates conversion

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🏗️ Build for Production

1. **Build the project**
   ```bash
   npm run build
   ```
   
   The built files will be in the `dist/` directory.

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   
   Deploy the `dist/` folder to:
   - [Vercel](https://vercel.com/)
   - [Netlify](https://www.netlify.com/)
   - [GitHub Pages](https://pages.github.com/)
   - Any static hosting service

## 📖 Usage Guide

### Setting Your Location

1. **Use Browser Location**
   - Click "Use My Location 📍" button
   - Allow location access when prompted

2. **Enter Location Manually**
   - Type an area or town name (e.g., "New York", "Kuala Lumpur")
   - Click "Find Restaurants"

### Filtering Restaurants

- **Search** - Type to search by name or cuisine (debounced for performance)
- **Price Level** - Filter by budget ($), moderate ($$), expensive ($$$), or very expensive ($$$$)
- **Min Rating** - Set minimum star rating (3.0, 3.5, 4.0, or 4.5+)
- **Cuisine** - Filter by specific cuisine type (e.g., "Italian", "Asian")
- **Distance** - Set search radius in kilometers (default: 5km)

### Surprise Me Feature

- Click the "🎲 Surprise Me" button in the navbar
- Get a random restaurant recommendation from your current search results
- Click "Let's Go! 🚀" to open in Google Maps

### Favorites

- Click the heart icon (🤍) on any restaurant card to add to favorites
- View all favorites on the "Favorites ❤️" page
- Favorites are saved in localStorage and persist across sessions

### Dashboard

- View statistics including:
  - Total restaurants found
  - Number of favorites
  - Average rating
  - Top cuisines
  - Price distribution

## 🐛 Troubleshooting

### API Key Issues

**Error: "Google Maps API key is not set"**
- Ensure `.env` file exists in the root directory
- Verify the variable name is `VITE_GOOGLE_MAPS_API_KEY`
- Restart the dev server after creating/editing `.env`

**Error: "API Request Denied"**
- Check if Places API and Geocoding API are enabled in Google Cloud Console
- Verify billing is enabled on your Google Cloud project
- Ensure API key restrictions allow `localhost:5173`

**Error: "Failed to fetch"**
- Check browser console (F12) for detailed error messages
- Verify API key has correct HTTP referrer restrictions
- Ensure Places API is enabled in Google Cloud Console

### Location Issues

**Location not found**
- Try a more specific location (city name works best)
- Check spelling of the location name
- Ensure Geocoding API is enabled

**Browser location denied**
- Allow location access in browser settings
- Use manual location input instead

### Image Issues

**Restaurants without images are hidden**
- This is intentional - the app filters out restaurants without valid images
- Try adjusting your search location or filters

## 🔒 Security Best Practices

- ✅ Never commit your `.env` file (already in `.gitignore`)
- ✅ Restrict your Google API key by HTTP referrer in Google Cloud Console
- ✅ Set up API key restrictions to only allow your domains
- ✅ Monitor your API usage in Google Cloud Console
- ✅ Set up billing alerts to avoid unexpected charges

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Places API](https://developers.google.com/maps/documentation/places/web-service) for restaurant data
- [React](https://reactjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ and 🍽️

# 🍽️ Where to Eat

A warm, inviting web app that helps you decide where to eat nearby. Search for restaurants or let the app "surprise" you with a random pick!

## ✨ Features

- 🔍 **Restaurant Search**: Find nearby restaurants using Google Places API
- 🎲 **Surprise Me**: Get a random restaurant recommendation
- ❤️ **Favorites**: Save your favorite restaurants (persisted in localStorage)
- 🎨 **Warm Foodie Theme**: Beautiful amber-toned UI with smooth animations
- 📊 **Dashboard**: View dining insights and statistics
- 📍 **Location-based**: Uses your location or manual coordinates
- 🎯 **Filters**: Filter by price, rating, cuisine, and search terms

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

4. Get a Google Places API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Places API
   - Create credentials (API Key)
   - Restrict the key by HTTP referrer for security

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/           # Google Places API service
├── components/    # Reusable UI components
├── context/       # React Context for state management
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── App.jsx        # Main app component with routing
└── main.jsx       # Entry point
```

## 🎨 Tech Stack

- **React** (Vite) - Fast development and build
- **Tailwind CSS** - Styling with custom warm foodie theme
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Context + useReducer** - State management
- **Google Places API** - Restaurant data

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static hosting service.

## 🔒 Security Notes

- Never commit your `.env` file
- Restrict your Google API key by HTTP referrer in Google Cloud Console
- The API key should only work for your deployed domain

## 📝 License

MIT


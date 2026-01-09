# StreamFlix - Netflix Clone

A Netflix-style streaming platform built with Next.js, featuring movie and TV show data from TMDB. This project demonstrates a modern, responsive OTT platform design.

## 🎬 Features

- **Netflix-like UI** - Dark theme, smooth animations, responsive design
- **Movie & TV Show Browsing** - Trending, popular, top-rated, and genre-based categories
- **Search Functionality** - Real-time search across movies and TV shows
- **Video Player** - YouTube trailer playback with custom controls
- **User Profiles** - Multiple profile support with avatar customization
- **Watchlist** - Save movies and TV shows to watch later
- **Continue Watching** - Track viewing progress
- **Responsive Design** - Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Animations**: Framer Motion
- **Data**: TMDB API
- **Icons**: React Icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd movie
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your TMDB API key to `.env.local`:
```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

> Get your free API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Name: `NEXT_PUBLIC_TMDB_API_KEY`
   - Value: Your TMDB API key
6. Click "Deploy"

### Option 2: Deploy via CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variable in Vercel dashboard or via CLI:
```bash
vercel env add NEXT_PUBLIC_TMDB_API_KEY
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── movies/            # Movies page
│   ├── tv/                # TV Shows page
│   ├── movie/[id]/        # Movie details
│   ├── tv/[id]/           # TV Show details
│   ├── watch/[type]/[id]/ # Video player
│   ├── search/            # Search results
│   ├── my-list/           # Watchlist
│   ├── profiles/          # Profile management
│   ├── login/             # Authentication
│   ├── account/           # Account settings
│   └── new/               # New & Popular
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── home/              # Hero section
│   ├── movies/            # MovieCard, MovieRow, MovieModal
│   ├── player/            # VideoPlayer
│   └── providers/         # Redux Provider
├── store/
│   ├── slices/            # Redux slices
│   └── hooks.ts           # Typed hooks
├── lib/
│   ├── tmdb.ts           # TMDB API functions
│   ├── constants.ts      # Configuration
│   └── utils.ts          # Helper functions
└── types/
    └── index.ts          # TypeScript types
```

## 🔑 Key Features Explained

### Frontend-Only Authentication
User data is stored in localStorage for demo purposes. In production, integrate with Firebase Auth, Supabase, or your preferred auth provider.

### Profile Management
- Create up to 5 profiles per account
- Kids profile option with content filtering
- Customizable avatar colors

### Video Playback
The app uses official YouTube trailers from TMDB. The UI presents these as "movies" while actually playing trailers - perfect for educational/demo purposes without copyright concerns.

### Responsive Design
- Mobile: Stacked layout, touch-friendly
- Tablet: 2-column grid
- Desktop: Full Netflix-style layout with hover previews

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key (required) |

## 📝 TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 🎓 Educational Purpose

This project is built for educational purposes to demonstrate:
- Modern React/Next.js development
- State management with Redux Toolkit
- API integration
- Responsive design patterns
- Animation techniques

## 📄 License

MIT License - feel free to use this for learning and personal projects.

---
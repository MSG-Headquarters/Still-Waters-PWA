# Still Waters PWA

A mobile-friendly Progressive Web App frontend for the Still Waters AI Faith Companion platform.

## Features

- **AI Pastoral Conversations** — Claude-powered chat with empathetic, scripture-grounded responses
- **Daily Devotionals** — Rotating content with reflections, prayers, and action steps
- **Scripture Search** — Find verses by topic or keyword
- **Prayer Wall** — Community prayer requests and support
- **User Profiles** — Personalized settings and preferences

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **CSS3** — Custom properties, animations, responsive design
- **PWA** — Service worker, manifest, installable

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set Framework Preset: Vite
4. Deploy

### Option 2: Railway

1. Push to GitHub
2. Create new Railway project
3. Connect GitHub repo
4. Set build command: `npm run build`
5. Set start command: `npm run preview`

### Option 3: Netlify

1. Push to GitHub
2. Import in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Environment

The app connects to the Still Waters API at:
- **Production:** `https://stillwaters.umbrassi.com/api`

To use a different API endpoint, modify the `API_BASE` constant in `src/App.jsx`.

## Brand Assets

The design follows the Still Waters brand:
- **Primary:** Deep Navy (#0a1a20)
- **Secondary:** Teal (#1a5a6a)
- **Accent:** Gold (#c4a962)
- **Text:** Parchment (#f5f0e1)
- **Display Font:** Cormorant Garamond
- **Body Font:** Source Sans 3

## PWA Installation

Users can install the app:
- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Chrome → Menu → Add to Home Screen
- **Desktop:** Address bar install icon

## API Integration

The frontend integrates with these API endpoints:

| Feature | Endpoint |
|---------|----------|
| Auth | POST `/api/auth/login`, `/api/auth/signup` |
| User | GET/PATCH `/api/users/me` |
| Chat | GET/POST `/api/conversations`, `/api/conversations/:id/messages` |
| Devotionals | GET `/api/devotionals/today` |
| Scriptures | GET `/api/scriptures/search`, `/api/scriptures/topics` |
| Prayers | GET/POST `/api/prayers/requests` |

## Beta Testing Checklist

- [ ] Sign up / Login works
- [ ] AI chat responds appropriately
- [ ] Devotionals load daily
- [ ] Scripture search returns results
- [ ] Prayer wall displays and accepts submissions
- [ ] Profile editing saves correctly
- [ ] PWA installs on mobile devices
- [ ] Offline fallback shows gracefully

## License

MIT — MSG / Forged

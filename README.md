This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
# VLSystem Frontend

This folder contains the Next.js frontend for VLSystem.

Tech stack
- Next.js (App Router) v15
- React 19
- TypeScript
- Tailwind CSS (v4)
- Various UI and utility libraries (axios, framer-motion, react-chartjs-2, leaflet, etc.)

Quick start (development)
```powershell
cd VLSystem-Frontend
# install node dependencies
npm install
# run dev server
npm run dev
```

Production
```powershell
cd VLSystem-Frontend
npm install --production
npm run build
npm run start
```

Scripts
- `npm run dev` — start Next.js dev server (uses turbopack)
- `npm run build` — build for production
- `npm run start` — run built app
- `npm run lint` — run next lint

Dependencies (from `package.json`)
Run `npm install` will install these main dependencies. For reference, the project includes:

- @headlessui/react
- axios
- chart, chart.js, react-chartjs-2
- date, date-fns
- emailjs-com
- face-api.js
- framer-motion
- html2canvas
- jsonwebtoken, jwt-decode
- jspdf
- leaflet, react-leaflet
- lucide-react, react-icons
- mongodb (client lib used in some utilities)
- next, react, react-dom
- react-big-calendar
- react-circular-progressbar
- react-datepicker
- react-hot-toast
- react-to-print
- swiper

Dev dependencies (main ones):

- @tailwindcss/postcss
- @types/leaflet, @types/node, @types/react, @types/react-dom
- tailwindcss
- typescript

Notes
- Default dev URL: `http://localhost:3000`
- The frontend expects the backend API to be available at `http://localhost:3001` for many endpoints (see `app/commonComponents/*` where `fetch('http://localhost:3001/...')` is used).
- `next.config.ts` includes remote image patterns for `http://localhost:3001` and Cloudinary.

Environment variables
You can add a `.env.local` or `.env` in the frontend folder to declare public variables used at build/runtime; example:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Useful files and folders
- `app/layout.tsx` — root layout and font config
- `app/globals.css` — global styles
- `app/commonComponents/modals/` — shared modals (force-change password, terms, etc.)
- `app/commonComponents/loan/[id]/page.tsx` — loan detail page

Troubleshooting
- If images from the backend are blocked, ensure the backend is running and `next.config.ts` allows the origin.
- If CORS or API errors appear, verify the backend `CORS_OPTIONS` origin in `VLSystem-Backend/config.js`.

Accounts (sample test accounts)

```
MANAGER
username: managerjoseph
password: Magabilin25!

LOAN OFFICER
username: loanofficerdarren
password: Espanto25!

HEAD
username: headmark
password: Magdadaro25!

COLLECTOR
username: rosgeller
password: Geller25!
```

If you'd like, I can add a `.env.example` and a short section on how to run the frontend with a custom backend URL.

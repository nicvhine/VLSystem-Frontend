# ⚡ VLSystem Frontend

This folder contains the **Next.js** frontend for **VLSystem** — a modern web application built with a powerful React-based stack.

<<<<<<< HEAD
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
=======
---

## 🚀 Tech Stack

- ⚛️ **Next.js (App Router)** v15  
- 🧩 **React** 19  
- 🟦 **TypeScript**  
- 🎨 **Tailwind CSS** v4  
- 🧠 Various libraries:  
  `axios`, `framer-motion`, `react-chartjs-2`, `leaflet`, `react-hot-toast`, `swiper`, and more!

---

## 🧰 Getting Started

1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/VLSystem-Frontend.git
cd VLSystem-Frontend
```
2️⃣ Install dependencies
```bash
npm install
```
3️⃣ Run the development server
```bash
npm run dev
Visit 👉 http://localhost:3000
```
## 🏗️ Production Build
```bash
>>>>>>> c01c12d773252efe1e62e3bed53f5c849fecc019
cd VLSystem-Frontend
npm install --production
npm run build
npm run start
<<<<<<< HEAD
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
=======
```
## 🧾 Available Scripts
```bash
npm run dev	Start the Next.js development server (Turbopack)
npm run build	Build the app for production
npm run start	Run the production build
npm run lint	Run Next.js linting
```

## 📦 Main Dependencies
Category	Packages
UI / Components	@headlessui/react, lucide-react, react-icons, swiper
Networking	axios
Charts	chart.js, react-chartjs-2
Dates	date-fns
Documents / PDFs	jspdf, html2canvas, react-to-print
Maps	leaflet, react-leaflet
Auth	jsonwebtoken, jwt-decode
Notifications	react-hot-toast
Calendar / Progress	react-big-calendar, react-circular-progressbar
Misc.	emailjs-com, mongodb (client utilities)

## 🧑‍💻 Dev Dependencies
@tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/leaflet, tailwindcss, typescript

⚙️ Environment Variables
Create a .env.local (or .env) file in the root directory, example:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 📁 Project Structure
```bash
VLSystem-Frontend/
├── app/
│   ├── layout.tsx          # Root layout + font setup
│   ├── globals.css         # Global styles
│   └── commonComponents/   # Shared UI and API utilities
├── public/
├── components/
├── next.config.ts          # Image + API config
└── package.json
```
## 🧩 Integration Notes

🌐 Backend URL: http://localhost:3001

🖼️ Remote images: Allowed from localhost:3001 and Cloudinary

⚠️ If API or CORS issues occur:

Check backend CORS_OPTIONS in VLSystem-Backend/config.js

Ensure backend is running and accessible

## 🧠 Troubleshooting
Issue	Possible Fix
Images not loading	Verify backend is active and next.config.ts allows the source
CORS or API errors	Update backend CORS config
Missing dependencies	Run npm install again
Type errors	Check TypeScript configs and installed @types packages

🪄 Default Development URL
```bash
http://localhost:3000
```

## 🌐 Language Support
The application supports two languages:
- **English** (default)
- **Cebuano** (local language)

Built with ❤️ using Next.js and modern web technologies.

>>>>>>> c01c12d773252efe1e62e3bed53f5c849fecc019

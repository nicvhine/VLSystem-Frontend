# ⚡ VLSystem Frontend

This folder contains the **Next.js** frontend for **VLSystem** — a modern web application built with a powerful React-based stack.

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

## 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/VLSystem-Frontend.git
cd VLSystem-Frontend
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Run the development server
bash
Copy code
npm run dev
Visit 👉 http://localhost:3000
```

## 🏗️ Production Build
```bash
cd VLSystem-Frontend
npm install --production
npm run build
npm run start
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
python
VLSystem-Frontend/
├── app/
│   ├── layout.tsx          # Root layout + font setup
│   ├── globals.css         # Global styles
│   └── commonComponents/   # Shared UI and API utilities
├── public/
├── components/
├── next.config.ts          # Image + API config
└── package.json

🧩 Integration Notes

## 🌐 Backend URL: http://localhost:3001

## 🖼️ Remote images: Allowed from localhost:3001 and Cloudinary

## ⚠️ If API or CORS issues occur:

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


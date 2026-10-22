# 🌸 Ritudhara (ঋতুধারা • ऋतुधारा)
### *Next-Gen 3D Menstrual Cycle, Ovulation & Reproductive Wellness Companion*

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📖 Overview

**Ritudhara** (derived from the Sanskrit words *Ritu* meaning Season/Cycle and *Dhara* meaning Flow/Stream) is a privacy-first, 3D-animated mobile web application crafted to empower women with deep biological insights into their menstrual cycles.

Combining interactive **Three.js WebGL graphics**, evidence-based cycle science, and real-world utility, Ritudhara predicts upcoming periods, calculates ovulation windows, tracks daily wellness, and provides a **Smart Daily Bag & Pad Recommender** so you never get caught off guard.

---

## ✨ Key Features

### 1. 🪐 Interactive 3D Cycle Orb & Celestial Ring
- **Three.js WebGL Engine**: Visualizes your entire 28–35 day cycle as an orbital ring with dynamic day markers.
- **Phase-Reactive Crystalline Core**: Central gem breathes and glows according to the current biological phase:
  - 🩸 **Menstrual Phase**: Velvet Ruby Glow (`#ef4444`)
  - 🌱 **Follicular Phase**: Blossom Pink Glow (`#ec4899`)
  - ✨ **Ovulation Peak**: Radiant Sunrise Amber (`#f59e0b`)
  - 🌙 **Luteal Phase**: Amethyst Purple (`#a855f7`)
- **Interactive Gestures**: Drag and rotate 360°, inspect depth in 3D perspective, or switch to a flat 2D top-down view.
- **Ambient Stardust Particle Field**: Real-time floating dust motes that react to rotation.

### 2. 🎒 Smart Bag & Pad Carrying Recommender
- **Flow Likelihood Engine**: Dynamically calculates your flow probability for the day based on your calibrated period history.
- **Actionable Packing Checklist**:
  - **Heavy Days (Days 1–2)**: Advises 3–4 heavy pads/super tampons, dark spare underwear, and a portable heat patch.
  - **Light/Tapering (Days 3–5)**: Advises 2 regular pads or menstrual cup + pantyliner.
  - **Imminent Period Alert (≤ 2 days away)**: Reminds you to carry 2 emergency pads and wear a safety liner.
  - **Ovulation Peak**: Recommends breathable pantyliners for mid-cycle discharge.
  - **Low Risk / Luteal**: Advises packing light with just 1 emergency liner in your pouch.
- **Interactive Checklist**: Tap items to check them off as you pack your bag each morning.

### 3. 📅 Cycle Calendar & Ovulation Predictor
- Full month calendar view displaying:
  - Estimated future period dates
  - Conception likelihood & fertile window
  - Exact ovulation day marker
  - Indicator dots for days with logged symptoms
- Tap on any historical or future day to view day-specific cycle details or log retroactive data.

### 4. 📝 Daily Symptom & Wellness Logger
- **Bleeding Flow**: Spotting, Light, Medium, Heavy.
- **Mood Tracking**: Happy, Calm, Sensitive, Tired, Anxious, Irritable.
- **Physical Symptoms**: Cramps, Headache, Bloating, Acne, Tender Breasts, Backache, Food Cravings, Fatigue.
- **Hydration Tracker**: Interactive 8-glass water counter.
- **Confetti Celebration**: Instant micro-interaction feedback upon saving daily logs.

### 5. 🔬 Cycle Science & Hormonal Insights
- Tailored lifestyle guidance matched to your active phase:
  - **Hormone Balance**: Progesterone and Estrogen trajectory explanations.
  - **Nutritional Guidance**: Recommended nutrients (iron-rich foods, magnesium, anti-inflammatory meals, complex carbs).
  - **Optimal Workouts**: Yin yoga, strength training, HIIT, or restorative stretching based on physiological energy levels.

### 6. 📱 PWA (Progressive Web App) & Mobile First
- Installable directly to iOS (Safari "Add to Home Screen") and Android (Chrome WebAPK).
- Built-in Service Worker (`sw.js`) for instant loading and 100% offline functionality.
- Mobile simulator wrapper on desktop view for optimal responsive previewing.

### 7. 🔒 100% Local-First Privacy (Zero Database Needed)
- **Zero Cloud Tracking**: All period dates, sexual health logs, and personal notes are stored strictly on the user's device via `localStorage`.
- **Data Portability**: Built-in 1-click **JSON Backup Export** and **Restore** in the Settings menu.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **3D Rendering** | [Three.js (WebGL)](https://threejs.org/) |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com/) + Custom Glassmorphism CSS |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Delight / FX** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **PWA & Offline** | Web Manifest, Service Worker Cache |
| **Deployment** | [Netlify](https://www.netlify.com/) (Serverless Single Page App) |

---

## 📂 Project Architecture

```
Ritudhara/
├── index.html                   # HTML entry point, PWA meta tags & fonts
├── netlify.toml                 # Netlify SPA redirect & build config
├── package.json                 # Project dependencies & scripts
├── public/
│   ├── icon.svg                 # Application logo & PWA icon
│   ├── manifest.json            # Web App Manifest for mobile installation
│   └── sw.js                    # Service Worker for offline asset caching
├── src/
│   ├── App.jsx                  # Main container, routing & modal management
│   ├── index.css                # Base Tailwind imports & custom animations
│   ├── main.jsx                 # React root render entry
│   ├── components/
│   │   ├── BagRecommendationView.jsx # Smart daily packing checklist
│   │   ├── CalendarView.jsx          # Month grid & phase visualization
│   │   ├── CycleScene3D.jsx          # Three.js 3D orbital cycle scene
│   │   ├── CycleView.jsx             # Active phase card, countdown & stats
│   │   ├── Header.jsx                # App title & quick actions
│   │   ├── InsightsView.jsx          # Hormonal guide & phase nutrition
│   │   ├── InstallAppModal.jsx       # PWA mobile installation modal
│   │   ├── LogModal.jsx              # Daily symptom & mood logger
│   │   ├── Navigation.jsx            # Bottom mobile navigation bar
│   │   ├── NotificationPermissionModal.jsx # Browser notification prompts
│   │   ├── OnboardingModal.jsx       # 5-step cycle calibration wizard
│   │   └── SettingsView.jsx          # Cycle length tuning & JSON backup/restore
│   └── services/
│       ├── cycleEngine.js            # Biological phase & ovulation algorithm
│       ├── notificationService.js    # Web notification scheduling
│       └── storage.js                # LocalStorage abstraction & data migrations
└── vite.config.js               # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Soumya19jan/Ritudhara.git
   cd Ritudhara
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready artifacts will be generated in the `dist/` directory.

---

## 🌐 Deployment to Netlify

### Option 1: Automatic Git Deployment (Recommended)
1. Push your repository to GitHub.
2. In Netlify Dashboard, select **Add new site** → **Import an existing project**.
3. Link your GitHub repository `Soumya19jan/Ritudhara`.
4. Netlify automatically reads `netlify.toml` with:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**. Any future commits pushed to `main` will automatically trigger a new deployment.

### Option 2: Drag-and-Drop
1. Run `npm run build` locally.
2. Go to [app.netlify.com](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder into the Netlify deploy dropzone.

---

## 🔐 Privacy & Security Architecture

1. **No External Tracking**: No third-party analytics, user profiling, or trackers are embedded.
2. **Device-Contained Health Data**: All reproductive data stays inside your browser's private storage.
3. **Offline Resilience**: Fully usable in Airplane mode or in areas with zero internet connectivity.

---

## 🤝 Contributing

Contributions, feedback, and ideas are warmly welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'Add some NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Made with 💖 for women's reproductive health and wellness.
</p>

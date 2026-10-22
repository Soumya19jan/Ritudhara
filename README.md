# 🌸 LunaGlow 3D — Smart Period & Cycle Companion

A 3D-animated mobile web application built for women to monitor their menstrual cycle, predict ovulation, and receive smart, day-by-day bag & pad carrying recommendations.

---

## ✨ Features

- **Interactive 3D Cycle Ring & Celestial Orb (Three.js)**:
  - 3D glowing orbital ring indicating cycle day, current phase, ovulation peak, and fertile window.
  - Interactive touch & pointer drag controls to tilt, rotate, and view in 3D perspective or flat top-down.
  - Floating stardust particles and central crystalline gem that changes color and breathing pulse across the 4 phases:
    - 🩸 **Menstrual Phase**: Velvet Ruby Glow
    - 🌱 **Follicular Phase**: Blossom Pink
    - ✨ **Ovulation Phase**: Radiant Sunrise Amber
    - 🌙 **Luteal Phase**: Amethyst Purple
- **Personalized Calibration Onboarding**:
  - Welcomes the user and asks 5 simple calibration questions (Last period date, cycle length, period duration, typical symptoms).
  - Calculates upcoming period countdown, ovulation day, and conception likelihood.
- **Smart Bag & Pad Carrying Recommendation**:
  - Dynamically calculates flow likelihood and severity for each day:
    - Heavy Flow (Days 1–2): Pack 3–4 heavy/overnight pads, dark spare underwear, and heat patch.
    - Light Flow (Days 3–5): Pack 2 regular pads or menstrual cup + pantyliner.
    - Pre-Period Imminent (Days until period ≤ 2): Carry 2 pads and wear a safety pantyliner.
    - Ovulation Peak: Pantyliner recommendation for cervical discharge comfort.
    - Safe / Light Days: Pack light with just 1 emergency liner in cosmetic pouch.
  - Interactive packing checklist to tick off items.
- **Forecast & Cycle Calendar**:
  - Month view displaying period days, fertile window, ovulation peak, and daily log markers.
  - Day details inspection and custom log editor.
- **Daily Symptom & Wellness Logger**:
  - Track bleeding flow, mood, symptoms (cramps, bloating, cravings, etc.), water intake, and notes with celebration confetti.
- **Cycle Science & Body Insights**:
  - Hormonal wave explanations, phase-matched nutrition, and workout advice.

---

## 🔒 Do I Need a Database for Netlify?

### **No database is needed! 🎉**

1. **Zero Database Costs**: LunaGlow uses the browser's high-speed **`localStorage`**, so it runs 100% serverless on Netlify's free tier forever.
2. **Maximum Privacy**: Menstrual health data is confidential. By running entirely in client storage, personal logs never touch an external database or server.
3. **Works Offline**: The app loads instantly and works offline on your phone even without internet.
4. **Data Portability**: Built-in **1-click JSON Export & Restore** allows backing up or moving cycle history between devices anytime.

---

## 🚀 How to Host on Netlify

### Option 1: Drag-and-Drop (Easiest & Fastest — 30 Seconds)
1. Run `npm run build` in your terminal.
2. Go to [app.netlify.com](https://app.netlify.com).
3. Drag and drop the generated `dist` folder into the Netlify "Deploy manually" dropzone.
4. Your site will immediately be live with a free SSL certificate!

### Option 2: Connect GitHub / Git
1. Push this repository to GitHub.
2. In Netlify, click **"Add new site" -> "Import an existing project"**.
3. Select your GitHub repository. Netlify will automatically detect:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy Site**. Every future git push will automatically update your site!

The included `netlify.toml` file already handles client-side SPA routing (`/* -> /index.html 200`).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

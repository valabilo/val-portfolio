# ⚡ Val-OS — Frontend

<p align="center">
  <img src="public/favicon.svg" width="60" alt="ValOS Logo" />
</p>

<p align="center">
  A macOS-inspired, interactive portfolio OS built with <strong>React 19 + Vite 8</strong>.
  <br/>
  Fully database-driven — all content fetched from the <a href="https://github.com/YOUR_USERNAME/portfolio-api">portfolio-api</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.14-5A29E4?logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📸 What Is This?

ValOS is a desktop-OS–themed portfolio for **Val Krystoper Abilo, QA Engineer II**. Visitors experience a full animated boot sequence, a draggable window manager, a taskbar, desktop icons, and a right-click context menu — all running in the browser.

Six "apps" open as draggable windows:

| Window | Theme |
|---|---|
| `welcome.sh` | Intro with quick-launch buttons |
| `about.exe` | Animated terminal printing bio, education & awards |
| `test-runner` | Jest-style skills display with PASS/LEARN badges |
| `jira-board` | Expandable work experience cards |
| `projects/` | File-explorer sidebar + project detail panel |
| `compose.mail` | Contact form that posts to the Laravel API |

---

## 🏗️ Project Structure

```
val-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                    # Root: boot gate + data fetch
│   ├── main.jsx                   # React 19 createRoot entry
│   ├── index.css                  # Full ValOS design system
│   ├── components/
│   │   ├── BootScreen.jsx         # Animated boot log sequence
│   │   ├── Desktop.jsx            # Window manager, icons, notification
│   │   ├── Window.jsx             # Draggable OS window shell
│   │   ├── Taskbar.jsx            # Bottom bar with app buttons & clock
│   │   ├── ContextMenu.jsx        # Right-click desktop menu
│   │   ├── MobileFallback.jsx     # Responsive fallback for ≤ 800px screens
│   │   └── windows/
│   │       └── index.jsx          # All 6 window content components
│   ├── data/
│   │   └── index.js               # UI-only config (boot messages, icon labels, window defaults)
│   └── hooks/
│       ├── useWindowManager.js    # Open / close / minimize / z-index state
│       ├── useDraggable.js        # Mouse + touch drag logic
│       └── usePortfolioData.js    # Single API fetch, cancels on unmount
├── index.html
├── vite.config.js
├── .env                           # VITE_API_URL
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| [portfolio-api](https://github.com/YOUR_USERNAME/portfolio-api) | running on port 8000 |

### Install & Run

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/val-portfolio.git
cd val-portfolio

# 2. Install dependencies
npm install

# 3. Set the API URL (already configured for local dev)
# .env
VITE_API_URL=http://localhost:8000

# 4. Start dev server
npm run dev
# → http://localhost:5173
```

> **Note:** Make sure `portfolio-api` is running first — the boot screen waits for data before showing the desktop.

---

## 🔧 Available Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## 🎨 Design System

All styles live in `src/index.css` as CSS custom properties. No Tailwind configuration file needed — Tailwind 4 is used via the Vite plugin.

### CSS Variables

```css
:root {
  --os-bg:       #05050F;                   /* Desktop background */
  --win-bg:      rgba(9, 9, 22, 0.97);      /* Window body */
  --win-bar:     #0D0D22;                   /* Titlebar (inactive) */
  --win-bar-act: #111130;                   /* Titlebar (active) */
  --border:      rgba(255, 255, 255, 0.07); /* Default border */
  --border-act:  rgba(0, 229, 255, 0.25);  /* Active window border */
  --cyan:        #00E5FF;                   /* Primary accent */
  --green:       #00FF88;                   /* Success / available */
  --red:         #FF4466;                   /* Error / close button */
  --amber:       #FFB800;                   /* Warning / minimize */
  --text:        #C8D8F0;
  --text-dim:    #4A6080;
  --text-bright: #E8F4FF;
  --mono:        'JetBrains Mono', monospace;
}
```

### Key Component Classes

| Class | Used For |
|---|---|
| `.os-window` | Base window shell |
| `.active-win` | Active/focused window highlight |
| `.win-titlebar` | Draggable title bar |
| `.taskbar` | Bottom taskbar |
| `.tb-app` | Taskbar app button |
| `.d-icon` | Desktop icon |
| `.ctx-menu` / `.ctx-item` | Right-click context menu |
| `.notification` | Slide-in toast notification |
| `.t-line`, `.t-prompt`, `.t-cmd` | Terminal lines (About window) |
| `.test-row`, `.test-bar` | Test runner rows (Skills window) |
| `.jira-issue` | Experience card (Experience window) |
| `.fe-item` | File explorer sidebar item (Projects window) |
| `.mail-folder`, `.mf-input` | Mail UI (Contact window) |

---

## 🪟 Window Manager

`useWindowManager` (hook) manages all window state:

```
wins[id] = { open, minimized, x, y }
zMap[id] = zIndex                      ← increments on focus
activeId = currently focused window id
```

**Key methods:**

| Method | Action |
|---|---|
| `openWindow(id)` | Opens & positions window on first open |
| `closeWindow(id)` | Closes window |
| `minimizeWindow(id)` | Hides to taskbar |
| `taskbarClick(id)` | Toggle open/minimize |
| `bringToFront(id)` | Increments z-index |
| `setPosition(id, x, y)` | Updates position after drag |

---

## 📡 Data Fetching

A single hook — `usePortfolioData` — fires one `GET /api/portfolio` request at mount and distributes data down via props. There is no global state library.

```
App.jsx
  └── usePortfolioData()           ← one fetch
        └── Desktop.jsx (data)
              ├── WelcomeContent   (profile)
              ├── AboutContent     (profile + education + awards)
              ├── SkillsContent    (skillSuites)
              ├── ExperienceContent(experiences)
              ├── ProjectsContent  (projects)
              └── ContactContent   (profile)
```

### API Response Shape (what the frontend expects)

```ts
{
  profile:     { name, role, bio, location, email, phone, linkedin_url, github_url, available }
  education:   { type, title, institution, year }[]
  awards:      { title, issuer, year }[]
  experiences: { key, title, sub, status, type, date, bullets: string[], tags: string[] }[]
  skillSuites: { id, label, countText, tests: { name, pct, tag }[] }[]
  projects:    { id, icon, name, label, type, desc, github, meta: [string, string, boolean][], tags: string[] }[]
}
```

---

## 📱 Mobile Fallback

On screens ≤ 800px, the desktop is hidden and `MobileFallback.jsx` is shown instead. It renders all the same data from the API (no hardcoded content) in a simple scrollable layout.

```css
@media (max-width: 800px) {
  .desktop-container { display: none !important; }
  .mobile-fallback   { display: flex; }
}
```

---

## 🚢 Deployment (Vercel)

1. Push repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variable:
   ```
   VITE_API_URL = https://your-api-domain.com
   ```
4. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`

---

## 📦 Dependencies

```json
"dependencies": {
  "axios":         "^1.14.0",
  "framer-motion": "^12.x",
  "react":         "^19.0.0",
  "react-dom":     "^19.0.0",
  "react-icons":   "^5.2.1"
},
"devDependencies": {
  "@tailwindcss/vite":    "^4.0.0",
  "@vitejs/plugin-react": "^6.0.0",
  "tailwindcss":          "^4.0.0",
  "vite":                 "^8.0.0"
}
```

---

## 🔗 Related

- **Backend API:** [portfolio-api](https://github.com/YOUR_USERNAME/portfolio-api) — Laravel 12 REST API

---

<p align="center">
  Built by <strong>Val Krystoper Abilo</strong> · QA Engineer II · Manggahan, Pasig City, PH
  <br/>
  <a href="https://linkedin.com/in/valkrystoper-abilo-a5b88a236">LinkedIn</a> ·
  <a href="mailto:abilovalkrystoper@gmail.com">Email</a>
</p>

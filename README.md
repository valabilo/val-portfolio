# ⚡ ValOS — Interactive Portfolio Frontend

<p align="center">
  <img src="public/favicon.svg" width="60" alt="ValOS Logo" />
</p>

<p align="center">
  A macOS-inspired, interactive portfolio OS built with <strong>React 19 + Vite 8</strong>.<br/>
  Fully database-driven — all content fetched from the <a href="#">portfolio-api</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.14-5A29E4" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📸 What Is This?

ValOS is a desktop-OS–themed portfolio for **Val Krystoper Abilo, QA Engineer II**. Visitors experience a full animated boot sequence, a draggable window manager, a taskbar, desktop icons, and a right-click context menu — all running in the browser.

Seven apps open as draggable windows:

| Window | Theme |
|---|---|
| `welcome.sh` | Intro with quick-launch buttons |
| `about.exe` | Animated terminal printing bio, education & awards |
| `test-runner` | Jest-style skills display with PASS/LEARN badges |
| `jira-board` | Expandable work experience cards |
| `projects/` | File-explorer sidebar + project detail panel |
| `ask-val.ai` | AI chat powered by Google Gemini via Laravel API |
| `compose.mail` | Contact form that posts to the Laravel API |

---

## 🏗️ Project Structure

```
val-portfolio/
├── public/
│   ├── favicon.svg
│   └── icons.svg
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
│   │       ├── index.jsx          # 6 window content components
│   │       └── AiChat.jsx         # Ask Val AI window (Gemini-powered)
│   ├── data/
│   │   └── index.js               # UI-only config (boot messages, icon labels, window defaults)
│   └── hooks/
│       ├── useWindowManager.js    # Open / close / minimize / z-index state
│       ├── useDraggable.js        # Mouse + touch drag logic
│       ├── usePortfolioData.js    # Single API fetch, cancels on unmount
│       └── usePortfolio.js        # Module-level cached fetch hook
├── index.html
├── vite.config.js
├── .env                           # VITE_API_URL
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Min Version |
|---|---|
| Node.js | 20 |
| npm | 10 |
| [portfolio-api](../portfolio-api) | running on port 8000 |

### Install & Run

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/val-portfolio.git
cd val-portfolio

# 2. Install dependencies
npm install

# 3. Confirm API URL (already set for local dev)
# .env
VITE_API_URL=http://localhost:8000

# 4. Start dev server
npm run dev
# → http://localhost:5173
```

> **Note:** Start `portfolio-api` first — the boot screen waits for API data before showing the desktop.

---

## 🔧 Available Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## 🗂️ Window Apps

### Welcome (`welcome.sh`)
Intro screen with the ValOS ASCII logo, name/role from the API, quick-launch buttons for all other windows, and social links.

### About (`about.exe`)
Animated terminal typewriter that builds lines from live DB data — identity block, education, awards, and bio paragraph. Scrolls automatically as lines arrive.

### Skills (`test-runner`)
Jest-style test runner UI. Each skill suite (QA, API, Tools, Dev Stack) renders as a test group. Skills animate in sequentially with PASS/LEARN badges and progress bars.

### Experience (`jira-board`)
Work history displayed as Jira-style issue cards. Click any card to expand bullet points and skill tags. Status badges distinguish current from past roles.

### Projects (`projects/`)
File-explorer layout: sidebar lists all projects; detail panel shows icon, type, metadata grid, description, tech tags, and a GitHub link.

### Ask Val AI (`ask-val.ai`)
Chat window backed by Google Gemini (via Laravel). Sends the full conversation history on each message. The system prompt is built from live MySQL data — profile, experience, skills, and projects. Includes suggested starter questions.

### Contact (`compose.mail`)
Mail-client UI. Posts `name`, `email`, `subject`, `message` to `POST /api/contact`. Shows a success state on send; errors surface inline.

---

## 🪟 Window Manager

`useWindowManager` manages all window state:

```
wins[id] = { open, minimized, x, y }
zMap[id] = zIndex           ← increments on every focus
activeId = currently focused window
```

| Method | Action |
|---|---|
| `openWindow(id)` | Opens & positions window on first open |
| `closeWindow(id)` | Closes window |
| `minimizeWindow(id)` | Hides to taskbar |
| `taskbarClick(id)` | Toggle open / minimize |
| `bringToFront(id)` | Increments z-index |
| `setPosition(id, x, y)` | Updates position after drag |

---

## 📡 Data Fetching

One `GET /api/portfolio` request fires at mount via `usePortfolioData`. Data is cached at module level and distributed to all windows via props — no global state library needed.

```
App.jsx
  └── usePortfolioData()
        └── Desktop.jsx (data)
              ├── WelcomeContent    (profile)
              ├── AboutContent      (profile + education + awards)
              ├── SkillsContent     (skillSuites)
              ├── ExperienceContent (experiences)
              ├── ProjectsContent   (projects)
              ├── AiChatContent     (calls /api/chat directly)
              └── ContactContent    (profile)
```

### Expected API Shape

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

## 🎨 Design System

All styles live in `src/index.css` as CSS custom properties. Tailwind 4 is applied via the Vite plugin — no separate config file needed.

```css
:root {
  --os-bg:       #05050F;
  --win-bg:      rgba(9, 9, 22, 0.97);
  --win-bar:     #0D0D22;
  --win-bar-act: #111130;
  --border:      rgba(255, 255, 255, 0.07);
  --border-act:  rgba(0, 229, 255, 0.25);
  --cyan:        #00E5FF;
  --green:       #00FF88;
  --red:         #FF4466;
  --amber:       #FFB800;
  --text:        #C8D8F0;
  --text-dim:    #4A6080;
  --text-bright: #E8F4FF;
  --mono:        'JetBrains Mono', monospace;
}
```

---

## 📱 Mobile Fallback

On screens ≤ 800 px the desktop is hidden and `MobileFallback.jsx` renders — a scrollable layout showing the same API data (profile, experience, skills, contact links) with no hardcoded content.

---

## 📦 Dependencies

```json
{
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
}
```

---

## 🚢 Deployment (Vercel)

1. Push repo to GitHub.
2. Import into [Vercel](https://vercel.com).
3. Add environment variable: `VITE_API_URL=https://your-api-domain.com`
4. Build command: `npm run build` · Output directory: `dist`

Update `config/cors.php` in the API with your Vercel domain before deploying.

---

## 🔗 Related

**Backend API:** [portfolio-api](../portfolio-api) — Laravel 12 REST API + Google Gemini AI

---

<p align="center">
  Built by <strong>Val Krystoper Abilo</strong> · QA Engineer II · Manggahan, Pasig City, PH<br/>
  <a href="https://linkedin.com/in/valkrystoper-abilo-a5b88a236">LinkedIn</a> ·
  <a href="mailto:abilovalkrystoper@gmail.com">Email</a>
</p>

// src/data/index.js
// ─────────────────────────────────────────────────────────────
// PURE UI CONFIG — no portfolio content lives here.
// All content (profile, education, awards, experience, skills,
// projects) comes from GET /api/portfolio via usePortfolioData.
// ─────────────────────────────────────────────────────────────

// Boot animation messages — these are UI-only (not Val's data)
export const BOOT_MESSAGES = [
  { delay:  200, cls: 'sys', text: '[BOOT] ValOS v2.025 initializing...' },
  { delay:  500, cls: 'sys', text: '[SYS]  Loading QA kernel modules...' },
  { delay:  900, cls: 'ok',  text: '[OK]   React JS framework loaded' },
  { delay: 1100, cls: 'ok',  text: '[OK]   Laravel backend initialized' },
  { delay: 1300, cls: 'ok',  text: '[OK]   MySQL database connected' },
  { delay: 1500, cls: 'ok',  text: '[OK]   Postman API runner ready' },
  { delay: 1700, cls: 'ok',  text: '[OK]   Playwright automation loaded' },
  { delay: 1900, cls: 'ok',  text: '[OK]   Jira issue tracker synced' },
  { delay: 2100, cls: 'sys', text: '[SYS]  Starting window manager...' },
  { delay: 2300, cls: 'ok',  text: '[OK]   Desktop environment ready' },
  { delay: 2500, cls: 'sys', text: '[SYS]  Welcome. Loading portfolio...' },
]

// Desktop icon layout — order + emoji are UI config, not content
export const DESKTOP_ICONS = [
  { id: 'welcome',    icon: '⚡', label: 'welcome.sh'  },
  { id: 'about',      icon: '💻', label: 'about.exe'   },
  { id: 'skills',     icon: '🧪', label: 'test-runner' },
  { id: 'experience', icon: '📋', label: 'jira-board'  },
  { id: 'projects',   icon: '📁', label: 'projects/'   },
  { id: 'contact',    icon: '📧', label: 'compose.mail'},
]

// Taskbar button order + labels
export const TASKBAR_APPS = [
  { id: 'welcome',    icon: '⚡', name: 'welcome.sh'  },
  { id: 'about',      icon: '💻', name: 'about.exe'   },
  { id: 'skills',     icon: '🧪', name: 'test-runner' },
  { id: 'experience', icon: '📋', name: 'jira-board'  },
  { id: 'projects',   icon: '📁', name: 'projects/'   },
  { id: 'contact',    icon: '📧', name: 'compose.mail'},
]

// Default window sizes and initial positions (pixels)
export const WINDOW_DEFAULTS = {
  welcome:    { width: 620, height: 'auto', x: null, y: null },
  about:      { width: 660, height: 460,   x: 80,   y: 80   },
  skills:     { width: 680, height: 500,   x: 110,  y: 60   },
  experience: { width: 740, height: 520,   x: 130,  y: 70   },
  projects:   { width: 800, height: 520,   x: 90,   y: 65   },
  contact:    { width: 660, height: 480,   x: null, y: null  },
}

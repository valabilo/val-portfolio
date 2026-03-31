// src/data/index.js
// Pure UI config — zero portfolio content. All content comes from the API.

export const BOOT_MESSAGES = [
  { delay:  200, cls: 'sys', text: '[BOOT] ValOS v2.025 initializing...' },
  { delay:  500, cls: 'sys', text: '[SYS]  Loading QA kernel modules...' },
  { delay:  900, cls: 'ok',  text: '[OK]   React JS framework loaded' },
  { delay: 1100, cls: 'ok',  text: '[OK]   Laravel backend initialized' },
  { delay: 1300, cls: 'ok',  text: '[OK]   MySQL database connected' },
  { delay: 1500, cls: 'ok',  text: '[OK]   Postman API runner ready' },
  { delay: 1700, cls: 'ok',  text: '[OK]   Playwright automation loaded' },
  { delay: 1900, cls: 'ok',  text: '[OK]   Jira issue tracker synced' },
  { delay: 2100, cls: 'ok',  text: '[OK]   Claude AI assistant online' },
  { delay: 2300, cls: 'sys', text: '[SYS]  Starting window manager...' },
  { delay: 2500, cls: 'ok',  text: '[OK]   Desktop environment ready' },
  { delay: 2700, cls: 'sys', text: '[SYS]  Welcome. Loading portfolio...' },
]

export const DESKTOP_ICONS = [
  { id: 'welcome',    icon: '⚡', label: 'welcome.sh'  },
  { id: 'about',      icon: '💻', label: 'about.exe'   },
  { id: 'skills',     icon: '🧪', label: 'test-runner' },
  { id: 'experience', icon: '📋', label: 'jira-board'  },
  { id: 'projects',   icon: '📁', label: 'projects/'   },
  { id: 'aichat',     icon: '🤖', label: 'ask-val.ai'  },  // ← NEW
  { id: 'contact',    icon: '📧', label: 'compose.mail'},
]

export const TASKBAR_APPS = [
  { id: 'welcome',    icon: '⚡', name: 'welcome.sh'  },
  { id: 'about',      icon: '💻', name: 'about.exe'   },
  { id: 'skills',     icon: '🧪', name: 'test-runner' },
  { id: 'experience', icon: '📋', name: 'jira-board'  },
  { id: 'projects',   icon: '📁', name: 'projects/'   },
  { id: 'aichat',     icon: '🤖', name: 'ask-val.ai'  },   // ← NEW
  { id: 'contact',    icon: '📧', name: 'compose.mail'},
]

export const WINDOW_DEFAULTS = {
  welcome:    { width: 620, height: 'auto', x: null, y: null },
  about:      { width: 660, height: 460,   x: 80,   y: 80   },
  skills:     { width: 680, height: 500,   x: 110,  y: 60   },
  experience: { width: 740, height: 520,   x: 130,  y: 70   },
  projects:   { width: 800, height: 520,   x: 90,   y: 65   },
  aichat:     { width: 660, height: 520,   x: null, y: null  }, // ← NEW
  contact:    { width: 660, height: 480,   x: null, y: null  },
}

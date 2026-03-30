// src/components/Desktop.jsx
import { useState, useEffect, useCallback } from 'react'
import { useWindowManager } from '../hooks/useWindowManager'
import { DESKTOP_ICONS, WINDOW_DEFAULTS } from '../data'
import Window        from './Window'
import Taskbar       from './Taskbar'
import ContextMenu   from './ContextMenu'
import {
  WelcomeContent,
  AboutContent,
  SkillsContent,
  ExperienceContent,
  ProjectsContent,
  ContactContent,
} from './windows'

const WIN_IDS = ['welcome','about','skills','experience','projects','contact']

const WINDOW_META = {
  welcome:    { icon: '⚡', title: 'welcome.sh' },
  about:      { icon: '💻', title: 'zsh — about.sh — 80×24' },
  skills:     { icon: '🧪', title: 'jest — test-runner — skills.test.js' },
  experience: { icon: '📋', title: 'Jira — Career Board — VK Project' },
  projects:   { icon: '📁', title: 'File Explorer — qa-testing-projects' },
  contact:    { icon: '📧', title: 'Mail — compose.mail' },
}

export default function Desktop({ data }) {
  const mgr = useWindowManager()

  const [initialized,  setInitialized]  = useState({})
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [ctxMenu,      setCtxMenu]      = useState({ visible: false, x: 0, y: 0 })
  const [showNotif,    setShowNotif]    = useState(false)
  const [opacity,      setOpacity]      = useState(0)

  // All content from API — safe defaults prevent crashes
  const profile     = data?.profile     ?? null
  const education   = data?.education   ?? []   // ← from DB
  const awards      = data?.awards      ?? []   // ← from DB
  const experiences = data?.experiences ?? []
  const skillSuites = data?.skillSuites ?? []
  const projects    = data?.projects    ?? []

  useEffect(() => {
    requestAnimationFrame(() => setOpacity(1))
    setTimeout(() => handleOpen('welcome'), 400)
    setTimeout(() => setShowNotif(true),    4000)
    setTimeout(() => setShowNotif(false),   10000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = useCallback((id) => {
    mgr.openWindow(id)
    setInitialized(prev => ({ ...prev, [id]: true }))
  }, [mgr])

  const handleContextMenu = useCallback((e) => {
    if (e.target.closest('.os-window') || e.target.closest('.taskbar')) return
    e.preventDefault()
    setCtxMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth  - 210),
      y: Math.min(e.clientY, window.innerHeight - 200),
    })
  }, [])

  const closeCtx = useCallback(() => setCtxMenu(c => ({ ...c, visible: false })), [])

  const openAll = useCallback(() => {
    WIN_IDS.forEach((id, i) => setTimeout(() => handleOpen(id), i * 120))
  }, [handleOpen])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { if (mgr.activeId) mgr.closeWindow(mgr.activeId); closeCtx() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mgr, closeCtx])

  useEffect(() => {
    window.addEventListener('click', closeCtx)
    return () => window.removeEventListener('click', closeCtx)
  }, [closeCtx])

  const def     = id => WINDOW_DEFAULTS[id] ?? {}
  const winProps = id => ({
    id,
    ...WINDOW_META[id],
    width:       def(id).width,
    height:      def(id).height ?? 'auto',
    x:           mgr.wins[id]?.x,
    y:           mgr.wins[id]?.y,
    isOpen:      mgr.wins[id]?.open      ?? false,
    isMinimized: mgr.wins[id]?.minimized ?? false,
    isActive:    mgr.activeId === id,
    zIndex:      mgr.zMap[id] ?? 100,
    onClose:     mgr.closeWindow,
    onMinimize:  mgr.minimizeWindow,
    onFocus:     () => mgr.bringToFront(id),
    onMove:      (x, y) => mgr.setPosition(id, x, y),
  })

  return (
    <div
      className="desktop-bg"
      style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', opacity, transition:'opacity 0.6s ease' }}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop icons */}
      <div style={{ position:'absolute', left:20, top:20, display:'flex', flexDirection:'column', gap:8, zIndex:10 }}>
        {DESKTOP_ICONS.map(icon => (
          <div
            key={icon.id}
            className={`d-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => handleOpen(icon.id)}
          >
            <div className="d-icon-img">{icon.icon}</div>
            <div className="d-icon-label">{icon.label}</div>
          </div>
        ))}
      </div>

      {/* ── Windows ── */}

      <Window {...winProps('welcome')}>
        <WelcomeContent profile={profile} openWindow={handleOpen} />
      </Window>

      {/* AboutContent now receives education + awards from DB */}
      <Window {...winProps('about')} bodyStyle={{ background: '#020209' }}>
        <AboutContent
          profile={profile}
          education={education}
          awards={awards}
          initialized={!!initialized.about}
        />
      </Window>

      <Window {...winProps('skills')}>
        <SkillsContent skillSuites={skillSuites} initialized={!!initialized.skills} />
      </Window>

      <Window {...winProps('experience')}>
        <ExperienceContent experiences={experiences} />
      </Window>

      <Window {...winProps('projects')} bodyStyle={{ flexDirection: 'row' }}>
        <ProjectsContent projects={projects} />
      </Window>

      <Window {...winProps('contact')} bodyStyle={{ flexDirection: 'row' }}>
        <ContactContent profile={profile} />
      </Window>

      {/* Taskbar */}
      <Taskbar
        wins={mgr.wins}
        onTaskbarClick={id => {
          mgr.taskbarClick(id)
          setInitialized(prev => ({ ...prev, [id]: true }))
        }}
      />

      {/* Context menu */}
      <ContextMenu
        x={ctxMenu.x} y={ctxMenu.y}
        visible={ctxMenu.visible}
        onClose={closeCtx}
        onOpenAll={openAll}
        openWindow={handleOpen}
      />

      {/* Notification — uses profile.name + profile.role from DB */}
      {showNotif && (
        <div className="notification">
          <div
            style={{ position:'absolute', top:10, right:12, color:'var(--text-dim)', cursor:'pointer', fontSize:16 }}
            onClick={() => setShowNotif(false)}
          >
            ×
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:11, color:'var(--cyan)', letterSpacing:'0.08em' }}>
            <span>⚡</span> ValOS Notification
          </div>
          <div style={{ fontSize:13, color:'var(--text-bright)', marginBottom:4 }}>
            💼 {profile?.name ?? 'Val'} is open to opportunities
          </div>
          <div style={{ fontSize:11, color:'var(--text-dim)', lineHeight:1.5 }}>
            {profile?.role ?? 'QA Engineer II'} · Available for full-time,<br />
            project-based, or freelance roles.
          </div>
        </div>
      )}
    </div>
  )
}

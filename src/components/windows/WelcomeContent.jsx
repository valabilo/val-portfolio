// src/components/windows/WelcomeContent.jsx
export function WelcomeContent({ profile, openWindow }) {
  const name = profile?.name ?? "...";
  const role = profile?.role ?? "QA Engineer";
  const email = profile?.email ?? "";
  const linkedin = profile?.linkedin_url ?? "#";
  const github = profile?.github_url ?? "#";
  const location = profile?.location ?? "";

  return (
    <div className="welcome-content">
      <pre className="welcome-ascii">{`██╗   ██╗ █████╗ ██╗              ██████╗ ███████╗
██║   ██║██╔══██╗██║             ██╔═══██╗██╔════╝
██║   ██║███████║██║       ███║  ██║   ██║███████╗
╚██╗ ██╔╝██╔══██║██║             ██║   ██║╚════██║
 ╚████╔╝ ██║  ██║███████╗        ╚██████╔╝███████║
  ╚═══╝  ╚═╝  ╚═╝╚══════╝         ╚═════╝ ╚══════╝`}</pre>

      <div className="welcome-name">{name}</div>
      <div className="welcome-role">// {role.toUpperCase()}</div>

      <p className="welcome-bio">
        Welcome to my interactive portfolio. I'm a detail-obsessed Software QA
        Engineer who catches bugs before your users do. Open any app below to
        explore my work — or double-click the desktop icons.
      </p>

      <div className="welcome-actions">
        <button className="w-btn primary" onClick={() => openWindow("aichat")}>
          🤖 Ask Val AI
        </button>
        <button className="w-btn" onClick={() => openWindow("about")}>
          💻 About Me
        </button>
        <button className="w-btn" onClick={() => openWindow("skills")}>
          🧪 Skills
        </button>
        <button className="w-btn" onClick={() => openWindow("experience")}>
          📋 Experience
        </button>
        <button className="w-btn" onClick={() => openWindow("projects")}>
          📁 Projects
        </button>
        <button className="w-btn" onClick={() => openWindow("contact")}>
          📧 Contact
        </button>
      </div>

      <div className="welcome-footer">
        {location && <span>📍 {location}</span>}
        {email && <a href={`mailto:${email}`}>{email}</a>}
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </div>
    </div>
  );
}

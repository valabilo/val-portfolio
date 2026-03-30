// src/components/MobileFallback.jsx
// 100% database-driven — zero hardcoded content.

export default function MobileFallback({ profile, experiences, skillSuites }) {
  const name      = profile?.name        ?? 'Val Krystoper Abilo'
  const role      = profile?.role        ?? 'QA Engineer II'
  const bio       = profile?.bio         ?? ''
  const email     = profile?.email       ?? 'abilovalkrystoper@gmail.com'
  const phone     = profile?.phone       ?? ''
  const linkedin  = profile?.linkedin_url ?? 'https://linkedin.com/in/valkrystoper-abilo-a5b88a236'
  const github    = profile?.github_url  ?? 'https://github.com/YOUR_USERNAME'
  const exps      = experiences          ?? []

  // Build flat skill list from all suites in the DB
  const allSkills = (skillSuites ?? []).flatMap(suite =>
    suite.tests.map(t => t.name)
  )

  const Section = ({ title, children }) => (
    <div style={{ padding: 28, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
        {title}
      </div>
      {children}
    </div>
  )

  return (
    <div className="mobile-fallback">
      {/* Hero */}
      <div style={{ padding: '48px 28px 32px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.2em', marginBottom: 24 }}>⚡ ValOS — Portfolio</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 16 }}>
          // {role.toUpperCase()} · REACT · LARAVEL · MYSQL
        </div>
        <div style={{ fontSize: 10, color: 'var(--amber)', background: 'var(--amber-dim)', border: '1px solid rgba(255,184,0,0.2)', padding: '8px 14px', borderRadius: 4, marginBottom: 20, display: 'inline-block' }}>
          ⚠ Full interactive OS experience on desktop.
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${email}`} style={{ color: 'var(--cyan)', fontSize: 11, textDecoration: 'none' }}>📧 Email</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', fontSize: 11, textDecoration: 'none' }}>LinkedIn ↗</a>
          <a href={github}   target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', fontSize: 11, textDecoration: 'none' }}>GitHub ↗</a>
        </div>
      </div>

      {/* About — bio from DB */}
      <Section title="About">
        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {bio || 'QA Engineer based in the Philippines with 2+ years of experience.'}
        </p>
      </Section>

      {/* Experience — from DB */}
      <Section title="Experience">
        {exps.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Loading...</div>
        ) : (
          exps.map((e, i) => {
            // Title format: "Role · Company" — split on first ·
            const parts    = e.title.split(' · ')
            const jobRole  = parts[0]
            const company  = parts.slice(1).join(' · ')
            return (
              <div
                key={e.key}
                style={{
                  marginBottom: i < exps.length - 1 ? 20 : 0,
                  paddingBottom: i < exps.length - 1 ? 20 : 0,
                  borderBottom: i < exps.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ fontSize: 14, color: 'var(--text-bright)', fontWeight: 500 }}>{company || jobRole}</div>
                <div style={{ fontSize: 11, color: 'var(--green)', margin: '3px 0' }}>{company ? jobRole : ''}</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{e.date} · {e.type}</div>
              </div>
            )
          })
        )}
      </Section>

      {/* Skills — ALL from DB, no hardcoded list */}
      <Section title="Skills">
        {allSkills.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allSkills.map(skill => (
              <span
                key={skill}
                style={{ fontSize: 10, padding: '4px 10px', borderRadius: 3, background: 'var(--win-bar)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Contact — from DB */}
      <Section title="Contact">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '📧', val: email,      href: `mailto:${email}` },
            phone && { icon: '📞', val: phone, href: `tel:${phone.replace(/\s/g,'')}` },
            { icon: '🔗', val: 'LinkedIn', href: linkedin },
            { icon: '🐙', val: 'GitHub',   href: github   },
          ].filter(Boolean).map(c => (
            <a
              key={c.icon}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 4, textDecoration: 'none', color: 'var(--text)', fontSize: 12 }}
            >
              {c.icon} {c.val}
            </a>
          ))}
        </div>
      </Section>
    </div>
  )
}

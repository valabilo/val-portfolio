// src/components/Footer.jsx
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

// Stable constant outside component — no re-creation on every render
const SOCIAL_LINKS = [
  {
    href: "https://github.com/YOUR_USERNAME",
    label: "GitHub",
    icon: <FiGithub size={16} />,
  },
  {
    href: "https://linkedin.com/in/valkrystoper-abilo-a5b88a236",
    label: "LinkedIn",
    icon: <FiLinkedin size={16} />,
  },
  {
    href: "mailto:abilovalkrystoper@gmail.com",
    label: "Email",
    icon: <FiMail size={16} />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 py-8 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600 tracking-widest font-mono">
          © {new Date().getFullYear()} Val Krystoper Abilo · QA Engineer
        </p>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-gray-600 hover:text-cyan-400 transition-colors">
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

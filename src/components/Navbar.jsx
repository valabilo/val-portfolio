// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiZap, FiMenu, FiX } from "react-icons/fi";

// Defined outside component — stable reference, never re-created on render
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Fix: use startsWith so nested routes like /projects/x still highlight correctly
  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-sm font-mono">
          <FiZap size={16} />
          VAL.QA
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs tracking-widest uppercase transition-colors font-mono ${
                isActive(link.to)
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-gray-100"
              }`}>
              {link.label}
            </Link>
          ))}
          <a
            href="/val-abilo-cv.pdf"
            download
            className="text-xs px-4 py-2 border border-cyan-400/40 text-cyan-400 rounded hover:bg-cyan-400/10 transition-colors tracking-widest font-mono">
            CV ↓
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}>
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-gray-950 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className={`text-xs tracking-widest uppercase transition-colors font-mono ${
                isActive(link.to)
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}>
              {link.label}
            </Link>
          ))}
          <a
            href="/val-abilo-cv.pdf"
            download
            className="text-xs text-cyan-400 font-mono">
            Download CV ↓
          </a>
        </div>
      )}
    </nav>
  );
}

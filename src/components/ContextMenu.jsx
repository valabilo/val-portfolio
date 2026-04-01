// src/components/ContextMenu.jsx
const MENU_ITEMS = [
  { icon: "⊞", label: "Open All Apps", action: "openAll" },
  { type: "sep" },
  { icon: "📧", label: "Hire Val", action: "contact" },
  {
    icon: "🔗",
    label: "LinkedIn Profile",
    action: "linkedin",
    href: "https://linkedin.com/in/valkrystoper-abilo-a5b88a236",
  },
  {
    icon: "🐙",
    label: "GitHub Repos",
    action: "github",
    href: "https://github.com/YOUR_USERNAME",
  },
  { type: "sep" },
  { icon: "✕", label: "Close Menu", action: "close" },
];

export default function ContextMenu({
  x,
  y,
  visible,
  onClose,
  onOpenAll,
  openWindow,
}) {
  if (!visible) return null;

  const handleClick = (item) => {
    if (item.action === "openAll") {
      onOpenAll();
      onClose();
      return;
    }
    if (item.action === "contact") {
      openWindow("contact");
      onClose();
      return;
    }
    if (item.action === "close") {
      onClose();
      return;
    }
    if (item.href) {
      window.open(item.href, "_blank");
      onClose();
      return;
    }
  };

  return (
    <div
      className="ctx-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}>
      {MENU_ITEMS.map((item, i) => {
        if (item.type === "sep") return <div key={i} className="ctx-sep" />;
        return (
          <div key={i} className="ctx-item" onClick={() => handleClick(item)}>
            <span className="ctx-item-icon">{item.icon}</span>
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

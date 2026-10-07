"use client";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/analysis": "MRI Analysis",
  "/xai": "XAI Visualization",
  "/evidence": "Evidence & RAG",
  "/chat": "AI Chat",
  "/compare": "Compare Scans",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-breadcrumb">
          <span>Brain MRI Copilot</span>
          <span className="header-breadcrumb-separator">/</span>
          <span className="header-breadcrumb-current">{title}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="header-search">
          <span>\ud83d\udd0d</span>
          <span>Search anything...</span>
          <kbd>Ctrl+K</kbd>
        </div>
        <button className="header-btn" title="Notifications" style={{ position: "relative" }}>
          \ud83d\udd14
          <span className="notification-dot"></span>
        </button>
        <button className="header-btn" title="Settings">\u2699\ufe0f</button>
        <button className="header-btn" title="Help">\u2753</button>
      </div>
    </header>
  );
}

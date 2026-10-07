"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/", icon: "\u2302", section: "overview" },
  { label: "MRI Analysis", href: "/analysis", icon: "\ud83e\udde0", section: "analysis", badge: "New" },
  { label: "XAI Visualization", href: "/xai", icon: "\ud83d\udca1", section: "analysis" },
  { label: "Evidence & RAG", href: "/evidence", icon: "\ud83d\udcda", section: "research" },
  { label: "AI Chat", href: "/chat", icon: "\ud83d\udcac", section: "research" },
  { label: "Compare Scans", href: "/compare", icon: "\u2194", section: "tools" },
];

const sections: Record<string, string> = {
  overview: "Overview",
  analysis: "Analysis",
  research: "Research",
  tools: "Tools"
};

export default function Sidebar() {
  const pathname = usePathname();
  let lastSection = "";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">ðŸ§ </div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">Brain MRI Copilot</div>
          <div className="sidebar-logo-subtitle">AI-Powered Analysis</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section !== lastSection;
          lastSection = item.section;
          return (
            <div key={item.href}>
              {showSection && (
                <div className="sidebar-section-label">
                  {sections[item.section]}
                </div>
              )}
              <Link
                href={item.href}
                className={`sidebar-nav-item ${pathname === item.href ? "active" : ""}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot"></span>
          <span>Models Ready</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "8px" }}>
          SAM-Med3D v1.2 \u00b7 MedGemma v2.0
        </div>
      </div>
    </aside>
  );
}

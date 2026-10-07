"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import Link from "next/link";
import { dashboardStats, pipelineSteps, sampleArticles } from "@/data/sampleData";

const BrainViewer3D = dynamic(() => import("@/components/brain/BrainViewer3D"), { ssr: false });

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState("0");
  useEffect(() => {
    const numericStr = target.replace(/[^0-9.]/g, "");
    const targetNum = parseFloat(numericStr);
    const duration = 2000;
    const steps = 60;
    const increment = targetNum / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        if (target.includes(",")) {
          setCount(Math.floor(current).toLocaleString());
        } else if (target.includes("%")) {
          setCount(current.toFixed(1) + "%");
        } else {
          setCount(Math.floor(current).toString());
        }
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="page-container">
          {/* Hero Section */}
          <div className="hero-section section-animate">
            <div className="hero-content">
              <h1>
                AI-Powered<br />
                <span>Brain MRI Copilot</span>
              </h1>
              <p>
                From 3D segmentation to evidence-grounded insights. Combine SAM-Med3D, MedGemma, 
                Explainable AI, and Medical RAG for transparent and interactive brain MRI analysis.
              </p>
              <div className="hero-actions">
                <Link href="/analysis" className="btn btn-accent btn-lg">
                  ðŸ§  Start Analysis
                </Link>
                <Link href="/chat" className="btn btn-secondary btn-lg">
                  ðŸ’¬ AI Chat
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <BrainViewer3D compact showSegmentation />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stat-grid section-animate">
            {dashboardStats.map((stat, i) => (
              <div key={i} className={`stat-card ${stat.color}`}>
                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                <div className="stat-info">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
                    {stat.positive ? "â†‘" : "â†“"} {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Pipeline */}
          <div className="card section-animate" style={{ marginBottom: "20px" }}>
            <div className="card-header">
              <div>
                <div className="card-title">
                  <span className="card-title-icon" style={{ background: "rgba(49,130,206,0.15)", color: "var(--primary-300)" }}>âš¡</span>
                  System Architecture Pipeline
                </div>
                <div className="card-subtitle">End-to-end AI analysis workflow</div>
              </div>
              <span className="badge badge-green">â— Active</span>
            </div>
            <div className="arch-flow">
              {pipelineSteps.map((step, i) => (
                <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                  <div className={`arch-node`} style={{
                    borderColor: step.status === "active" ? "var(--primary-400)" : step.status === "completed" ? "var(--success-400)" : "var(--glass-border)",
                    boxShadow: step.status === "active" ? "var(--shadow-glow)" : "none"
                  }}>
                    <div className="arch-node-icon" style={{
                      background: step.status === "active" ? "rgba(49,130,206,0.2)" : step.status === "completed" ? "rgba(16,185,129,0.2)" : "var(--bg-surface)",
                      color: step.status === "active" ? "var(--primary-300)" : step.status === "completed" ? "var(--success-400)" : "var(--text-tertiary)"
                    }}>
                      {step.icon}
                    </div>
                    <div className="arch-node-label">{step.name}</div>
                    <div className="arch-node-sublabel">{step.description}</div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="arch-arrow" style={{
                      background: step.status === "completed" ? "linear-gradient(90deg, var(--success-400), var(--primary-400))" : undefined
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid-2 section-animate">
            {/* Key Capabilities */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-title-icon" style={{ background: "rgba(139,92,246,0.15)", color: "var(--purple-400)" }}>ðŸŽ¯</span>
                  Key Capabilities
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: "ðŸ”¬", title: "3D Segmentation", desc: "SAM-Med3D volumetric segmentation", color: "var(--primary-300)" },
                  { icon: "ðŸ‘ï¸", title: "Visual Understanding", desc: "MedGemma multimodal reasoning", color: "var(--accent-400)" },
                  { icon: "ðŸ’¡", title: "Explainable AI", desc: "Attention maps & feature importance", color: "var(--warning-400)" },
                  { icon: "ðŸ“š", title: "Medical RAG", desc: "Evidence-grounded retrieval", color: "var(--purple-400)" },
                  { icon: "âœ…", title: "Verification", desc: "Fact-check & reduce hallucinations", color: "var(--success-400)" },
                  { icon: "ðŸ’¬", title: "Conversational AI", desc: "Interactive question answering", color: "var(--danger-400)" },
                ].map((cap, i) => (
                  <div key={i} className="region-item" style={{ cursor: "default" }}>
                    <span style={{ fontSize: "20px" }}>{cap.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: cap.color }}>{cap.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{cap.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Papers */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-title-icon" style={{ background: "rgba(6,182,212,0.15)", color: "var(--accent-400)" }}>ðŸ“„</span>
                  Recent Evidence
                </div>
                <Link href="/evidence" className="btn btn-ghost btn-sm">View All â†’</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {sampleArticles.slice(0, 4).map((article) => (
                  <div key={article.pmid} className="evidence-card" style={{ padding: "14px" }}>
                    <div className="evidence-card-title" style={{ fontSize: "13px", marginBottom: "6px" }}>
                      {article.title}
                    </div>
                    <div className="evidence-card-meta">
                      <span>{article.journal}</span>
                      <span>â€¢</span>
                      <span>{article.year}</span>
                      <span>â€¢</span>
                      <span className="verification-badge verified">âœ“ Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

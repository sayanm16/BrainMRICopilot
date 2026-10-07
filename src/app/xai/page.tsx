"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { sampleFeatures, sampleRegions } from "@/data/sampleData";

export default function XAIPage() {
  const [method, setMethod] = useState<"gradcam" | "attention" | "shap" | "integrated_gradients">("gradcam");
  const [colormap, setColormap] = useState<"jet" | "turbo" | "viridis" | "inferno">("jet");
  const [opacity, setOpacity] = useState(65);
  const [sliceIndex, setSliceIndex] = useState(82);
  const [plane, setPlane] = useState<"axial" | "coronal" | "sagittal">("axial");
  const [highlightROI, setHighlightROI] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Colormap color mapper
  const getColor = (val: number, cmap: string) => {
    // val is 0.0 to 1.0
    val = Math.max(0, Math.min(1, val));
    if (cmap === "jet") {
      // Blue -> Cyan -> Green -> Yellow -> Red
      const r = Math.max(0, Math.min(255, Math.floor(255 * (1.5 - Math.abs(val * 4 - 3)))));
      const g = Math.max(0, Math.min(255, Math.floor(255 * (1.5 - Math.abs(val * 4 - 2)))));
      const b = Math.max(0, Math.min(255, Math.floor(255 * (1.5 - Math.abs(val * 4 - 1)))));
      return [r, g, b];
    } else if (cmap === "turbo") {
      const r = Math.floor(255 * Math.sin(val * Math.PI * 0.9));
      const g = Math.floor(255 * Math.sin(val * Math.PI * 0.8 + 0.2));
      const b = Math.floor(255 * Math.cos(val * Math.PI * 0.5));
      return [r, g, b];
    } else if (cmap === "viridis") {
      const r = Math.floor(70 + 180 * Math.sin(val * 2.5));
      const g = Math.floor(30 + 200 * val);
      const b = Math.floor(130 - 100 * val);
      return [r, g, b];
    } else {
      // inferno
      const r = Math.floor(255 * Math.min(1, val * 1.3));
      const g = Math.floor(255 * Math.max(0, (val - 0.3) * 1.4));
      const b = Math.floor(80 * (1 - val));
      return [r, g, b];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Anatomical head ellipse
        if (dist < 0.88) {
          // Brain slice grayscale base
          let baseIntensity = 50 + (1 - dist) * 140;
          if (dist > 0.65) baseIntensity = 120 + Math.sin(dx * 18 + dy * 14) * 20;
          if (dist < 0.35) baseIntensity = 170;

          // Ventricular space
          const ventDist = Math.hypot(dx * 2.2, dy * 1.8);
          if (ventDist < 0.22) baseIntensity = 20;

          data[idx] = baseIntensity;
          data[idx + 1] = baseIntensity;
          data[idx + 2] = baseIntensity;
          data[idx + 3] = 255;

          // Calculate XAI Activation Heatmap at lesion site (temporal-parietal region)
          const lesionDx = dx - (-0.28);
          const lesionDy = dy - 0.12;
          const lesionDist = Math.sqrt(lesionDx * lesionDx + lesionDy * lesionDy);

          let activation = 0;
          if (method === "gradcam") {
            activation = Math.exp(-lesionDist * 6.5);
          } else if (method === "attention") {
            activation = Math.exp(-lesionDist * 5.0) * (0.8 + 0.2 * Math.sin(x * 0.15 + y * 0.12));
          } else if (method === "shap") {
            activation = Math.max(0, Math.exp(-lesionDist * 7.0) - 0.15);
          } else {
            activation = Math.exp(-lesionDist * 6.0) * Math.abs(Math.sin(dx * 15));
          }

          if (activation > 0.05) {
            const [hr, hg, hb] = getColor(activation, colormap);
            const alpha = (opacity / 100) * activation;
            data[idx] = Math.round(data[idx] * (1 - alpha) + hr * alpha);
            data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + hg * alpha);
            data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + hb * alpha);
          }
        } else {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw lesion ROI contour box if enabled
    if (highlightROI) {
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      const boxX = cx + (-0.45) * cx;
      const boxY = cy + (-0.05) * cy;
      ctx.strokeRect(boxX, boxY, 105, 95);
      ctx.fillStyle = "#fb7185";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText("ROI: Temporal Lesion", boxX + 4, boxY - 6);
      ctx.setLineDash([]);
    }
  }, [method, colormap, opacity, sliceIndex, plane, highlightROI]);

  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="page-container">
          {/* Header */}
          <div className="page-title-section">
            <h1 className="page-title">Explainable AI (XAI) Attribution Suite</h1>
            <p className="page-description">
              Unpack deep vision-language activations with visual attribution maps, feature importance rankings, and clinical confidence quantification.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="card" style={{ padding: "16px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              {/* Method Tabs */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-tertiary)", fontWeight: 600 }}>Attribution Method:</span>
                <div className="tabs" style={{ margin: 0 }}>
                  <button className={`tab ${method === "gradcam" ? "active" : ""}`} onClick={() => setMethod("gradcam")}>
                    Grad-CAM
                  </button>
                  <button className={`tab ${method === "attention" ? "active" : ""}`} onClick={() => setMethod("attention")}>
                    Attention Rollout
                  </button>
                  <button className={`tab ${method === "shap" ? "active" : ""}`} onClick={() => setMethod("shap")}>
                    Kernel SHAP
                  </button>
                  <button className={`tab ${method === "integrated_gradients" ? "active" : ""}`} onClick={() => setMethod("integrated_gradients")}>
                    Integrated Gradients
                  </button>
                </div>
              </div>

              {/* Colormap & Opacity */}
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Colormap:</span>
                  <select
                    value={colormap}
                    onChange={(e: any) => setColormap(e.target.value)}
                    style={{
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      padding: "6px 10px",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <option value="jet">Jet (Standard)</option>
                    <option value="turbo">Turbo (Perceptual)</option>
                    <option value="viridis">Viridis</option>
                    <option value="inferno">Inferno</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Opacity:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                    style={{ width: "90px" }}
                  />
                  <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono", color: "var(--text-primary)", width: "32px" }}>
                    {opacity}%
                  </span>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={highlightROI}
                    onChange={(e) => setHighlightROI(e.target.checked)}
                  />
                  <span>Show Target ROI</span>
                </label>
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid-sidebar">
            {/* Left Heatmap & Visual Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>ðŸ”¥</span>
                    Multimodal Activation Overlay
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className={`btn btn-sm ${plane === "axial" ? "btn-primary" : "btn-ghost"}`} onClick={() => setPlane("axial")}>Axial</button>
                    <button className={`btn btn-sm ${plane === "coronal" ? "btn-primary" : "btn-ghost"}`} onClick={() => setPlane("coronal")}>Coronal</button>
                    <button className={`btn btn-sm ${plane === "sagittal" ? "btn-primary" : "btn-ghost"}`} onClick={() => setPlane("sagittal")}>Sagittal</button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "16px 0", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-xl)",
                      cursor: "crosshair",
                      maxWidth: "100%",
                      height: "auto"
                    }}
                  />
                </div>

                {/* Heatmap Legend */}
                <div className="heatmap-legend" style={{ marginTop: "12px" }}>
                  <span>0.00 (Background)</span>
                  <div className="heatmap-gradient"></div>
                  <span>1.00 (Max Focus)</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", padding: "8px 12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Peak Attribution Coordinates: <strong style={{ color: "var(--accent-400)" }}>[X: 112, Y: 146, Z: 82]</strong>
                  </span>
                  <span style={{ color: "var(--text-tertiary)" }}>
                    Target Token: <code style={{ color: "var(--primary-300)" }}>"Glioblastoma Multiforme"</code>
                  </span>
                </div>
              </div>

              {/* Attribution Interpretation */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--success-400)" }}>ðŸ’¡</span>
                    Clinical Attribution Explanation
                  </div>
                </div>
                <div style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  <p style={{ marginBottom: "12px" }}>
                    <strong>Why did the model predict High-Grade Glioma?</strong>
                  </p>
                  <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li>
                      <strong>Primary Weight (64.2%):</strong> Focused strictly along the <em>hyperintense necrotic center</em> and <em>irregular contrast-enhancing rim</em> in the Left Temporal Lobe.
                    </li>
                    <li>
                      <strong>Surrounding Edema (23.8%):</strong> The attention rollout layer captures peritumoral vasogenic edema extending into adjacent white matter tracts.
                    </li>
                    <li>
                      <strong>Mass Effect (12.0%):</strong> Mild compression on the anterior horn of the left lateral ventricle contributing to classification certainty.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Features & Weights Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Quantitative Feature Importance */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(245,158,11,0.15)", color: "var(--warning-400)" }}>ðŸ“Š</span>
                    Feature Importance (SHAP Values)
                  </div>
                </div>

                <div>
                  {sampleFeatures.map((feat, i) => (
                    <div key={i} className="feature-bar">
                      <div className="feature-bar-label" title={feat.name}>
                        {feat.name}
                      </div>
                      <div className="feature-bar-track">
                        <div
                          className={`feature-bar-fill ${feat.category}`}
                          style={{ width: `${feat.value * 100}%` }}
                        >
                          {(feat.value * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Influencing Anatomical Structures */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(6,182,212,0.15)", color: "var(--accent-400)" }}>ðŸŽ¯</span>
                    Top Contributing Structures
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { name: "Left Temporal Lobe (Lesion Core)", weight: "0.89", color: "#ff6b6b" },
                    { name: "Periventricular White Matter", weight: "0.74", color: "#c44dff" },
                    { name: "Hippocampus (Left)", weight: "0.52", color: "#45b7d1" },
                    { name: "Corpus Callosum Splenium", weight: "0.38", color: "#54a0ff" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }}></span>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</span>
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "var(--primary-300)" }}>
                        {item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                <button
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => alert("XAI Explainability Report generated with Grad-CAM and SHAP attribution maps.")}
                >
                  ðŸ“„ Export XAI Audit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

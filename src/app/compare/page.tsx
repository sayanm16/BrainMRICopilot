"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ComparePage() {
  const [sliceIdx, setSliceIdx] = useState(80);
  const [showDifference, setShowDifference] = useState(true);

  const canvasBaseRef = useRef<HTMLCanvasElement>(null);
  const canvasFollowRef = useRef<HTMLCanvasElement>(null);
  const canvasDiffRef = useRef<HTMLCanvasElement>(null);

  // Render comparative simulated MRI scans
  useEffect(() => {
    const size = 260;
    const cx = size / 2;
    const cy = size / 2;

    // 1. Baseline Scan
    const canvasBase = canvasBaseRef.current;
    if (canvasBase) {
      canvasBase.width = size;
      canvasBase.height = size;
      const ctx = canvasBase.getContext("2d")!;
      const img = ctx.createImageData(size, size);
      const d = img.data;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const idx = (y * size + x) * 4;
          const dx = (x - cx) / cx;
          const dy = (y - cy) / cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.85) {
            let base = 60 + (1 - dist) * 130;
            // Baseline lesion: 32 mm
            const lDist = Math.hypot(dx - (-0.3), dy - 0.15);
            if (lDist < 0.25) {
              base = 220;
            }
            d[idx] = base;
            d[idx + 1] = base;
            d[idx + 2] = base;
            d[idx + 3] = 255;
          } else {
            d[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    // 2. Follow-Up Scan (after radiation/chemo: lesion reduced to 18 mm)
    const canvasFollow = canvasFollowRef.current;
    if (canvasFollow) {
      canvasFollow.width = size;
      canvasFollow.height = size;
      const ctx = canvasFollow.getContext("2d")!;
      const img = ctx.createImageData(size, size);
      const d = img.data;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const idx = (y * size + x) * 4;
          const dx = (x - cx) / cx;
          const dy = (y - cy) / cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.85) {
            let base = 60 + (1 - dist) * 130;
            // Follow up lesion: shrunk to 0.14 radius
            const lDist = Math.hypot(dx - (-0.3), dy - 0.15);
            if (lDist < 0.14) {
              base = 210;
            }
            d[idx] = base;
            d[idx + 1] = base;
            d[idx + 2] = base;
            d[idx + 3] = 255;
          } else {
            d[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    // 3. Difference Subtraction Heatmap
    const canvasDiff = canvasDiffRef.current;
    if (canvasDiff) {
      canvasDiff.width = size;
      canvasDiff.height = size;
      const ctx = canvasDiff.getContext("2d")!;
      const img = ctx.createImageData(size, size);
      const d = img.data;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const idx = (y * size + x) * 4;
          const dx = (x - cx) / cx;
          const dy = (y - cy) / cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.85) {
            const lDist = Math.hypot(dx - (-0.3), dy - 0.15);
            if (lDist >= 0.14 && lDist < 0.25) {
              // Shrunk region (marked in emerald green = positive response)
              d[idx] = 16;
              d[idx + 1] = 185;
              d[idx + 2] = 129;
              d[idx + 3] = 240;
            } else if (lDist < 0.14) {
              // Residual core (cyan)
              d[idx] = 6;
              d[idx + 1] = 182;
              d[idx + 2] = 212;
              d[idx + 3] = 200;
            } else {
              // Base anatomical tissue
              const val = 30 + (1 - dist) * 50;
              d[idx] = val;
              d[idx + 1] = val;
              d[idx + 2] = val;
              d[idx + 3] = 255;
            }
          } else {
            d[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }
  }, [sliceIdx]);

  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="page-container">
          {/* Header */}
          <div className="page-title-section">
            <h1 className="page-title">Longitudinal MRI Comparison & Subtraction</h1>
            <p className="page-description">
              Compare baseline and follow-up scans with voxel-wise delta subtraction, automated tumor volumetry tracking, and therapeutic response quantification.
            </p>
          </div>

          {/* Sync Controls Bar */}
          <div className="card" style={{ padding: "14px 20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "12.5px", color: "var(--text-tertiary)", fontWeight: 600 }}>Synchronized Axial Slices:</span>
              <input
                type="range"
                min="20"
                max="140"
                value={sliceIdx}
                onChange={(e) => setSliceIdx(parseInt(e.target.value))}
                style={{ width: "160px" }}
              />
              <span style={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "var(--primary-300)" }}>Slice #{sliceIdx}</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span className="badge badge-green">RANO Criteria: Partial Response (PR)</span>
            </div>
          </div>

          {/* Tri-Viewer Grid */}
          <div className="grid-3" style={{ marginBottom: "24px" }}>
            {/* Scan 1: Baseline */}
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Baseline Scan (Day 0)</span>
                <span className="badge badge-rose">Pre-Treatment</span>
              </div>
              <canvas ref={canvasBaseRef} style={{ borderRadius: "var(--radius-md)", width: "100%", height: "auto", background: "#000" }} />
              <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "left" }}>
                <div>Tumor Volume: <strong style={{ color: "var(--danger-400)" }}>89.4 cmÂ³</strong></div>
                <div>Peritumoral Edema: <strong>24.2 cmÂ³</strong></div>
              </div>
            </div>

            {/* Scan 2: Follow-up */}
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Follow-up Scan (Month 3)</span>
                <span className="badge badge-blue">Post-Cycle 2</span>
              </div>
              <canvas ref={canvasFollowRef} style={{ borderRadius: "var(--radius-md)", width: "100%", height: "auto", background: "#000" }} />
              <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "left" }}>
                <div>Tumor Volume: <strong style={{ color: "var(--success-400)" }}>46.1 cmÂ³</strong></div>
                <div>Peritumoral Edema: <strong>11.8 cmÂ³</strong></div>
              </div>
            </div>

            {/* Scan 3: Subtraction Map */}
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Voxel Subtraction Delta</span>
                <span className="badge badge-green">Regression Map</span>
              </div>
              <canvas ref={canvasDiffRef} style={{ borderRadius: "var(--radius-md)", width: "100%", height: "auto", background: "#000" }} />
              <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "left" }}>
                <div>Net Reduction: <strong style={{ color: "var(--success-400)" }}>-43.3 cmÂ³ (-48.4%)</strong></div>
                <div>Edema Resolution: <strong>-51.2%</strong></div>
              </div>
            </div>
          </div>

          {/* Quantitative Change Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-title-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--success-400)" }}>ðŸ“ˆ</span>
                Quantitative Volumetric Delta (Baseline vs Month 3)
              </div>
              <span className="badge badge-purple">Automated SAM-Med3D Measurement</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Region / Biomarker</th>
                  <th>Baseline</th>
                  <th>Month 3</th>
                  <th>Absolute Delta</th>
                  <th>Relative Delta</th>
                  <th>Response Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Temporal Lesion Core</strong></td>
                  <td>89.4 cmÂ³</td>
                  <td>46.1 cmÂ³</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-43.3 cmÂ³</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-48.4%</td>
                  <td><span className="badge badge-green">Regression</span></td>
                </tr>
                <tr>
                  <td><strong>Peritumoral Vasogenic Edema</strong></td>
                  <td>24.2 cmÂ³</td>
                  <td>11.8 cmÂ³</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-12.4 cmÂ³</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-51.2%</td>
                  <td><span className="badge badge-green">Resolved</span></td>
                </tr>
                <tr>
                  <td><strong>Left Hippocampus</strong></td>
                  <td>3.8 cmÂ³</td>
                  <td>3.7 cmÂ³</td>
                  <td style={{ color: "var(--warning-400)", fontFamily: "JetBrains Mono" }}>-0.1 cmÂ³</td>
                  <td style={{ color: "var(--warning-400)", fontFamily: "JetBrains Mono" }}>-2.6%</td>
                  <td><span className="badge badge-amber">Stable</span></td>
                </tr>
                <tr>
                  <td><strong>Ventricle Compression (Mass Effect)</strong></td>
                  <td>2.8 mm shift</td>
                  <td>0.9 mm shift</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-1.9 mm</td>
                  <td style={{ color: "var(--success-400)", fontFamily: "JetBrains Mono" }}>-67.8%</td>
                  <td><span className="badge badge-green">Relieved</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

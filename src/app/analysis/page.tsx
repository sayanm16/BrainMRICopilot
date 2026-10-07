"use client";
import { useState, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import SliceViewer from "@/components/brain/SliceViewer";
import { sampleRegions } from "@/data/sampleData";
import { BrainRegion } from "@/types";

const BrainViewer3D = dynamic(() => import("@/components/brain/BrainViewer3D"), { ssr: false });

export default function AnalysisPage() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(sampleRegions[0]);
  const [activeTab, setActiveTab] = useState<"3d" | "slices">("3d");
  const [showOverlay, setShowOverlay] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [sliceIndex, setSliceIndex] = useState(80);
  const [modelPreset, setModelPreset] = useState<"sam-med3d-turbo" | "sam-med3d-heavy">("sam-med3d-turbo");
  const [selectedScan, setSelectedScan] = useState("Patient_0489_T1w_MPRAGE.nii.gz");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedScan(file.name);
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 17;
      });
    }, 280);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="page-container">
          {/* Page Title & Controls Header */}
          <div className="page-title-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 className="page-title">3D Volumetric Segmentation & Inference</h1>
              <p className="page-description">
                Interactive multi-planar visualization powered by <strong>SAM-Med3D</strong> and <strong>MedGemma</strong> feature extraction. Inspect segmented anatomical structures and lesion contours.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".nii,.nii.gz,.dcm"
                onChange={handleSimulatedUpload}
              />
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                ðŸ“ Upload NIfTI / DICOM
              </button>
              <button
                className="btn btn-accent"
                onClick={triggerAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? `Analyzing (${analysisProgress}%)` : "âš¡ Run Inference"}
              </button>
            </div>
          </div>

          {/* Active File Notification Bar */}
          <div className="card" style={{ padding: "14px 20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="badge badge-blue">T1-Weighted 3D</span>
              <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                Active Scan: <span style={{ color: "var(--accent-400)", fontFamily: "JetBrains Mono" }}>{selectedScan}</span>
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                Matrix: 256Ã—256Ã—176 | Voxel: 1.0Ã—1.0Ã—1.0 mmÂ³
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--text-secondary)", cursor: "pointer" }}>
                <span>Segmentation Mask:</span>
                <div className="toggle">
                  <input
                    type="checkbox"
                    checked={showOverlay}
                    onChange={(e) => setShowOverlay(e.target.checked)}
                  />
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  className={`tab ${activeTab === "3d" ? "active" : ""}`}
                  onClick={() => setActiveTab("3d")}
                  style={{ padding: "6px 14px" }}
                >
                  ðŸŒ 3D Mesh
                </button>
                <button
                  className={`tab ${activeTab === "slices" ? "active" : ""}`}
                  onClick={() => setActiveTab("slices")}
                  style={{ padding: "6px 14px" }}
                >
                  ðŸ“ Tri-Planar Slices
                </button>
              </div>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid-sidebar">
            {/* Left Viewer Main Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {activeTab === "3d" ? (
                <div className="card" style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>ðŸ§Š</span> SAM-Med3D Volumetric Mesh Reconstruction
                    </div>
                    <span className="badge badge-purple">Three.js Shaded Mesh</span>
                  </div>
                  <BrainViewer3D
                    showSegmentation={showOverlay}
                    highlightRegion={selectedRegion?.name.toLowerCase()}
                    compact={false}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "12px", color: "var(--text-tertiary)" }}>
                    <span>Left Click + Drag: Rotate volume</span>
                    <span>Scroll: Zoom in/out</span>
                    <span>Right Click: Pan view</span>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>ðŸ”¬</span> Multi-Planar Orthogonal Slices
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Slice Sync:</span>
                      <input
                        type="range"
                        min="20"
                        max="140"
                        value={sliceIndex}
                        onChange={(e) => setSliceIndex(parseInt(e.target.value))}
                        style={{ width: "120px" }}
                      />
                      <span style={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "var(--primary-300)" }}>{sliceIndex}</span>
                    </div>
                  </div>
                  <div className="slice-grid">
                    <SliceViewer plane="axial" sliceIndex={sliceIndex} showOverlay={showOverlay} />
                    <SliceViewer plane="coronal" sliceIndex={sliceIndex} showOverlay={showOverlay} />
                    <SliceViewer plane="sagittal" sliceIndex={sliceIndex} showOverlay={showOverlay} />
                  </div>
                </div>
              )}

              {/* Segmented Anatomical Regions Table */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(6,182,212,0.15)", color: "var(--accent-400)" }}>ðŸ“Š</span>
                    Segmented ROI Quantification & Dice Scores
                  </div>
                  <span className="badge badge-green">8 Regions Identified</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Region Name</th>
                        <th>Volume</th>
                        <th>Confidence</th>
                        <th>Centroid [X, Y, Z]</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRegions.map((region) => {
                        const isSelected = selectedRegion?.id === region.id;
                        return (
                          <tr
                            key={region.id}
                            style={{
                              background: isSelected ? "rgba(49, 130, 206, 0.12)" : "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() => setSelectedRegion(region)}
                          >
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: region.color }}></span>
                                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{region.name}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: "JetBrains Mono" }}>{region.volume} {region.volumeUnit}</td>
                            <td>
                              <span className="badge badge-blue">
                                {(region.confidence * 100).toFixed(1)}%
                              </span>
                            </td>
                            <td style={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "var(--text-tertiary)" }}>
                              [{region.centroid.join(", ")}]
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-ghost"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRegion(region);
                                }}
                              >
                                {isSelected ? "Active Focus" : "Inspect"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Details & Diagnosis Summary Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Selected Region Inspector */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(244,63,94,0.15)", color: "var(--danger-400)" }}>ðŸŽ¯</span>
                    Region Inspector
                  </div>
                </div>

                {selectedRegion ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: selectedRegion.color }}></div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{selectedRegion.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Label ID: #{selectedRegion.label}</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                        Volumetric Measurement
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "JetBrains Mono" }}>
                        {selectedRegion.volume} <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{selectedRegion.volumeUnit}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                        Anatomical Description
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {selectedRegion.description}
                      </p>
                    </div>

                    <div style={{ padding: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--radius-md)" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--warning-400)", marginBottom: "4px" }}>
                        âš ï¸ Clinical Relevance
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                        {selectedRegion.clinicalSignificance}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <a href={`/xai?region=${encodeURIComponent(selectedRegion.name)}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                        ðŸ’¡ View XAI Map
                      </a>
                      <a href={`/evidence?query=${encodeURIComponent(selectedRegion.name)}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                        ðŸ“š Get Evidence
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Select a region from the list to view detailed metrics.</p>
                  </div>
                )}
              </div>

              {/* MedGemma Multimodal Diagnosis Prediction */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="card-title-icon" style={{ background: "rgba(139,92,246,0.15)", color: "var(--purple-400)" }}>ðŸ§ </span>
                    MedGemma Prediction
                  </div>
                  <span className="badge badge-purple">Multimodal Fusion</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Primary Classification</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>
                      High-Grade Glioma (Astrocytoma / GBM)
                    </div>
                  </div>

                  <div className="confidence-meter">
                    <div className="confidence-meter-label">
                      <span style={{ color: "var(--text-tertiary)" }}>Model Confidence</span>
                      <span style={{ fontWeight: 700, color: "var(--success-400)" }}>92.4%</span>
                    </div>
                    <div className="confidence-meter-bar">
                      <div className="confidence-meter-fill confidence-high" style={{ width: "92.4%" }}></div>
                    </div>
                  </div>

                  <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                    <div>Secondary Hypothesis: Low-Grade Infiltration (5.2%)</div>
                    <div>Uncertainty Margin: Â±2.4% (MC Dropout)</div>
                  </div>

                  <div className="divider" style={{ margin: "10px 0" }}></div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                      Recommended Next Actions
                    </div>
                    <div className="tag" style={{ justifyContent: "flex-start", padding: "8px 10px", color: "var(--text-primary)" }}>
                      ðŸ” Verify Peritumoral Infiltration on FLAIR
                    </div>
                    <div className="tag" style={{ justifyContent: "flex-start", padding: "8px 10px", color: "var(--text-primary)" }}>
                      ðŸ“‘ Query PubMed RAG for IDH-1 mutation correlations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

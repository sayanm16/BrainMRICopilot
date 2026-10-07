"use client";
import { useRef, useEffect, useState } from "react";

interface SliceViewerProps {
  plane: "axial" | "coronal" | "sagittal";
  sliceIndex?: number;
  showOverlay?: boolean;
  width?: number;
  height?: number;
}

// Generate simulated brain MRI slice data
function generateBrainSlice(plane: string, sliceIdx: number, size: number): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Brain outline (elliptical)
      let ax = 0.85, ay = 0.75;
      if (plane === "sagittal") { ax = 0.7; ay = 0.8; }
      if (plane === "coronal") { ax = 0.8; ay = 0.85; }

      const ellipseDist = (dx * dx) / (ax * ax) + (dy * dy) / (ay * ay);

      if (ellipseDist < 1) {
        // Inside brain
        const depth = 1 - ellipseDist;
        let intensity = 40 + depth * 160;

        // Gray matter (cortex) - brighter ring
        if (ellipseDist > 0.6 && ellipseDist < 0.85) {
          intensity = 120 + Math.sin(dx * 20 + dy * 15) * 15 + depth * 60;
        }

        // White matter - bright center
        if (ellipseDist < 0.4) {
          intensity = 160 + depth * 80;
        }

        // Ventricles (dark spots in center)
        const ventDist = Math.sqrt((dx * 2) * (dx * 2) + (dy - 0.05) * (dy - 0.05) * 4);
        if (ventDist < 0.2 && plane !== "sagittal") {
          intensity = 15 + Math.random() * 5;
        }

        // Slice variation
        const sliceEffect = Math.sin(sliceIdx * 0.05) * 20;
        intensity += sliceEffect;

        // Add noise
        intensity += (Math.random() - 0.5) * 12;
        intensity = Math.max(0, Math.min(255, intensity));

        data[idx] = intensity;
        data[idx + 1] = intensity;
        data[idx + 2] = intensity;
        data[idx + 3] = 255;
      } else {
        // Background
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }
  }
  return imageData;
}

// Segmentation overlay
function generateOverlay(plane: string, sliceIdx: number, size: number): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  const cx = size / 2;
  const cy = size / 2;

  const regions = [
    { x: -0.3, y: 0.1, rx: 0.2, ry: 0.15, r: 255, g: 107, b: 107, label: "temporal" },
    { x: 0.2, y: -0.25, rx: 0.2, ry: 0.2, r: 78, g: 205, b: 196, label: "frontal" },
    { x: -0.15, y: 0.05, rx: 0.08, ry: 0.06, r: 69, g: 183, b: 209, label: "hippocampus" },
    { x: 0, y: 0.35, rx: 0.3, ry: 0.15, r: 150, g: 206, b: 180, label: "cerebellum" },
    { x: 0.1, y: -0.05, rx: 0.06, ry: 0.07, r: 254, g: 202, b: 87, label: "caudate" },
    { x: 0, y: 0, rx: 0.08, ry: 0.08, r: 255, g: 159, b: 243, label: "thalamus" },
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      for (const region of regions) {
        const rdx = (dx - region.x) / region.rx;
        const rdy = (dy - region.y) / region.ry;
        const rDist = rdx * rdx + rdy * rdy;

        if (rDist < 1) {
          const alpha = (1 - rDist) * 120;
          data[idx] = region.r;
          data[idx + 1] = region.g;
          data[idx + 2] = region.b;
          data[idx + 3] = alpha;
          break;
        }
      }
    }
  }
  return imageData;
}

export default function SliceViewer({ plane, sliceIndex: externalSlice, showOverlay = true, width = 256, height = 256 }: SliceViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalSlice, setInternalSlice] = useState(80);
  const sliceIndex = externalSlice ?? internalSlice;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Draw brain slice
    const brainData = generateBrainSlice(plane, sliceIndex, size);
    ctx.putImageData(brainData, 0, 0);

    // Draw overlay
    if (showOverlay) {
      const overlayData = generateOverlay(plane, sliceIndex, size);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext("2d")!;
      tempCtx.putImageData(overlayData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    // Draw crosshair
    ctx.strokeStyle = "rgba(99, 179, 237, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw slice info
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, 70, 20);
    ctx.fillStyle = "#63b3ed";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(`${plane.charAt(0).toUpperCase() + plane.slice(1)}`, 6, 14);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`#${sliceIndex}`, 52, 14);
  }, [plane, sliceIndex, showOverlay]);

  return (
    <div className="slice-panel">
      <div className="slice-panel-header">
        <span>{plane.charAt(0).toUpperCase() + plane.slice(1)}</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--text-tertiary)" }}>
          Slice {sliceIndex}/160
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="slice-canvas"
        style={{ width, height, imageRendering: "pixelated" }}
      />
      {externalSlice === undefined && (
        <div className="slice-slider">
          <input
            type="range"
            min="0"
            max="160"
            value={internalSlice}
            onChange={(e) => setInternalSlice(parseInt(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}

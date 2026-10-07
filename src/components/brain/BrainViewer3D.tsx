"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface BrainViewer3DProps {
  showSegmentation?: boolean;
  highlightRegion?: string | null;
  compact?: boolean;
}

export default function BrainViewer3D({ showSegmentation = true, highlightRegion, compact = false }: BrainViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = compact ? 300 : 400;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a14);
    scene.fog = new THREE.FogExp2(0x050a14, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x4466aa, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x88bbff, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xff6688, 0.3);
    backLight.position.set(-5, -2, -5);
    scene.add(backLight);

    const rimLight = new THREE.PointLight(0x22d3ee, 0.8, 20);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Brain base geometry (approximation using sphere with deformation)
    const brainGeometry = new THREE.SphereGeometry(1.4, 64, 64);
    const positions = brainGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      // Create brain-like shape with two hemispheres
      const hemisphereGap = Math.abs(x) < 0.05 ? 0.92 : 1;
      const frontBulge = z > 0 ? 1 + z * 0.15 : 1;
      const topFlat = y > 0.8 ? 1 - (y - 0.8) * 0.3 : 1;
      const bottomTaper = y < -0.5 ? 1 - Math.abs(y + 0.5) * 0.4 : 1;
      // Add cortical folds (wrinkles)
      const folds = 1 + Math.sin(x * 12 + y * 8) * 0.02 + Math.sin(y * 15 + z * 10) * 0.015;
      const scale = hemisphereGap * frontBulge * topFlat * bottomTaper * folds;
      positions.setXYZ(i, x * scale, y * (y > 0 ? 1.1 : 0.9), z * (z > 0 ? 1.05 : 0.95));
    }
    brainGeometry.computeVertexNormals();

    const brainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xddbbcc,
      roughness: 0.6,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      transmission: 0.1,
      opacity: showSegmentation ? 0.5 : 0.85,
      transparent: true,
    });

    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    brain.castShadow = true;
    scene.add(brain);

    // Segmentation regions (colored spheres/shapes)
    const regionMeshes: THREE.Mesh[] = [];
    if (showSegmentation) {
      const regions = [
        { pos: [-0.7, 0.1, 0.4], color: 0xff6b6b, scale: [0.5, 0.4, 0.5], name: "temporal" },
        { pos: [0.4, 0.6, 0.5], color: 0x4ecdc4, scale: [0.5, 0.5, 0.4], name: "frontal" },
        { pos: [-0.3, -0.2, 0.2], color: 0x45b7d1, scale: [0.2, 0.15, 0.25], name: "hippocampus" },
        { pos: [0, -0.8, -0.4], color: 0x96ceb4, scale: [0.8, 0.4, 0.5], name: "cerebellum" },
        { pos: [0.35, 0.2, 0.3], color: 0xfeca57, scale: [0.15, 0.18, 0.15], name: "caudate" },
        { pos: [0, 0, 0.1], color: 0xff9ff3, scale: [0.2, 0.2, 0.2], name: "thalamus" },
        { pos: [0, 0.3, 0], color: 0x54a0ff, scale: [0.6, 0.08, 0.15], name: "corpus_callosum" },
      ];

      regions.forEach(({ pos, color, scale, name }) => {
        const geo = new THREE.SphereGeometry(1, 16, 16);
        const mat = new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.3,
          metalness: 0.2,
          transmission: 0.3,
          opacity: highlightRegion === name ? 0.9 : 0.5,
          transparent: true,
          emissive: new THREE.Color(color),
          emissiveIntensity: highlightRegion === name ? 0.4 : 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.scale.set(scale[0], scale[1], scale[2]);
        regionMeshes.push(mesh);
        scene.add(mesh);
      });
    }

    // Particle system for neural connections
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.5;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.cos(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.6);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 20, 0x112244, 0x0a1628);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Animation
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating) {
        brain.rotation.y = elapsed * 0.3;
        regionMeshes.forEach(m => { m.rotation.y = elapsed * 0.3; });
      }
      particles.rotation.y = elapsed * 0.1;
      particles.rotation.x = Math.sin(elapsed * 0.2) * 0.05;

      // Pulsing effect for highlighted regions
      regionMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.1 + Math.sin(elapsed * 2) * 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      brain.rotation.y += deltaX * 0.005;
      brain.rotation.x += deltaY * 0.005;
      regionMeshes.forEach(m => {
        m.rotation.y += deltaX * 0.005;
        m.rotation.x += deltaY * 0.005;
      });
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      camera.position.z += e.deltaY * 0.005;
      camera.position.z = Math.max(2.5, Math.min(10, camera.position.z));
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel);

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = compact ? 300 : 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [showSegmentation, highlightRegion, isRotating, compact]);

  return (
    <div className="brain-3d-container" ref={containerRef} style={{ height: compact ? 300 : 400 }}>
      <div className="viewer-controls">
        <button
          className={`viewer-control-btn ${isRotating ? "active" : ""}`}
          onClick={() => setIsRotating(!isRotating)}
          title="Auto-rotate"
        >
          \u21bb
        </button>
        <button className="viewer-control-btn" title="Reset view">
          \u2302
        </button>
        <button className="viewer-control-btn" title="Toggle segmentation">
          \ud83c\udfa8
        </button>
        <button className="viewer-control-btn" title="Fullscreen">
          \u26f6
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  text?: string;
  mouseX: number;
  mouseY: number;
  className?: string;
}

const GOLD_COLORS = [
  [0.91, 0.686, 0.282], // #e8af48
  [0.984, 0.749, 0.141], // #fbbf24
  [0.961, 0.784, 0.255], // #f5c842
  [0.831, 0.647, 0.125], // #d4a520
  [1.0,   0.843, 0.502], // #ffd580
];

function sampleTextPositions(
  text: string,
  canvasW: number,
  canvasH: number,
  density: number
): { x: number; y: number }[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = canvasW;
  offscreen.height = canvasH;
  const ctx = offscreen.getContext("2d")!;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = "#ffffff";

  // Fit font size so text fills ~85% of canvas width
  let fontSize = Math.floor(canvasH * 0.65);
  ctx.font = `900 ${fontSize}px "Geist Variable", "Inter", sans-serif`;
  let measured = ctx.measureText(text);
  while (measured.width > canvasW * 0.88 && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px "Geist Variable", "Inter", sans-serif`;
    measured = ctx.measureText(text);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasW / 2, canvasH / 2);

  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imageData.data;
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < canvasH; y += density) {
    for (let x = 0; x < canvasW; x += density) {
      const idx = (y * canvasW + x) * 4;
      if (data[idx + 3] > 100) {
        points.push({
          x: (x / canvasW) * 2 - 1,
          y: -((y / canvasH) * 2 - 1),
        });
      }
    }
  }

  return points;
}

export const GoldenParticleText = ({
  text = "FOLLOW LABS",
  mouseX,
  mouseY,
  className,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Keep mouse ref in sync without triggering re-renders in the animation loop
  mouseRef.current = { x: mouseX, y: mouseY };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement!;

    // ── Scene setup ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Sample text ────────────────────────────────────────────────
    // Use a 900×200 virtual canvas; density=3 gives ~4–6k particles
    const VIRTUAL_W = 900;
    const VIRTUAL_H = 200;
    const DENSITY = 3;

    const rawPoints = sampleTextPositions(text, VIRTUAL_W, VIRTUAL_H, DENSITY);
    const COUNT = rawPoints.length;

    // ── Geometry arrays ────────────────────────────────────────────
    const targetPos = new Float32Array(COUNT * 3);
    const currentPos = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    // Compute a scale factor so the text fills ~60% of screen width in 3D
    // At z=0 with fov=60 and camera at z=1, visible height = 2*tan(30°)*1 ≈ 1.155
    // visible width = aspect * 1.155
    const aspect = container.clientWidth / container.clientHeight;
    const visH = 2 * Math.tan((60 / 2) * (Math.PI / 180)) * 1; // ~1.155
    const visW = visH * aspect;

    // Text occupies visW*0.7 width; virtual canvas is 900 wide, text fits 88%
    const scale = (visW * 0.70) / (VIRTUAL_W / VIRTUAL_W); // scale normalised coords

    for (let i = 0; i < COUNT; i++) {
      const p = rawPoints[i];
      // The normalised coords span roughly ±0.88 in X and ±(200/900)*0.88 in Y
      // Map to world space
      const wx = p.x * scale * 0.5;
      const wy = p.y * scale * 0.5 * (VIRTUAL_H / VIRTUAL_W);

      targetPos[i * 3] = wx;
      targetPos[i * 3 + 1] = wy;
      targetPos[i * 3 + 2] = 0;

      // Start scattered
      currentPos[i * 3] = (Math.random() - 0.5) * visW * 1.2;
      currentPos[i * 3 + 1] = (Math.random() - 0.5) * visH * 1.2;
      currentPos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      // Random gold color
      const c = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];

      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Animation ──────────────────────────────────────────────────
    const SPRING = 0.045;
    const DAMPING = 0.86;
    const REPEL_RADIUS_NDC = 0.28; // in normalised [-1,1] space
    const REPEL_STRENGTH = 0.0018;
    const MORPH_DURATION = 2200; // ms

    const startTime = performance.now();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = performance.now() - startTime;
      const morphT = Math.min(elapsed / MORPH_DURATION, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - morphT, 3);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;

        // During morph-in, blend target with current to pull particles in
        const tx = targetPos[i3];
        const ty = targetPos[i3 + 1];

        // Spring toward target
        const dx = tx - currentPos[i3];
        const dy = ty - currentPos[i3 + 1];

        // Before morph completes, add extra pull
        const springK = SPRING + (1 - ease) * 0.08;

        velocities[i3] += dx * springK;
        velocities[i3 + 1] += dy * springK;

        // Mouse repulsion in NDC space
        // Convert world pos → NDC
        const ndcX = (currentPos[i3] / (visW * 0.5));
        const ndcY = (currentPos[i3 + 1] / (visH * 0.5));

        const rdx = ndcX - mx;
        const rdy = ndcY - my;
        const dist2 = rdx * rdx + rdy * rdy;

        if (dist2 < REPEL_RADIUS_NDC * REPEL_RADIUS_NDC && dist2 > 0.0001) {
          const dist = Math.sqrt(dist2);
          const force = REPEL_STRENGTH / dist2;
          velocities[i3] += (rdx / dist) * force;
          velocities[i3 + 1] += (rdy / dist) * force;
        }

        // Integrate
        velocities[i3] *= DAMPING;
        velocities[i3 + 1] *= DAMPING;
        currentPos[i3] += velocities[i3];
        currentPos[i3 + 1] += velocities[i3 + 1];
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ─────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [text]); // only re-init if text changes

  return <canvas ref={canvasRef} className={className} />;
};

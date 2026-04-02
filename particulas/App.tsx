import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Laptop, Sparkles, MousePointer2, Cpu } from 'lucide-react';

const GOLD_COLOR = 0xFFD700;
const DARK_BG = 0x0a0a0a;
const LAPTOP_COLOR = 0x222222;

const ParticleNotebook = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouse = useRef(new THREE.Vector2(-100, -100));

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DARK_BG);
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 8);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(GOLD_COLOR, 4.0, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const frontLight = new THREE.DirectionalLight(GOLD_COLOR, 1.2);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    // --- Notebook Geometry (Refined) ---
    const notebookGroup = new THREE.Group();
    scene.add(notebookGroup);

    // Base (Thinner, more modern)
    const baseGeom = new THREE.BoxGeometry(4.5, 0.15, 3.2);
    const baseMat = new THREE.MeshStandardMaterial({ 
      color: LAPTOP_COLOR, 
      metalness: 1.0, 
      roughness: 0.5 
    });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.y = -0.075;
    notebookGroup.add(base);

    // Trackpad area
    const trackpadGeom = new THREE.PlaneGeometry(1.2, 0.8);
    const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1.0 });
    const trackpad = new THREE.Mesh(trackpadGeom, trackpadMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.01, 0.8);
    notebookGroup.add(trackpad);

    // Screen Lid
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0, -1.6); // Hinge position
    lidGroup.rotation.x = -0.1; // Initial open position
    notebookGroup.add(lidGroup);

    const lidGeom = new THREE.BoxGeometry(4.5, 3.2, 0.08);
    const lidMat = new THREE.MeshStandardMaterial({ 
      color: LAPTOP_COLOR, 
      metalness: 1.0, 
      roughness: 0.4 
    });
    const lid = new THREE.Mesh(lidGeom, lidMat);
    lid.position.set(0, 1.6, 0.04);
    lidGroup.add(lid);

    // Screen Surface (Bezels)
    const screenGeom = new THREE.PlaneGeometry(4.3, 3.0);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 1.6, 0.09);
    lidGroup.add(screen);

    // --- Particle System for Text ---
    const textCanvas = document.createElement('canvas');
    const tCtx = textCanvas.getContext('2d');
    textCanvas.width = 512;
    textCanvas.height = 256;

    if (tCtx) {
      tCtx.fillStyle = 'white';
      tCtx.font = 'bold 70px Inter, sans-serif';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText('Follow Labs', 256, 128);
    }

    const particlesCount = 15000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    
    // Sample text pixels
    const textData = tCtx?.getImageData(0, 0, 512, 256).data;
    const points: THREE.Vector2[] = [];
    if (textData) {
      for (let y = 0; y < 256; y += 2) {
        for (let x = 0; x < 512; x += 2) {
          const alpha = textData[(y * 512 + x) * 4 + 3];
          if (alpha > 128) {
            points.push(new THREE.Vector2(
              (x / 512 - 0.5) * 4.0,
              (1 - y / 256 - 0.5) * 2.8
            ));
          }
        }
      }
    }

    const goldColorObj = new THREE.Color(GOLD_COLOR);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      let tx, ty, tz;
      if (i < points.length) {
        // Text particles: White
        tx = points[i].x;
        ty = points[i].y + 1.6;
        tz = 0.1;
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        // Background particles: Gold
        tx = (Math.random() - 0.5) * 4.2;
        ty = (Math.random() - 0.5) * 2.9 + 1.6;
        tz = 0.1;
        colors[i3] = goldColorObj.r;
        colors[i3 + 1] = goldColorObj.g;
        colors[i3 + 2] = goldColorObj.b;
      }

      positions[i3] = tx + (Math.random() - 0.5) * 10;
      positions[i3 + 1] = ty + (Math.random() - 0.5) * 10;
      positions[i3 + 2] = tz + (Math.random() - 0.5) * 10;

      originalPositions[i3] = tx;
      originalPositions[i3 + 1] = ty;
      originalPositions[i3 + 2] = tz;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    lidGroup.add(particleSystem);

    const screenLight = new THREE.PointLight(GOLD_COLOR, 4.0, 5);
    screenLight.position.set(0, 1.6, 0.5);
    lidGroup.add(screenLight);

    // --- Mouse Interaction Logic ---
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.1); // Plane at screen depth
    const intersectPoint = new THREE.Vector3();

    // --- Animation Loop ---
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Notebook tilt and rotation
      notebookGroup.rotation.x = 0; 
      notebookGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      
      // Lid opening animation (Upright / Perpendicular)
      const targetRotation = 0.2; // Slightly tilted back for better perspective
      lidGroup.rotation.x = THREE.MathUtils.lerp(lidGroup.rotation.x, targetRotation, 0.1);

      // Raycast mouse to screen plane
      raycaster.setFromCamera(mouse.current, camera);
      
      // We need to account for the lid rotation and position
      // For simplicity, let's just project to the screen plane in world space
      // and then convert to local space if needed, but since particles are in lidGroup,
      // it's easier to calculate interaction in local space.
      
      // Find mouse position relative to screen center in local space
      // This is a bit tricky with nested groups, so let's use a simpler approach:
      // Project mouse to a plane that follows the screen.
      const screenWorldMatrix = screen.matrixWorld;
      const screenNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(lidGroup.getWorldQuaternion(new THREE.Quaternion()));
      const screenPoint = new THREE.Vector3().setFromMatrixPosition(screenWorldMatrix);
      const interactionPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(screenNormal, screenPoint);
      
      let mouseLocal = new THREE.Vector3(-100, -100, -100);
      if (raycaster.ray.intersectPlane(interactionPlane, intersectPoint)) {
        // Convert world intersect point to lidGroup local space
        mouseLocal = lidGroup.worldToLocal(intersectPoint.clone());
      }

      // Particle movement
      const posAttr = particleGeom.getAttribute('position');
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        const curX = posAttr.array[i3];
        const curY = posAttr.array[i3 + 1];
        const curZ = posAttr.array[i3 + 2];

        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];

        // 1. Return to home force
        let dx = (origX - curX) * 0.15;
        let dy = (origY - curY) * 0.15;
        let dz = (origZ - curZ) * 0.15;

        // 2. Mouse repulsion force
        const mdx = curX - mouseLocal.x;
        const mdy = curY - mouseLocal.y;
        const distSq = mdx * mdx + mdy * mdy;
        const radius = 1.2;
        
        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const force = (radius - dist) / radius;
          dx += (mdx / dist) * force * 1.5;
          dy += (mdy / dist) * force * 1.5;
          dz += force * 0.5; // Push forward slightly
        }

        // 3. Subtle noise
        dx += Math.sin(time * 2 + i) * 0.002;
        dy += Math.cos(time * 2 + i) * 0.002;

        posAttr.array[i3] += dx;
        posAttr.array[i3 + 1] += dy;
        posAttr.array[i3 + 2] += dz;
      }
      posAttr.needsUpdate = true;

      // Pulse gold color
      particleMat.opacity = 0.9 + Math.sin(time * 2) * 0.1;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <h1 className="text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600 uppercase mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Follow Labs
            </h1>
            <div className="flex items-center justify-center gap-6 text-yellow-500/40 text-[10px] font-mono tracking-[0.3em] uppercase">
              <span className="flex items-center gap-2"><Cpu size={12} /> Neural Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/20" />
              <span className="flex items-center gap-2"><Sparkles size={12} /> Quantum Particles</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-10 left-10 flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 animate-ping absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            </div>
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Interactive Mode</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-8">
              <span className="text-[9px] text-white/30 uppercase font-mono">Particle Count</span>
              <span className="text-[9px] text-yellow-500/80 font-mono">15,000 units</span>
            </div>
            <div className="flex justify-between items-center gap-8">
              <span className="text-[9px] text-white/30 uppercase font-mono">Physics Engine</span>
              <span className="text-[9px] text-yellow-500/80 font-mono">Repulsion Active</span>
            </div>
            <div className="w-full h-px bg-white/5" />
            <p className="text-[9px] font-mono text-white/40 leading-relaxed max-w-[180px]">
              Hover over the screen to interact with the golden particle field.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-10 right-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-mono uppercase tracking-[0.2em] backdrop-blur-md"
        >
          <MousePointer2 size={12} className="text-yellow-500" />
          Tactile Feedback Enabled
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-yellow-500/30">
      <ParticleNotebook />
    </main>
  );
}

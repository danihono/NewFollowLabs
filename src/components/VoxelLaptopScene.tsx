import { useEffect, useRef } from "react";
import * as THREE from "three";

type Voxel = {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
};

const VOXEL_SIZE = 0.9;
const GAP = 0.08;
const UNIT = VOXEL_SIZE + GAP;
const HOVER_LIFT = UNIT * 5.5;
const HOVER_SCALE = 2.2;
const BASE_BACK_Z = 0;
const BASE_FRONT_Z = 11;
const BASE_BODY_TOP_Y = 1;
const BASE_DECK_Y = 2;
const HINGE_TOP_Y = BASE_DECK_Y + 1;
const SCREEN_TOP_Y = 19;
const SCREEN_INNER_BOTTOM_Y = HINGE_TOP_Y + 1;
const SCREEN_INNER_TOP_Y = SCREEN_TOP_Y - 1;

export const VoxelLaptopScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 600);
    camera.position.set(0, 4, 55);
    camera.lookAt(-18, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(10, 30, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-15, 10, -20);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
    topLight.position.set(0, 40, 0);
    scene.add(topLight);

    const screenGlow = new THREE.PointLight(0x0a2fff, 0.75, 48);
    screenGlow.position.set(0, 2, 8);
    scene.add(screenGlow);

    const voxels: Voxel[] = [];
    const addVoxel = (x: number, y: number, z: number, color: THREE.Color) => {
      voxels.push({
        x: x * UNIT,
        y: y * UNIT,
        z: z * UNIT,
        r: color.r,
        g: color.g,
        b: color.b,
      });
    };

    const BODY = new THREE.Color(0x2a2a2a);
    const BODY_MID = new THREE.Color(0x333333);
    const EDGE = new THREE.Color(0x1a1a1a);
    const BEZEL = new THREE.Color(0x141414);
    const BASE_GLOW = new THREE.Color(0x101216);
    const BASE = new THREE.Color(0x171a20);
    const HINGE = new THREE.Color(0x111111);

    // IDE screen palette (Dracula-inspired)
    const SCR_BG      = new THREE.Color(0x0d1117);
    const SCR_TITLE   = new THREE.Color(0x010409);
    const SCR_TAB     = new THREE.Color(0x161b22);
    const SCR_TAB_ACT = new THREE.Color(0x1f2a3a);
    const SCR_LINE_HL = new THREE.Color(0x1c2128);
    const SCR_STATUS  = new THREE.Color(0x1e3a5f);
    const SCR_LINENUM = new THREE.Color(0x3d444d);
    const DOT_R       = new THREE.Color(0xff5f57);
    const DOT_Y       = new THREE.Color(0xffbd2e);
    const DOT_G       = new THREE.Color(0x28c840);
    const KW          = new THREE.Color(0xbd93f9);
    const IDENT       = new THREE.Color(0xf8f8f2);
    const FN          = new THREE.Color(0x8be9fd);
    const STR         = new THREE.Color(0xf1fa8c);
    const CMT         = new THREE.Color(0x6272a4);
    const NUM         = new THREE.Color(0xffb86c);
    const CURSOR_C    = new THREE.Color(0xf8f8f2);

    let cursorVoxelIndex = -1;
    let cursorOn = true;

    for (let x = -12; x <= 12; x += 1) {
      for (let y = 0; y <= BASE_BODY_TOP_Y; y += 1) {
        for (let z = BASE_BACK_Z; z <= BASE_FRONT_Z; z += 1) {
          let color = BODY_MID;
          if (y === 0 || Math.abs(x) === 12 || z === BASE_FRONT_Z) {
            color = EDGE;
          }
          addVoxel(x, y, z, color);
        }
      }
    }

    for (let x = -12; x <= 12; x += 1) {
      for (let z = BASE_BACK_Z; z <= BASE_FRONT_Z; z += 1) {
        addVoxel(x, BASE_DECK_Y, z, BODY);
      }
    }

    for (let x = -11; x <= 11; x += 2) {
      addVoxel(x, BASE_DECK_Y, 1, BODY_MID);
      addVoxel(x, BASE_DECK_Y, 3, BODY_MID);
    }
    for (let x = -10; x <= 10; x += 2) {
      addVoxel(x, BASE_DECK_Y, 2, BODY_MID);
    }
    for (let x = -4; x <= 4; x += 1) {
      addVoxel(x, BASE_DECK_Y, 4, BODY_MID);
    }
    for (let x = -10; x <= 10; x += 1) {
      for (let z = -1; z <= 0; z += 1) {
        addVoxel(x, BASE_DECK_Y, z, BASE_GLOW);
      }
    }
    for (let x = -5; x <= 5; x += 1) {
      addVoxel(x, BASE_DECK_Y, -1, BASE);
    }
    for (let x = -12; x <= 12; x += 1) {
      addVoxel(x, BASE_DECK_Y, 0, HINGE);
      addVoxel(x, HINGE_TOP_Y, 0, HINGE);
    }

    for (let x = -12; x <= 12; x += 1) {
      for (let y = HINGE_TOP_Y; y <= SCREEN_TOP_Y; y += 1) {
        addVoxel(x, y, -1, BEZEL);
      }
    }
    for (let x = -12; x <= 12; x += 1) {
      addVoxel(x, HINGE_TOP_Y, 0, BEZEL);
      addVoxel(x, SCREEN_TOP_Y, 0, BEZEL);
    }
    for (let y = HINGE_TOP_Y; y <= SCREEN_TOP_Y; y += 1) {
      addVoxel(-12, y, 0, BEZEL);
      addVoxel(12, y, 0, BEZEL);
    }
    const getScreenColor = (x: number, y: number): THREE.Color => {
      if (y === 18) {
        if (x === -8) return DOT_R;
        if (x === -6) return DOT_Y;
        if (x === -4) return DOT_G;
        return SCR_TITLE;
      }
      if (y === 17) return x <= -2 ? SCR_TAB_ACT : SCR_TAB;
      if (y === 4)  return SCR_STATUS;

      const isHL   = y === 11;
      const lineBg = isHL ? SCR_LINE_HL : SCR_BG;

      if (x <= -10) return lineBg;
      if (x <= -8)  return isHL ? SCR_LINE_HL : SCR_LINENUM;

      const col = x + 7; // 0..18

      const rows: Record<number, THREE.Color[]> = {
        16: [KW,KW,KW,KW,KW,KW,SCR_BG,IDENT,SCR_BG,FN,FN,FN,FN,FN,FN,SCR_BG,IDENT,SCR_BG,KW],
        15: [STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR,STR],
        14: [SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
        13: [KW,KW,KW,KW,KW,SCR_BG,IDENT,IDENT,IDENT,IDENT,IDENT,SCR_BG,IDENT,SCR_BG,KW,KW,KW,SCR_BG,SCR_BG],
        12: [FN,FN,IDENT,FN,FN,FN,FN,FN,FN,IDENT,IDENT,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
        11: [FN,FN,FN,FN,FN,IDENT,SCR_LINE_HL,STR,STR,STR,STR,STR,STR,STR,STR,SCR_LINE_HL,CURSOR_C,SCR_LINE_HL,SCR_LINE_HL],
        10: [CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT,CMT],
         9: [IDENT,IDENT,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
         8: [FN,FN,FN,FN,FN,IDENT,FN,FN,FN,IDENT,IDENT,SCR_BG,STR,STR,STR,STR,SCR_BG,IDENT,IDENT],
         7: [SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
         6: [FN,FN,FN,FN,FN,FN,IDENT,SCR_BG,NUM,NUM,NUM,NUM,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
         5: [IDENT,IDENT,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG,SCR_BG],
      };

      return rows[y]?.[col] ?? lineBg;
    };

    for (let x = -11; x <= 11; x += 1) {
      for (let y = SCREEN_INNER_BOTTOM_Y; y <= SCREEN_INNER_TOP_Y; y += 1) {
        if (x === 9 && y === 11) cursorVoxelIndex = voxels.length;
        addVoxel(x, y, 0, getScreenColor(x, y));
      }
    }

    const count = voxels.length;
    const geometry = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.55,
      metalness: 0.05,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    const home = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);
    const currentScale = new Float32Array(count).fill(1);
    const originYOffset = -9;

    voxels.forEach((voxel, index) => {
      const offset = index * 3;

      home[offset] = voxel.x;
      home[offset + 1] = voxel.y + originYOffset * UNIT;
      home[offset + 2] = voxel.z;

      scatter[offset] = voxel.x + (Math.random() - 0.5) * 110;
      scatter[offset + 1] = voxel.y + originYOffset * UNIT + (Math.random() - 0.5) * 110;
      scatter[offset + 2] = voxel.z + (Math.random() - 0.5) * 110;

      current[offset] = scatter[offset];
      current[offset + 1] = scatter[offset + 1];
      current[offset + 2] = scatter[offset + 2];

      dummy.position.set(current[offset], current[offset + 1], current[offset + 2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);

      color.setRGB(voxel.r, voxel.g, voxel.b);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    scene.add(mesh);

    const mouse = new THREE.Vector2(9999, 9999);
    const raycaster = new THREE.Raycaster();

    let prevHoveredInstance = -1;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let rotationY = 0;
    let rotationX = 0.1;
    let velocityY = 0;
    let velocityX = 0;
    let animationFrame = 0;

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const beginDrag = (clientX: number, clientY: number) => {
      isDragging = true;
      previousX = clientX;
      previousY = clientY;
      velocityY = 0;
      velocityX = 0;
      mouse.set(9999, 9999);
      container.style.cursor = "grabbing";
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);

      mouse.x = ((clientX - bounds.left) / width) * 2 - 1;
      mouse.y = -((clientY - bounds.top) / height) * 2 + 1;
    };

    const handlePointerDown = (event: PointerEvent) => {
      beginDrag(event.clientX, event.clientY);
      container.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;

        velocityY = deltaX * 0.007;
        velocityX = deltaY * 0.005;
        rotationY += velocityY;
        rotationX = THREE.MathUtils.clamp(rotationX + velocityX, -1.2, 1.2);
        previousX = event.clientX;
        previousY = event.clientY;
        return;
      }

      updatePointer(event.clientX, event.clientY);
    };

    const endDrag = (pointerId?: number) => {
      isDragging = false;
      container.style.cursor = "grab";
      if (pointerId !== undefined && container.hasPointerCapture(pointerId)) {
        container.releasePointerCapture(pointerId);
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      endDrag(event.pointerId);
    };

    const handlePointerLeave = () => {
      if (!isDragging) {
        mouse.set(9999, 9999);
      }
    };

    container.style.cursor = "grab";
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerup", handlePointerUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const startTime = performance.now();
    let lastTime = startTime;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);

      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / 2.5, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      if (!isDragging) {
        velocityY *= 0.88;
        velocityX *= 0.88;
        rotationY += velocityY;
        rotationX = THREE.MathUtils.clamp(rotationX + velocityX, -1.2, 1.2);
      }

      mesh.rotation.y = rotationY;
      mesh.rotation.x = rotationX;
      mesh.position.y = Math.sin(elapsed * 0.5) * 0.15;

      let hoveredInstance = -1;
      raycaster.setFromCamera(mouse, camera);
      if (progress > 0.8) {
        const [intersection] = raycaster.intersectObject(mesh, false);
        hoveredInstance = intersection?.instanceId ?? -1;
      }

      // Hover color: brighten hovered voxel, reset previous
      if (mesh.instanceColor && prevHoveredInstance !== hoveredInstance) {
        if (prevHoveredInstance !== -1 && prevHoveredInstance !== cursorVoxelIndex) {
          const v = voxels[prevHoveredInstance];
          color.setRGB(v.r, v.g, v.b);
          mesh.setColorAt(prevHoveredInstance, color);
        }
        if (hoveredInstance !== -1 && hoveredInstance !== cursorVoxelIndex) {
          const v = voxels[hoveredInstance];
          color.setRGB(
            Math.min(1, v.r * 3 + 0.4),
            Math.min(1, v.g * 3 + 0.4),
            Math.min(1, v.b * 3 + 0.4),
          );
          mesh.setColorAt(hoveredInstance, color);
        }
        mesh.instanceColor.needsUpdate = true;
        prevHoveredInstance = hoveredInstance;
      }

      const hoveredHomeX = hoveredInstance !== -1 ? home[hoveredInstance * 3] : 0;
      const hoveredHomeY = hoveredInstance !== -1 ? home[hoveredInstance * 3 + 1] : 0;
      const hoveredHomeZ = hoveredInstance !== -1 ? home[hoveredInstance * 3 + 2] : 0;
      const RIPPLE_RADIUS = UNIT * 4.5;

      for (let index = 0; index < count; index += 1) {
        const offset = index * 3;
        const homeX = home[offset];
        const homeY = home[offset + 1];
        const homeZ = home[offset + 2];

        let targetX = homeX;
        let targetY = homeY;
        let targetZ = homeZ;
        let targetScale = 1;

        if (index === hoveredInstance) {
          targetY += HOVER_LIFT;
          targetScale = HOVER_SCALE;
        } else if (hoveredInstance !== -1) {
          const dx = homeX - hoveredHomeX;
          const dy = homeY - hoveredHomeY;
          const dz = homeZ - hoveredHomeZ;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < RIPPLE_RADIUS) {
            const factor = (1 - dist / RIPPLE_RADIUS) ** 2;
            targetY += HOVER_LIFT * factor * 0.45;
            targetScale = 1 + (HOVER_SCALE - 1) * factor * 0.4;
          }
        }

        const finalX = scatter[offset] + (targetX - scatter[offset]) * ease;
        const finalY = scatter[offset + 1] + (targetY - scatter[offset + 1]) * ease;
        const finalZ = scatter[offset + 2] + (targetZ - scatter[offset + 2]) * ease;

        const lerpSpeed = deltaTime * 16;
        current[offset] += (finalX - current[offset]) * lerpSpeed;
        current[offset + 1] += (finalY - current[offset + 1]) * lerpSpeed;
        current[offset + 2] += (finalZ - current[offset + 2]) * lerpSpeed;

        currentScale[index] += (targetScale - currentScale[index]) * lerpSpeed * 1.4;

        dummy.position.set(current[offset], current[offset + 1], current[offset + 2]);
        dummy.scale.setScalar(currentScale[index]);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;

      if (cursorVoxelIndex !== -1 && mesh.instanceColor) {
        const newCursorOn = Math.floor(elapsed * 1.5) % 2 === 0;
        if (newCursorOn !== cursorOn) {
          cursorOn = newCursorOn;
          color.setHex(newCursorOn ? 0xf8f8f2 : 0x1c2128);
          mesh.setColorAt(cursorVoxelIndex, color);
          mesh.instanceColor.needsUpdate = true;
        }
      }

      screenGlow.intensity = 0.4 + Math.sin(elapsed * 1.3) * 0.15;

      renderer.render(scene, camera);
    };

    resize();
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerup", handlePointerUp);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="relative z-10 block h-full w-full" />
    </div>
  );
};

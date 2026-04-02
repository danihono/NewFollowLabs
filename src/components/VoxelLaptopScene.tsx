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
const REPEL_RADIUS = 9;

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
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf0f0f0, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 600);
    camera.position.set(0, 4, 55);
    camera.lookAt(0, 0, 0);

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

    const screenGlow = new THREE.PointLight(0x20242c, 0.75, 48);
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
    const SCREEN_BG = new THREE.Color(0x08090b);
    const BASE_GLOW = new THREE.Color(0x101216);
    const BASE = new THREE.Color(0x171a20);
    const HINGE = new THREE.Color(0x111111);
    const WHITE = new THREE.Color(1, 1, 1);

    const seededNoise = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let x = -12; x <= 12; x += 1) {
      for (let y = 0; y <= 2; y += 1) {
        for (let z = 0; z <= 5; z += 1) {
          let color = BODY_MID;
          if (y === 0 || Math.abs(x) === 12 || z === 5) {
            color = EDGE;
          }
          if (y === 2) {
            color = BODY;
          }
          addVoxel(x, y, z, color);
        }
      }
    }

    for (let x = -12; x <= 12; x += 1) {
      for (let z = 0; z <= 5; z += 1) {
        addVoxel(x, 3, z, BODY);
      }
    }

    for (let x = -11; x <= 11; x += 2) {
      addVoxel(x, 3, 1, BODY_MID);
      addVoxel(x, 3, 3, BODY_MID);
    }
    for (let x = -10; x <= 10; x += 2) {
      addVoxel(x, 3, 2, BODY_MID);
    }
    for (let x = -4; x <= 4; x += 1) {
      addVoxel(x, 3, 4, BODY_MID);
    }
    for (let x = -10; x <= 10; x += 1) {
      for (let z = -1; z <= 0; z += 1) {
        addVoxel(x, 3, z, BASE_GLOW);
      }
    }
    for (let x = -5; x <= 5; x += 1) {
      addVoxel(x, 3, -1, BASE);
    }
    for (let x = -12; x <= 12; x += 1) {
      addVoxel(x, 3, 0, HINGE);
      addVoxel(x, 4, 0, HINGE);
    }

    for (let x = -12; x <= 12; x += 1) {
      for (let y = 4; y <= 20; y += 1) {
        addVoxel(x, y, -1, BEZEL);
      }
    }
    for (let x = -12; x <= 12; x += 1) {
      addVoxel(x, 4, 0, BEZEL);
      addVoxel(x, 20, 0, BEZEL);
    }
    for (let y = 4; y <= 20; y += 1) {
      addVoxel(-12, y, 0, BEZEL);
      addVoxel(12, y, 0, BEZEL);
    }
    for (let x = -11; x <= 11; x += 1) {
      for (let y = 5; y <= 19; y += 1) {
        const noiseA = seededNoise(x * 97 + y * 13);
        const noiseB = seededNoise(x * 31 + y * 71);
        if (noiseA < 0.07) {
          addVoxel(x, y, 0, SCREEN_BG);
        } else if (noiseA < 0.55) {
          addVoxel(x, y, 0, new THREE.Color().setHSL(0.62 + noiseB * 0.02, 0.08, 0.08 + noiseB * 0.08));
        } else {
          addVoxel(x, y, 0, new THREE.Color().setHSL(0.62 + noiseB * 0.02, 0.06, 0.03 + noiseB * 0.04));
        }
      }
    }

    const glyphs: Record<string, Array<[number, number]>> = {
      F: [
        [0, 5], [1, 5], [2, 5], [0, 4], [1, 4], [0, 3], [0, 2], [0, 1], [0, 0],
      ],
      O: [
        [0, 5], [1, 5], [2, 5], [0, 4], [2, 4], [0, 3], [2, 3], [0, 2], [2, 2], [0, 1], [1, 1], [2, 1],
      ],
      L: [
        [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0],
      ],
      W: [
        [0, 5], [2, 5], [0, 4], [1, 4], [2, 4], [0, 3], [2, 3], [0, 2], [2, 2], [0, 1], [2, 1],
      ],
      A: [
        [1, 5], [0, 4], [2, 4], [0, 3], [1, 3], [2, 3], [0, 2], [2, 2], [0, 1], [2, 1],
      ],
      B: [
        [0, 5], [1, 5], [0, 4], [2, 4], [0, 3], [1, 3], [0, 2], [2, 2], [0, 1], [1, 1],
      ],
      S: [
        [1, 5], [2, 5], [0, 4], [1, 3], [2, 2], [0, 1], [1, 0], [2, 0],
      ],
    };

    const drawWord = (word: string, startX: number, startY: number) => {
      let cursor = startX;
      for (const letter of word) {
        for (const [gx, gy] of glyphs[letter] ?? []) {
          const worldX = cursor + gx;
          const worldY = startY + gy;
          if (worldX >= -11 && worldX <= 11 && worldY >= 5 && worldY <= 19) {
            addVoxel(worldX, worldY, 0, WHITE);
          }
        }
        cursor += 4;
      }
    };

    drawWord("FOLLOW", -11, 11);
    drawWord("LABS", -7, 5);

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
    const inverseWorld = new THREE.Matrix4();
    const localRay = new THREE.Ray();
    const closestPoint = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const swirl = new THREE.Vector3();
    const point = new THREE.Vector3();

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

      raycaster.setFromCamera(mouse, camera);
      inverseWorld.copy(mesh.matrixWorld).invert();
      localRay.origin.copy(raycaster.ray.origin).applyMatrix4(inverseWorld);
      localRay.direction.copy(raycaster.ray.direction).transformDirection(inverseWorld);

      for (let index = 0; index < count; index += 1) {
        const offset = index * 3;
        const homeX = home[offset];
        const homeY = home[offset + 1];
        const homeZ = home[offset + 2];

        let targetX = homeX;
        let targetY = homeY;
        let targetZ = homeZ;

        if (progress > 0.8) {
          point.set(homeX, homeY, homeZ);
          localRay.closestPointToPoint(point, closestPoint);

          const deltaX = homeX - closestPoint.x;
          const deltaY = homeY - closestPoint.y;
          const deltaZ = homeZ - closestPoint.z;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

          if (distance < REPEL_RADIUS) {
            const length = distance || 0.001;
            direction.set(deltaX / length, deltaY / length, deltaZ / length);
            swirl.crossVectors(direction, localRay.direction).normalize();

            const force = Math.pow((REPEL_RADIUS - distance) / REPEL_RADIUS, 1.8) * 10;
            targetX += direction.x * force + swirl.x * force * 0.3;
            targetY += direction.y * force + swirl.y * force * 0.3;
            targetZ += direction.z * force + swirl.z * force * 0.3;
          }
        }

        const finalX = scatter[offset] + (targetX - scatter[offset]) * ease;
        const finalY = scatter[offset + 1] + (targetY - scatter[offset + 1]) * ease;
        const finalZ = scatter[offset + 2] + (targetZ - scatter[offset + 2]) * ease;

        current[offset] += (finalX - current[offset]) * deltaTime * 13;
        current[offset + 1] += (finalY - current[offset + 1]) * deltaTime * 13;
        current[offset + 2] += (finalZ - current[offset + 2]) * deltaTime * 13;

        dummy.position.set(current[offset], current[offset + 1], current[offset + 2]);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      screenGlow.intensity = 2 + Math.sin(elapsed * 1.3) * 0.4;

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
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#f0f0f0]">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

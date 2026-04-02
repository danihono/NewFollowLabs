import { useEffect, useRef } from "react";
import * as THREE from "three";

const HERO_BACKGROUND = 0x05070b;
const LAPTOP_COLOR = 0x171a22;
const SCREEN_COLOR = 0x030406;
const GOLD_COLOR = 0xe8af48;
const SCREEN_WIDTH = 4.3;
const SCREEN_HEIGHT = 3;
const DEFAULT_MEDIA_ASPECT = 1084 / 195;
const LOGO_REVEAL_URL = "/logo-reveal-cropped.png";

export const ParticleNotebookScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const mouse = new THREE.Vector2(3, 3);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(HERO_BACKGROUND);

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 8);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(GOLD_COLOR, 4.2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const frontLight = new THREE.DirectionalLight(GOLD_COLOR, 1.15);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    const notebookGroup = new THREE.Group();
    scene.add(notebookGroup);

    const baseGeometry = new THREE.BoxGeometry(4.5, 0.15, 3.2);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: LAPTOP_COLOR,
      metalness: 1,
      roughness: 0.5,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.075;
    notebookGroup.add(base);

    const trackpadGeometry = new THREE.PlaneGeometry(1.2, 0.8);
    const trackpadMaterial = new THREE.MeshStandardMaterial({
      color: 0x11151d,
      roughness: 1,
    });
    const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.01, 0.8);
    notebookGroup.add(trackpad);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0, -1.6);
    lidGroup.rotation.x = -0.1;
    notebookGroup.add(lidGroup);

    const lidGeometry = new THREE.BoxGeometry(4.5, 3.2, 0.08);
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: LAPTOP_COLOR,
      metalness: 1,
      roughness: 0.4,
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 1.6, 0.04);
    lidGroup.add(lid);

    const screenGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: SCREEN_COLOR });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.6, 0.09);
    lidGroup.add(screen);

    let currentMediaAspect = DEFAULT_MEDIA_ASPECT;
    let logoImageData: Uint8ClampedArray | null = null;
    let logoImageWidth = 0;
    let logoImageHeight = 0;

    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(LOGO_REVEAL_URL, (loadedTexture) => {
      const image = loadedTexture.image as { width?: number; height?: number };
      if (image?.width && image?.height) {
        currentMediaAspect = image.width / image.height;
        revealMaterial.uniforms.uMediaAspect.value = currentMediaAspect;
      }

      if (loadedTexture.image instanceof HTMLImageElement) {
        const analysisCanvas = document.createElement("canvas");
        analysisCanvas.width = loadedTexture.image.width;
        analysisCanvas.height = loadedTexture.image.height;
        const analysisContext = analysisCanvas.getContext("2d");

        if (analysisContext) {
          analysisContext.drawImage(loadedTexture.image, 0, 0);
          const imageData = analysisContext.getImageData(
            0,
            0,
            analysisCanvas.width,
            analysisCanvas.height
          );
          logoImageData = imageData.data;
          logoImageWidth = analysisCanvas.width;
          logoImageHeight = analysisCanvas.height;
        }
      }
    });
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;

    const revealMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: logoTexture },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uReveal: { value: 0 },
        uMediaAspect: { value: DEFAULT_MEDIA_ASPECT },
        uPlaneAspect: { value: SCREEN_WIDTH / SCREEN_HEIGHT },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uPointer;
        uniform float uReveal;
        uniform float uMediaAspect;
        uniform float uPlaneAspect;
        varying vec2 vUv;

        vec2 containUv(vec2 uv, float mediaAspect, float planeAspect) {
          vec2 mappedUv = uv;

          if (mediaAspect > planeAspect) {
            float scale = mediaAspect / planeAspect;
            mappedUv.y = (uv.y - 0.5) * scale + 0.5;
          } else {
            float scale = planeAspect / mediaAspect;
            mappedUv.x = (uv.x - 0.5) * scale + 0.5;
          }

          return mappedUv;
        }

        void main() {
          vec2 mappedUv = containUv(vUv, uMediaAspect, uPlaneAspect);
          if (mappedUv.x < 0.0 || mappedUv.x > 1.0 || mappedUv.y < 0.0 || mappedUv.y > 1.0) {
            discard;
          }

          vec4 media = texture2D(uTexture, mappedUv);

          float dist = distance(vUv, uPointer);
          float core = smoothstep(0.11, 0.012, dist) * uReveal;
          float halo = smoothstep(0.18, 0.035, dist) * uReveal * 0.24;
          float alpha = clamp(core + halo, 0.0, 1.0) * media.a;
          vec3 color = media.rgb + media.rgb * halo * 0.2;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const revealPlane = new THREE.Mesh(screenGeometry, revealMaterial);
    revealPlane.position.set(0, 1.6, 0.091);
    lidGroup.add(revealPlane);

    const textCanvas = document.createElement("canvas");
    const textContext = textCanvas.getContext("2d");
    textCanvas.width = 512;
    textCanvas.height = 256;

    const sampleStep = isMobile ? 3 : 2;
    const particlePoints: THREE.Vector2[] = [];

    if (textContext) {
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
      textContext.fillStyle = "#ffffff";
      textContext.font = `700 ${isMobile ? 62 : 72}px sans-serif`;
      textContext.textAlign = "center";
      textContext.textBaseline = "middle";
      textContext.fillText("Follow Labs", 256, 128);

      const textData = textContext.getImageData(0, 0, 512, 256).data;

      for (let y = 0; y < 256; y += sampleStep) {
        for (let x = 0; x < 512; x += sampleStep) {
          const alpha = textData[(y * 512 + x) * 4 + 3];
          if (alpha > 128) {
            particlePoints.push(
              new THREE.Vector2((x / 512 - 0.5) * 4, (1 - y / 256 - 0.5) * 2.8)
            );
          }
        }
      }
    }

    const particleCount = Math.max(
      particlePoints.length + (isMobile ? 1600 : 4200),
      isMobile ? 9000 : 15000
    );
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const gold = new THREE.Color(GOLD_COLOR);

    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3;
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0.1;

      if (index < particlePoints.length) {
        targetX = particlePoints[index].x;
        targetY = particlePoints[index].y + 1.6;
        colors[offset] = 1;
        colors[offset + 1] = 1;
        colors[offset + 2] = 1;
      } else {
        targetX = (Math.random() - 0.5) * 4.25;
        targetY = (Math.random() - 0.5) * 2.9 + 1.6;
        colors[offset] = gold.r;
        colors[offset + 1] = gold.g;
        colors[offset + 2] = gold.b;
      }

      positions[offset] = targetX + (Math.random() - 0.5) * 10;
      positions[offset + 1] = targetY + (Math.random() - 0.5) * 10;
      positions[offset + 2] = targetZ + (Math.random() - 0.5) * 10;

      originalPositions[offset] = targetX;
      originalPositions[offset + 1] = targetY;
      originalPositions[offset + 2] = targetZ;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.035,
      transparent: true,
      opacity: 0.96,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particleSystem.frustumCulled = false;
    lidGroup.add(particleSystem);

    const screenLight = new THREE.PointLight(GOLD_COLOR, 4, 5);
    screenLight.position.set(0, 1.6, 0.5);
    lidGroup.add(screenLight);

    const raycaster = new THREE.Raycaster();
    const interactionPlane = new THREE.Plane();
    const intersectPoint = new THREE.Vector3();
    const offscreenPoint = new THREE.Vector3(999, 999, 999);
    const screenWorldPosition = new THREE.Vector3();
    const screenNormal = new THREE.Vector3();
    const worldQuaternion = new THREE.Quaternion();
    const positionAttribute = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
    const positionArray = positionAttribute.array as Float32Array;
    const pointerUvTarget = new THREE.Vector2(0.5, 0.5);
    let revealTarget = 0;

    const mapUvToContainedMedia = (uv: THREE.Vector2) => {
      const mappedUv = uv.clone();
      const planeAspect = SCREEN_WIDTH / SCREEN_HEIGHT;

      if (currentMediaAspect > planeAspect) {
        const scale = currentMediaAspect / planeAspect;
        mappedUv.y = (uv.y - 0.5) * scale + 0.5;
      } else {
        const scale = planeAspect / currentMediaAspect;
        mappedUv.x = (uv.x - 0.5) * scale + 0.5;
      }

      return mappedUv;
    };

    const sampleLogoAlpha = (uv: THREE.Vector2) => {
      if (!logoImageData || !logoImageWidth || !logoImageHeight) {
        return 0;
      }

      const mappedUv = mapUvToContainedMedia(uv);
      if (mappedUv.x < 0 || mappedUv.x > 1 || mappedUv.y < 0 || mappedUv.y > 1) {
        return 0;
      }

      const pixelX = Math.min(
        logoImageWidth - 1,
        Math.max(0, Math.round(mappedUv.x * (logoImageWidth - 1)))
      );
      const pixelY = Math.min(
        logoImageHeight - 1,
        Math.max(0, Math.round((1 - mappedUv.y) * (logoImageHeight - 1)))
      );

      return logoImageData[(pixelY * logoImageWidth + pixelX) * 4 + 3] / 255;
    };

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    const handlePointerLeave = () => {
      mouse.set(3, 3);
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let animationFrame = 0;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      notebookGroup.rotation.y = Math.sin(elapsed * 0.32) * 0.1;
      lidGroup.rotation.x = THREE.MathUtils.lerp(lidGroup.rotation.x, 0.2, 0.08);

      scene.updateMatrixWorld(true);

      let mouseLocal = offscreenPoint;
      if (Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1) {
        raycaster.setFromCamera(mouse, camera);
        screen.getWorldPosition(screenWorldPosition);
        screenNormal.set(0, 0, 1).applyQuaternion(lidGroup.getWorldQuaternion(worldQuaternion));
        interactionPlane.setFromNormalAndCoplanarPoint(screenNormal, screenWorldPosition);

        if (raycaster.ray.intersectPlane(interactionPlane, intersectPoint)) {
          mouseLocal = lidGroup.worldToLocal(intersectPoint.clone());
        }
      }

      const screenOffsetX = mouseLocal.x - screen.position.x;
      const screenOffsetY = mouseLocal.y - screen.position.y;
      const isInsideScreen =
        Math.abs(screenOffsetX) <= SCREEN_WIDTH / 2 && Math.abs(screenOffsetY) <= SCREEN_HEIGHT / 2;

      let logoStrength = 0;

      if (isInsideScreen) {
        pointerUvTarget.set(
          screenOffsetX / SCREEN_WIDTH + 0.5,
          screenOffsetY / SCREEN_HEIGHT + 0.5
        );
        logoStrength = sampleLogoAlpha(pointerUvTarget);
        revealTarget = logoStrength > 0.02 ? Math.min(1, logoStrength * 1.35) : 0;
      } else {
        revealTarget = 0;
      }

      revealMaterial.uniforms.uPointer.value.lerp(pointerUvTarget, 0.14);
      revealMaterial.uniforms.uReveal.value = THREE.MathUtils.lerp(
        revealMaterial.uniforms.uReveal.value,
        revealTarget,
        0.12
      );

      for (let index = 0; index < particleCount; index += 1) {
        const offset = index * 3;
        const currentX = positionArray[offset];
        const currentY = positionArray[offset + 1];
        const currentZ = positionArray[offset + 2];
        const originalX = originalPositions[offset];
        const originalY = originalPositions[offset + 1];
        const originalZ = originalPositions[offset + 2];

        let velocityX = (originalX - currentX) * 0.15;
        let velocityY = (originalY - currentY) * 0.15;
        let velocityZ = (originalZ - currentZ) * 0.15;

        const deltaX = currentX - mouseLocal.x;
        const deltaY = currentY - mouseLocal.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const radius = 0.55;

        if (distanceSquared < radius * radius && distanceSquared > 0.0001 && logoStrength > 0.02) {
          const distance = Math.sqrt(distanceSquared);
          const force = (radius - distance) / radius;
          const interactionStrength = Math.min(1, logoStrength * 1.4);

          velocityX += (deltaX / distance) * force * 0.95 * interactionStrength;
          velocityY += (deltaY / distance) * force * 0.95 * interactionStrength;
          velocityZ += force * 0.28 * interactionStrength;
        }

        velocityX += Math.sin(elapsed * 2 + index) * 0.002;
        velocityY += Math.cos(elapsed * 2 + index) * 0.002;

        positionArray[offset] += velocityX;
        positionArray[offset + 1] += velocityY;
        positionArray[offset + 2] += velocityZ;
      }

      positionAttribute.needsUpdate = true;
      particleMaterial.opacity = 0.9 + Math.sin(elapsed * 2) * 0.08;

      renderer.render(scene, camera);
    };

    resize();
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();

      particleGeometry.dispose();
      particleMaterial.dispose();
      screenGeometry.dispose();
      screenMaterial.dispose();
      revealMaterial.dispose();
      logoTexture.dispose();
      lidGeometry.dispose();
      lidMaterial.dispose();
      trackpadGeometry.dispose();
      trackpadMaterial.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(232,175,72,0.12), transparent 20%), radial-gradient(circle at 80% 22%, rgba(141,180,255,0.08), transparent 18%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
    </div>
  );
};

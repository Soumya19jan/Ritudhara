import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Sparkles } from 'lucide-react';

export default function CycleScene3D({
  cycleDay = 14,
  cycleLength = 28,
  periodDuration = 5,
  phase = 'OVULATION',
  phaseConfig,
  ovulationCycleDay = 14,
  fertileStartDay = 9,
  fertileEndDay = 15
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const coreMeshRef = useRef(null);
  const ringGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const currentDayMarkerRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [isRotating, setIsRotating] = useState(true);
  const [activeView, setActiveView] = useState('perspective'); // 'perspective' | 'top'

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0.003, y: 0.005 });
  const targetRotationRef = useRef({ x: 0.35, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(phaseConfig?.orbColor || 0xff6699, 3.5, 20);
    mainLight.position.set(2, 4, 3);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xa566ff, 2.0, 15);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // ROOT 3D GROUP
    const cycleGroup = new THREE.Group();
    ringGroupRef.current = cycleGroup;
    scene.add(cycleGroup);

    // 1. CENTRAL BREATHING CELESTIAL ORB
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: phaseConfig?.orbColor || 0xff4d6d,
      emissive: phaseConfig?.orbColor || 0xff4d6d,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMeshRef.current = coreMesh;
    cycleGroup.add(coreMesh);

    // INNER GLOW AURA
    const innerGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 2. ORBITAL CYCLE RING (TORUS)
    const ringRadius = 2.1;
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: phaseConfig?.orbColor || 0xff758f,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    cycleGroup.add(ringMesh);

    // 3. CYCLE DAY BEADS (Orbital Markers)
    const beadCount = cycleLength || 28;
    for (let i = 1; i <= beadCount; i++) {
      const angle = ((i - 1) / beadCount) * Math.PI * 2 - Math.PI / 2;
      const bx = Math.cos(angle) * ringRadius;
      const bz = Math.sin(angle) * ringRadius;

      let beadColor = 0xc9d1d9;
      let beadSize = 0.055;
      let emissiveIntensity = 0.2;

      // Color coding according to biology
      if (i <= periodDuration) {
        beadColor = 0xff3b5c; // Menstrual ruby
        beadSize = 0.07;
        emissiveIntensity = 0.6;
      } else if (i === ovulationCycleDay) {
        beadColor = 0xffb703; // Golden Ovulation peak
        beadSize = 0.09;
        emissiveIntensity = 0.9;
      } else if (i >= fertileStartDay && i <= fertileEndDay) {
        beadColor = 0xfb8500; // Fertile window
        beadSize = 0.065;
        emissiveIntensity = 0.5;
      } else if (i > fertileEndDay) {
        beadColor = 0x9d4edd; // Luteal purple
        beadSize = 0.055;
        emissiveIntensity = 0.3;
      } else {
        beadColor = 0xff758f; // Follicular pink
        beadSize = 0.055;
        emissiveIntensity = 0.4;
      }

      const beadGeo = new THREE.SphereGeometry(beadSize, 16, 16);
      const beadMat = new THREE.MeshStandardMaterial({
        color: beadColor,
        emissive: beadColor,
        emissiveIntensity: emissiveIntensity,
        roughness: 0.2,
        metalness: 0.5
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(bx, 0, bz);
      cycleGroup.add(bead);

      // CURRENT ACTIVE DAY MARKER (Larger Glowing Diamond/Orb with Pulsing Aura)
      if (i === cycleDay) {
        const markerGroup = new THREE.Group();
        markerGroup.position.set(bx, 0, bz);

        // Core marker
        const markerGeo = new THREE.OctahedronGeometry(0.16, 0);
        const markerMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          emissive: 0xffeef4,
          emissiveIntensity: 1.2,
          roughness: 0.1,
          metalness: 0.1,
          clearcoat: 1.0
        });
        const markerMesh = new THREE.Mesh(markerGeo, markerMat);
        markerGroup.add(markerMesh);

        // Halo ring around current day
        const haloGeo = new THREE.RingGeometry(0.2, 0.26, 32);
        const haloMat = new THREE.MeshBasicMaterial({
          color: phaseConfig?.orbColor || 0xff3b5c,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.rotation.x = Math.PI / 2;
        markerGroup.add(haloMesh);

        currentDayMarkerRef.current = markerGroup;
        cycleGroup.add(markerGroup);
      }
    }

    // 4. FLOATING CELESTIAL STARDUST PARTICLES
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor = new THREE.Color(phaseConfig?.orbColor || 0xff758f);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      particleColors[i * 3] = pColor.r + (Math.random() - 0.5) * 0.2;
      particleColors[i * 3 + 1] = pColor.g + (Math.random() - 0.5) * 0.2;
      particleColors[i * 3 + 2] = pColor.b + (Math.random() - 0.5) * 0.2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    cycleGroup.add(particles);

    // Initial orientation
    cycleGroup.rotation.x = 0.42;

    // 5. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle organic breathing of central orb
      if (coreMeshRef.current) {
        const pulse = 1.0 + Math.sin(elapsed * 2.2) * 0.045;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
        coreMeshRef.current.rotation.y = elapsed * 0.35;
        coreMeshRef.current.rotation.x = Math.sin(elapsed * 0.5) * 0.15;
      }

      // Marker spin & sparkle
      if (currentDayMarkerRef.current) {
        currentDayMarkerRef.current.rotation.y = elapsed * 1.8;
        const markerPulse = 1.0 + Math.sin(elapsed * 4.0) * 0.12;
        currentDayMarkerRef.current.scale.set(markerPulse, markerPulse, markerPulse);
      }

      // Stardust gentle drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.08;
      }

      // Rotation inertia handling
      if (ringGroupRef.current) {
        if (!isDraggingRef.current && isRotating) {
          ringGroupRef.current.rotation.y += 0.005;
        } else if (!isDraggingRef.current) {
          // Smooth decay of manual drag
          ringGroupRef.current.rotation.y += rotVelocityRef.current.y;
          ringGroupRef.current.rotation.x += rotVelocityRef.current.x;
          rotVelocityRef.current.y *= 0.94;
          rotVelocityRef.current.x *= 0.94;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. TOUCH & MOUSE INTERACTION HANDLERS
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || !ringGroupRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - prevMouseRef.current.x) * 0.008;
      const deltaY = (clientY - prevMouseRef.current.y) * 0.008;

      ringGroupRef.current.rotation.y += deltaX;
      ringGroupRef.current.rotation.x = Math.max(0.1, Math.min(1.4, ringGroupRef.current.rotation.x + deltaY));

      rotVelocityRef.current = { x: deltaY * 0.3, y: deltaX * 0.3 };
      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderer.dispose();
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
    };
  }, [cycleDay, cycleLength, periodDuration, phase, ovulationCycleDay, fertileStartDay, fertileEndDay]);

  // Update Core & Particle Colors dynamically when phase changes
  useEffect(() => {
    if (!coreMeshRef.current || !phaseConfig) return;
    const color = new THREE.Color(phaseConfig.orbColor);
    coreMeshRef.current.material.color = color;
    coreMeshRef.current.material.emissive = color;
  }, [phaseConfig]);

  const resetCamera = () => {
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = 0.42;
      ringGroupRef.current.rotation.y = 0;
      rotVelocityRef.current = { x: 0, y: 0.005 };
    }
  };

  const toggleTopView = () => {
    if (ringGroupRef.current) {
      if (activeView === 'perspective') {
        ringGroupRef.current.rotation.x = 1.45;
        ringGroupRef.current.rotation.y = 0;
        setActiveView('top');
      } else {
        ringGroupRef.current.rotation.x = 0.42;
        setActiveView('perspective');
      }
    }
  };

  return (
    <div className="relative w-full h-[330px] flex items-center justify-center overflow-hidden rounded-3xl select-none">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating Center Phase Text Overlay (Seamless - No Box) */}
      <div className="absolute pointer-events-none text-center flex flex-col items-center justify-center transform -translate-y-1">
        <span
          className="text-xs font-black tracking-widest uppercase block"
          style={{
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.9), 0 0 2px #000'
          }}
        >
          DAY {cycleDay} OF {cycleLength}
        </span>
        <span
          className="text-3xl font-black tracking-tight block leading-tight my-0.5"
          style={{
            color: '#ffffff',
            textShadow: '0 3px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.95), 0 0 3px #000'
          }}
        >
          {phaseConfig?.name?.split(' ')[0]}
        </span>
        <span
          className="text-xs font-bold flex items-center justify-center gap-1.5"
          style={{
            color: '#ffc2d1',
            textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.95), 0 0 2px #000'
          }}
        >
          <span>{phaseConfig?.icon}</span>
          <span>{phaseConfig?.subtitle}</span>
        </span>
      </div>

      {/* Interactive Controls Pill */}
      <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10 text-xs text-white/70">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-1.5 py-0.5 rounded transition ${isRotating ? 'text-pink-300 font-medium' : 'text-white/40'}`}
          title="Auto Rotate"
        >
          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
          {isRotating ? 'Auto' : 'Hold'}
        </button>

        <span className="w-px h-3 bg-white/20"></span>

        <button
          onClick={toggleTopView}
          className="px-1.5 py-0.5 rounded hover:text-white transition flex items-center gap-1"
          title="Toggle 3D / Top View"
        >
          <Eye className="w-3.5 h-3.5" />
          {activeView === 'top' ? 'Tilt' : 'Flat'}
        </button>

        <span className="w-px h-3 bg-white/20"></span>

        <button
          onClick={resetCamera}
          className="p-1 hover:text-white transition"
          title="Reset 3D Angle"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Touch prompt hint */}
      <div className="absolute top-2 left-3 pointer-events-none flex items-center gap-1 text-[10px] font-medium text-white/40">
        <span>✨ Drag to tilt 3D</span>
      </div>
    </div>
  );
}

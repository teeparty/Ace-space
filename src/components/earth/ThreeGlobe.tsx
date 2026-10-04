import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EarthLocation } from '../../types/game';

interface ThreeGlobeProps {
  locations: EarthLocation[];
  selectedLocation: EarthLocation;
  onSelectLocation: (loc: EarthLocation) => void;
  className?: string;
}

// Convert Lat/Lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural pixel Earth texture generator
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean blue
  ctx.fillStyle = '#0a1d37';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Retro longitude & latitude grid
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw stylized continent shapes
  ctx.fillStyle = '#10b981'; // vibrant retro emerald continents

  // Americas
  ctx.beginPath();
  // North America
  ctx.roundRect(140, 60, 220, 160, 20);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.roundRect(260, 240, 140, 200, 25);
  ctx.fill();

  // Europe & Africa
  ctx.beginPath();
  ctx.roundRect(470, 70, 120, 110, 15);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(460, 190, 150, 190, 20);
  ctx.fill();

  // Asia
  ctx.beginPath();
  ctx.roundRect(590, 60, 280, 200, 30);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.roundRect(780, 310, 120, 90, 20);
  ctx.fill();

  // Japan / islands
  ctx.beginPath();
  ctx.arc(880, 140, 18, 0, Math.PI * 2);
  ctx.fill();

  // Antarctica
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(0, 470, canvas.width, 42);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const ThreeGlobe: React.FC<ThreeGlobeProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markerMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starfield particles in the background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 400 - 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Globe Sphere
    const globeRadius = 70;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshPhongMaterial({
      map: createProceduralEarthTexture(),
      specular: new THREE.Color(0x22d3ee),
      shininess: 25,
      bumpScale: 1,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Atmospheric Glow Ring
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.08, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x67e8f9, 1.2);
    dirLight.position.set(150, 100, 150);
    scene.add(dirLight);

    // Add Location Marker Pins
    const markerMeshes = new Map<string, THREE.Mesh>();
    markerMeshesRef.current = markerMeshes;

    locations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, globeRadius + 2);
      const pinGeo = new THREE.SphereGeometry(2.5, 12, 12);
      const isCurrent = loc.id === selectedLocation.id;
      const pinMat = new THREE.MeshBasicMaterial({
        color: isCurrent ? 0xf43f5e : 0xfbbf24,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { location: loc };

      // Pin stem
      const stemGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.copy(pos.clone().multiplyScalar(0.98));
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      globeGroup.add(pinMesh);
      globeGroup.add(stemMesh);
      markerMeshes.set(loc.id, pinMesh);
    });

    // Mouse drag interaction
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

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      // Clamp X rotation to prevent flipping upside down
      globeGroup.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, globeGroup.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Raycaster to select location pin by clicking
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const meshes = Array.from(markerMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const loc = clickedMesh.userData.location as EarthLocation;
        if (loc) {
          onSelectLocation(loc);
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly rotate globe toward target when not dragging
      if (!isDragging) {
        // Continuous slow idle spin
        globeGroup.rotation.y += 0.001;

        // Smooth interpolate to target rotation if specified
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.04;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.04;
      }

      // Pulse active pin
      markerMeshes.forEach((mesh, id) => {
        if (id === selectedLocation.id) {
          const s = 1 + Math.sin(elapsedTime * 6) * 0.35;
          mesh.scale.set(s, s, s);
          (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xf43f5e);
        } else {
          mesh.scale.set(1, 1, 1);
          (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xfbbf24);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [locations]);

  // When selectedLocation changes, orient the globe toward it
  useEffect(() => {
    if (!globeGroupRef.current) return;
    // Calculate rotation to face the selected lat/lng
    const targetY = -((selectedLocation.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = (selectedLocation.lat * (Math.PI / 180)) * 0.5;

    targetRotationRef.current = {
      x: Math.max(-0.6, Math.min(0.6, targetX)),
      y: targetY,
    };
  }, [selectedLocation]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Control hints */}
      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 border border-cyan-800 pointer-events-none">
        DRAG TO ROTATE GLOBE · CLICK PIN TO TARGET
      </div>
    </div>
  );
};

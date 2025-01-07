import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const AppShowcaseScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1f2c);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 3;

    // Create central platform
    const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const platformMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.3
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.receiveShadow = true;
    scene.add(platform);

    // Create floating features
    const features = [
      { name: 'Code', color: 0x8b5cf6, position: { x: 1.5, y: 1, z: 0 } },
      { name: 'Research', color: 0x0ea5e9, position: { x: -1.5, y: 1, z: 0 } },
      { name: 'Analytics', color: 0xec4899, position: { x: 0, y: 1, z: 1.5 } },
      { name: 'Docs', color: 0x22c55e, position: { x: 0, y: 1, z: -1.5 } }
    ];

    features.forEach(feature => {
      // Create feature cube
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshPhysicalMaterial({
        color: feature.color,
        metalness: 0.5,
        roughness: 0.3,
        transmission: 0.2,
        thickness: 0.5
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(feature.position.x, feature.position.y, feature.position.z);
      cube.castShadow = true;
      scene.add(cube);

      // Add glowing edges
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.8
      });
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(cube.position);
      scene.add(line);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Add point lights for dramatic effect
    const colors = [0x8b5cf6, 0x0ea5e9, 0xec4899, 0x22c55e];
    colors.forEach((color, index) => {
      const light = new THREE.PointLight(color, 1, 10);
      const angle = (index / colors.length) * Math.PI * 2;
      light.position.set(
        Math.cos(angle) * 3,
        2,
        Math.sin(angle) * 3
      );
      scene.add(light);
    });

    // Position camera
    camera.position.set(4, 3, 4);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate features
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child !== platform) {
          child.rotation.y += 0.01;
          child.position.y += Math.sin(Date.now() * 0.001) * 0.001;
        }
        if (child instanceof THREE.LineSegments) {
          child.rotation.y += 0.01;
          child.position.y += Math.sin(Date.now() * 0.001) * 0.001;
        }
      });

      // Update controls
      controls.update();
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center py-12"
    />
  );
};

export default AppShowcaseScene;
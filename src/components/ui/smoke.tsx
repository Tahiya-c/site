"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

function SmokeParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const clockRef = useRef(new THREE.Clock());

  // Create realistic smoke particle positions (500 particles)
  const particleCount = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Denser smoke in the center, spreading out
      const radius = Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius; // x
      pos[i * 3 + 1] = Math.cos(phi) * radius * 0.5; // y (more vertical spread)
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius; // z
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const time = clockRef.current.getElapsedTime();
      
      // Realistic smoke physics
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Smoke rises
        positions[i + 1] += 0.008;
        
        // Swirling wind effect
        const swirl = 0.02;
        positions[i] += Math.sin(time * 0.3 + positions[i + 1] * 0.2) * swirl;
        positions[i + 2] += Math.cos(time * 0.4 + positions[i + 1] * 0.2) * swirl;
        
        // Turbulence (random jitter)
        positions[i] += (Math.random() - 0.5) * 0.004;
        positions[i + 1] += (Math.random() - 0.5) * 0.004;
        positions[i + 2] += (Math.random() - 0.5) * 0.004;
        
        // Reset particles that drift too high (smoke dissipates)
        if (positions[i + 1] > 10) {
          // Reset to bottom with random position
          const radius = Math.random() * 4;
          const theta = Math.random() * Math.PI * 2;
          positions[i] = Math.cos(theta) * radius;
          positions[i + 1] = -5 + Math.random() * 2;
          positions[i + 2] = Math.sin(theta) * radius;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Very slow overall rotation
      pointsRef.current.rotation.y = time * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <Points ref={pointsRef} geometry={geometry}>
      <PointMaterial
        size={0.08} // Very small particles for smoke effect
        color="#f59e0b" // Soft amber/orange
        transparent
        opacity={0.3} // More transparent
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors={false}
      />
    </Points>
  );
}

export default function Smoke() {
  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0,
      pointerEvents: 'none'
    }}>
      <Canvas 
        camera={{ 
          position: [0, 0, 15], 
          fov: 60,
          near: 0.1,
          far: 100 
        }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <SmokeParticles />
      </Canvas>
    </div>
  );
}
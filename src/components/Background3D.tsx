import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  
  const particleCount = 800;

  // Generate random positions
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorViolet = new THREE.Color('#7C3AED');
    const colorCyan = new THREE.Color('#06B6D4');
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      const mixedColor = colorViolet.clone().lerp(colorCyan, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [particleCount]);

  // Mouse parallax effect and rotation
  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
      
      // Parallax
      const targetX = mouse.x * 2;
      const targetY = mouse.y * 2;
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02;
      pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial transparent vertexColors size={0.06} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-void">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ParticleNetwork />
        </Canvas>
      </div>
      
      {/* CSS Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-electric-violet/20 blur-[120px] animate-gradient-shift mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-cyan/10 blur-[140px] animate-gradient-shift mix-blend-screen" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-neon-indigo/15 blur-[100px] animate-float mix-blend-screen" />
    </div>
  );
}

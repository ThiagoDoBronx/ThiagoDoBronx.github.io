import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Cheap blurred floor shadow: a radial-gradient texture on a flat plane.
 * Replaces drei's ContactShadows, which re-rendered the scene and blurred it
 * on every frame.
 */
export default function SoftShadow({ color = '#1a1a1a', opacity = 0.3, width = 4.6, depth = 1.6, y = -1.8 }) {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[width, depth, 1]} renderOrder={-1}>
      <planeGeometry />
      <meshBasicMaterial color={color} map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

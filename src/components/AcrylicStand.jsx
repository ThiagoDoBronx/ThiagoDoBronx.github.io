import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';

// Real-world proportions of an A5-ish L-shaped acrylic table stand.
const PANEL = { w: 2.1, h: 3.28, t: 0.06 };
const BASE_DEPTH = 1.05;
const PANEL_Y = 0.12;
const MARGIN = 0.035; // clear acrylic border around the print

/**
 * L-shaped acrylic table stand. The artwork is printed on the front face,
 * with a white backing visible through the acrylic from behind.
 */
export default function AcrylicStand({ texture: src }) {
  const gl = useThree((s) => s.gl);
  const texture = useTexture(`${import.meta.env.BASE_URL}${src}`);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
  }, [texture, gl]);

  const print = useMemo(() => {
    const { width, height } = texture.image;
    const w = PANEL.w - MARGIN * 2;
    // Keep the artwork's aspect ratio, capped by the panel height.
    const h = Math.min(PANEL.h - MARGIN * 2, (w * height) / width);
    return { w, h };
  }, [texture]);

  const bottom = PANEL_Y - PANEL.h / 2;
  const front = PANEL.t / 2;

  return (
    <group>
      {/* Front panel */}
      <RoundedBox args={[PANEL.w, PANEL.h, PANEL.t]} radius={0.025} smoothness={4} position={[0, PANEL_Y, 0]} castShadow>
        <Acrylic />
      </RoundedBox>

      {/* Printed artwork (front): unlit so the print keeps its true colours. */}
      <mesh position={[0, PANEL_Y, front + 0.0015]}>
        <planeGeometry args={[print.w, print.h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* White backing (seen through the acrylic from behind) */}
      <mesh position={[0, PANEL_Y, front - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[print.w, print.h]} />
        <meshStandardMaterial color="#ffffff" emissive="#e6e6e3" emissiveIntensity={0.55} roughness={0.8} />
      </mesh>

      {/* Bend + foot extending backwards */}
      <mesh position={[0, bottom + 0.09, -0.09]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, PANEL.w, 24, 1, true, Math.PI, Math.PI / 2]} />
        <Acrylic side={THREE.DoubleSide} />
      </mesh>
      <RoundedBox
        args={[PANEL.w, PANEL.t, BASE_DEPTH]}
        radius={0.025}
        smoothness={4}
        position={[0, bottom - 0.03 + PANEL.t / 2, -0.09 - BASE_DEPTH / 2 + 0.03]}
        castShadow
      >
        <Acrylic />
      </RoundedBox>
    </group>
  );
}

function Acrylic(props) {
  return (
    <meshPhysicalMaterial
      color="#ffffff"
      emissive="#e9f0ef"
      emissiveIntensity={0.35}
      transparent
      opacity={0.45}
      roughness={0.04}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.02}
      ior={1.49}
      envMapIntensity={1.4}
      depthWrite={false}
      {...props}
    />
  );
}

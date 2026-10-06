import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

/** Loads a printed-artwork texture with sRGB colour and max anisotropy. */
export function usePrintTexture(src) {
  const gl = useThree((s) => s.gl);
  const texture = useTexture(assetUrl(src));
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
  }, [texture, gl]);
  return texture;
}

/** Clear acrylic: translucent, glossy, no depth write so the print shows through. */
export function Acrylic(props) {
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

/** White backing behind a print, seen through the acrylic from behind. */
export function Backing({ width, height, z }) {
  return (
    <mesh position={[0, 0, z]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color="#ffffff" emissive="#e6e6e3" emissiveIntensity={0.55} roughness={0.8} />
    </mesh>
  );
}

/** Unlit print so the artwork keeps its true colours under any lighting. */
export function Print({ texture, width, height, z }) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

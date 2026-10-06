import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { Acrylic, Backing, BlackAcrylic, Print, usePrintTexture } from './shared';

// Real-world proportions of an A5-ish L-shaped acrylic table stand.
const PANEL = { w: 2.1, h: 3.28, t: 0.06 };
const BASE_DEPTH = 1.05;
const PANEL_Y = 0.12;
const MARGIN = 0.035; // clear acrylic border around the print

/**
 * L-shaped acrylic table stand. The artwork is printed on the front face.
 * `finish`: 'clear' (clear acrylic, white backing seen from behind) or
 * 'black' (solid glossy black sheet, the print covering the whole face).
 */
export default function AcrylicStand({ texture: src, finish = 'clear' }) {
  const texture = usePrintTexture(src);
  const black = finish === 'black';
  const Sheet = black ? BlackAcrylic : Acrylic;
  const margin = black ? 0.004 : MARGIN;
  const w = PANEL.w - margin * 2;
  // Keep the artwork's aspect ratio, capped by the panel height.
  const h = Math.min(PANEL.h - margin * 2, (w * texture.image.height) / texture.image.width);
  const bottom = PANEL_Y - PANEL.h / 2;
  const front = PANEL.t / 2;

  return (
    <group>
      <RoundedBox args={[PANEL.w, PANEL.h, PANEL.t]} radius={0.025} smoothness={4} position={[0, PANEL_Y, 0]}>
        <Sheet />
      </RoundedBox>
      <group position={[0, PANEL_Y, 0]}>
        <Print texture={texture} width={w} height={h} z={front + 0.0015} />
        {!black && <Backing width={w} height={h} z={front - 0.001} />}
      </group>

      {/* Bend + foot extending backwards */}
      <mesh position={[0, bottom + 0.09, -0.09]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, PANEL.w, 24, 1, true, Math.PI, Math.PI / 2]} />
        <Sheet side={THREE.DoubleSide} />
      </mesh>
      <RoundedBox
        args={[PANEL.w, PANEL.t, BASE_DEPTH]}
        radius={0.025}
        smoothness={4}
        position={[0, bottom - 0.03 + PANEL.t / 2, -0.09 - BASE_DEPTH / 2 + 0.03]}
      >
        <Sheet />
      </RoundedBox>
    </group>
  );
}

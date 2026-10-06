import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

const PANEL = { w: 2.1, h: 3.28, t: 0.1 };
const BASE_DEPTH = 1.05;
const PANEL_Y = 0.12;
const RELIEF = 0.06; // how far the logo and icon stand out of the panel

const GOOGLE = { red: '#EA4335', yellow: '#FBBC05', green: '#34A853', blue: '#4285F4' };

const FINISHES = {
  gold: { color: '#ecc451', emissive: '#8a6616', metalness: 0.45, roughness: 0.5, icon: '#121212' },
  black: { color: '#202020', emissive: '#0a0a0a', metalness: 0.05, roughness: 0.85, icon: '#f2f2ee' },
};

const deg = (d) => (d * Math.PI) / 180;

/** Ring sector from angle a1 to a2 (degrees, counter-clockwise). */
function arcShape(R, r, a1, a2, cx = 0) {
  const s = new THREE.Shape();
  s.absarc(cx, 0, R, deg(a1), deg(a2), false);
  s.absarc(cx, 0, r, deg(a2), deg(a1), true);
  s.closePath();
  return s;
}

/** The four coloured pieces of the Google "G", as extrudable shapes. */
function googleG(R = 1, r = 0.62) {
  const barTop = 0.2 * R;
  const barBottom = -0.17 * R;
  const blue = new THREE.Shape();
  const aTop = Math.asin(barTop / R);
  const aInner = Math.asin(barBottom / r);
  blue.absarc(0, 0, R, deg(-43), aTop, false);
  blue.lineTo(0.03 * R, barTop);
  blue.lineTo(0.03 * R, barBottom);
  blue.lineTo(r * Math.cos(aInner), barBottom);
  blue.absarc(0, 0, r, aInner, deg(-43), true);
  blue.closePath();

  return [
    { shape: arcShape(R, r, 52, 148), color: GOOGLE.red },
    { shape: arcShape(R, r, 148, 211), color: GOOGLE.yellow },
    { shape: arcShape(R, r, 211, 317), color: GOOGLE.green },
    { shape: blue, color: GOOGLE.blue },
  ];
}

/** Contactless symbol: an outlined circle with four waves. */
function contactless() {
  const shapes = [arcShape(1, 0.91, 0, 360)];
  // Waves radiate to the right from a point left of centre.
  [0.14, 0.31, 0.48, 0.65].forEach((radius, i) => {
    const t = 0.075;
    const spread = 42 + i * 3;
    shapes.push(arcShape(radius + t / 2, radius - t / 2, -spread, spread, -0.3));
  });
  return shapes;
}

/** Fine hammered texture used as bump + roughness map for the panel. */
function useHammeredTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 9000; i++) {
      const v = 90 + Math.random() * 80;
      ctx.fillStyle = `rgba(${v},${v},${v},0.55)`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * size, Math.random() * size, 1 + Math.random() * 4, 1 + Math.random() * 3, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 3);
    return tex;
  }, []);
}

function Relief({ shapes, scale, position, color, ...material }) {
  const geometries = useMemo(
    () =>
      shapes.map(({ shape, color: c }) => ({
        color: c,
        geometry: new THREE.ExtrudeGeometry(shape, {
          depth: RELIEF / scale,
          bevelEnabled: true,
          bevelThickness: 0.008 / scale,
          bevelSize: 0.004 / scale,
          bevelSegments: 2,
          curveSegments: 48,
        }),
      })),
    [shapes, scale],
  );
  return (
    <group position={position} scale={scale}>
      {geometries.map(({ geometry, color: c }, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial color={c ?? color} emissive={c ?? color} emissiveIntensity={c ? 0.35 : 0} roughness={0.55} {...material} />
        </mesh>
      ))}
    </group>
  );
}

/** L-shaped stand with a raised Google "G" and contactless icon (gold or black finish). */
export default function EmbossedStand({ finish = 'gold' }) {
  const f = FINISHES[finish] ?? FINISHES.gold;
  const bump = useHammeredTexture();
  const g = useMemo(() => googleG(), []);
  const nfc = useMemo(() => contactless().map((shape) => ({ shape })), []);
  const bottom = PANEL_Y - PANEL.h / 2;
  const front = PANEL.t / 2;

  const material = (
    <meshPhysicalMaterial
      color={f.color}
      emissive={f.emissive}
      emissiveIntensity={0.6}
      metalness={f.metalness}
      roughness={f.roughness}
      roughnessMap={bump}
      bumpMap={bump}
      bumpScale={0.6}
      clearcoat={finish === 'gold' ? 0.3 : 0}
    />
  );

  return (
    <group>
      <RoundedBox args={[PANEL.w, PANEL.h, PANEL.t]} radius={0.02} smoothness={3} position={[0, PANEL_Y, 0]} castShadow receiveShadow>
        {material}
      </RoundedBox>
      <RoundedBox
        args={[PANEL.w, PANEL.t, BASE_DEPTH]}
        radius={0.02}
        smoothness={3}
        position={[0, bottom + PANEL.t / 2, -BASE_DEPTH / 2 + PANEL.t / 2]}
        castShadow
        receiveShadow
      >
        {material}
      </RoundedBox>

      <Relief shapes={g} scale={0.62} position={[0.02, PANEL_Y + 0.62, front]} />
      <Relief shapes={nfc} scale={0.37} position={[0.05, PANEL_Y - 0.92, front]} color={f.icon} roughness={0.4} />
    </group>
  );
}

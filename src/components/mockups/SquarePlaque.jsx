import { RoundedBox } from '@react-three/drei';
import { Acrylic, Backing, Print, usePrintTexture } from './shared';

const LONG_SIDE = { square: 3.0, portrait: 3.2 };
const THICKNESS = 0.16;
const MARGIN = 0.06;

/**
 * Thick acrylic plaque with rounded corners and the artwork on its face.
 * Its proportions follow the artwork (square, portrait or landscape).
 */
export default function SquarePlaque({ texture: src, backing }) {
  const texture = usePrintTexture(src);
  const aspect = texture.image.width / texture.image.height;
  const long = Math.abs(aspect - 1) < 0.05 ? LONG_SIDE.square : LONG_SIDE.portrait;
  const width = aspect >= 1 ? long : long * aspect;
  const height = aspect >= 1 ? long / aspect : long;
  const w = width - MARGIN * 2;
  const h = height - MARGIN * 2;
  const front = THICKNESS / 2;

  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[width, height, THICKNESS]} radius={0.14} smoothness={6}>
        <Acrylic opacity={0.4} />
      </RoundedBox>
      <Print texture={texture} width={w} height={h} z={front + 0.0015} />
      <Backing width={w} height={h} z={front - 0.001} {...(backing === 'black' && { color: '#0c0c0c', emissive: '#000000' })} />
    </group>
  );
}

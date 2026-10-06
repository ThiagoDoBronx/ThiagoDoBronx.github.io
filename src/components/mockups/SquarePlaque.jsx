import { RoundedBox } from '@react-three/drei';
import { Acrylic, Backing, Print, usePrintTexture } from './shared';

const SIZE = 3.0;
const THICKNESS = 0.16;
const MARGIN = 0.06;

/** Thick square acrylic plaque with rounded corners and the artwork on its face. */
export default function SquarePlaque({ texture: src }) {
  const texture = usePrintTexture(src);
  const w = SIZE - MARGIN * 2;
  const h = (w * texture.image.height) / texture.image.width;
  const front = THICKNESS / 2;

  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[SIZE, SIZE, THICKNESS]} radius={0.14} smoothness={6}>
        <Acrylic opacity={0.4} />
      </RoundedBox>
      <Print texture={texture} width={w} height={h} z={front + 0.0015} />
      <Backing width={w} height={h} z={front - 0.001} />
    </group>
  );
}

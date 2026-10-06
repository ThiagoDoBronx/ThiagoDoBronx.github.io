import { RoundedBox } from '@react-three/drei';
import { Print, usePrintTexture } from './shared';

const WIDTH = 3.4;
const THICKNESS = 0.035;

/** Business card on thick cream paper, artwork on the front. */
export default function BusinessCard({ texture: src, paper = '#efe9dd' }) {
  const texture = usePrintTexture(src);
  const height = (WIDTH * texture.image.height) / texture.image.width;
  const front = THICKNESS / 2;

  return (
    <group position={[0, 0.25, 0]}>
      <RoundedBox args={[WIDTH, height, THICKNESS]} radius={0.015} smoothness={2}>
        <meshStandardMaterial color={paper} roughness={0.92} />
      </RoundedBox>
      <Print texture={texture} width={WIDTH - 0.004} height={height - 0.004} z={front + 0.0015} />
    </group>
  );
}

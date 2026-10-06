import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import product from './data/product.json';
import Mockup from './components/mockups/Mockup';
import StudioLights from './components/StudioLights';

/**
 * `?thumb=<model id>` renders a single mockup on a transparent square,
 * used by scripts/thumbs.mjs to generate the picker thumbnails.
 */
export default function ThumbStage({ id }) {
  const model = product.models.find((m) => m.id === id) ?? product.models[0];
  return (
    <div id="thumb" style={{ width: 384, height: 384 }}>
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 35 }}
        dpr={1}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={() => setTimeout(() => (document.body.dataset.ready = '1'), 1500)}
      >
        <StudioLights />
        <Suspense fallback={null}>
          <group rotation={[0.08, -0.45, 0]} position={[0, -0.05, 0]}>
            <Mockup model={model} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

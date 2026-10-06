import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Protagonist from './Protagonist';
import StudioLights from './StudioLights';
import { preloadMockups } from './mockups/Mockup';

/**
 * Fixed, full-screen WebGL layer. Pointer events are read from the page root
 * so the canvas itself can stay `pointer-events: none` under the copy.
 */
export default function Scene({ product, model, reducedMotion, onReady }) {
  useMemo(() => preloadMockups(product.models), [product.models]);

  return (
    <div className="canvas-container pointer-events-none fixed inset-0 z-10" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <StudioLights />
        <Suspense fallback={null}>
          <Protagonist model={model} shadowColor={product.colors[1]} reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import Protagonist from './Protagonist';
import StudioLights from './StudioLights';
import { preloadMockups } from './mockups/Mockup';

/**
 * Fixed, full-screen WebGL layer. Pointer events are read from the page root
 * so the canvas itself can stay `pointer-events: none` under the copy.
 */
export default function Scene({ product, model, flight, onFlightDone, reducedMotion, onReady }) {
  useMemo(() => preloadMockups(product.models), [product.models]);
  // Start at up to 1.5× pixel density and drop to 1× if the device struggles.
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5));

  return (
    <div className="canvas-container pointer-events-none fixed inset-0 z-10" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 9], fov: 35 }}
        // MSAA is barely visible on high-density screens but costs a lot there.
        gl={{ antialias: (window.devicePixelRatio || 1) < 1.5, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <StudioLights />
        <Suspense fallback={null}>
          <Protagonist
            model={model}
            flight={flight}
            onFlightDone={onFlightDone}
            shadowColor={product.colors[1]} reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

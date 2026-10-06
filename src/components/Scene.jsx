import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import Protagonist from './Protagonist';

/**
 * Fixed, full-screen WebGL layer. Pointer events are read from the page root
 * so the canvas itself can stay `pointer-events: none` under the copy.
 */
export default function Scene({ product, reducedMotion, onReady }) {
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
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={60} castShadow />
        <Suspense fallback={null}>
          <Protagonist product={product} reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
        {/* Studio lighting built from light-formers: no HDR download needed. */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={4} position={[0, 4, -6]} scale={[12, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="ring" intensity={1.5} position={[0, 1, 6]} scale={3} />
        </Environment>
      </Canvas>
    </div>
  );
}

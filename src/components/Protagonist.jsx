import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { gsap, intro, pose, showcaseWeight, spin } from '../lib/choreography';
import Mockup from './mockups/Mockup';

export default function Protagonist({ model, shadowColor, reducedMotion, onReady }) {
  const travel = useRef();
  const pitch = useRef();
  const turn = useRef();
  const tilt = useRef();
  const swap = useRef({ v: 1 });
  const [shown, setShown] = useState(model);
  const { viewport } = useThree();

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Switching mockups: shrink + half-turn out, swap, grow back in.
  useEffect(() => {
    if (model.id === shown.id) return;
    const tl = gsap
      .timeline()
      .to(swap.current, { v: 0, duration: 0.35, ease: 'power4.in', onComplete: () => setShown(model) })
      .to(swap.current, { v: 1, duration: 1, ease: 'power4.out' });
    return () => tl.kill();
  }, [model, shown.id]);

  useFrame((state, delta) => {
    const narrow = viewport.aspect < 0.8;
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    // On portrait screens the object can't sit beside the copy, so it lives
    // in the upper half (copy sits at the bottom) and drifts less sideways.
    const xRange = narrow ? 0.3 : 1;
    const yShift = narrow ? halfH * 0.3 * pose.m : 0;
    const base = narrow ? Math.min(0.7, viewport.width / 4.2) : 1;
    const k = intro.v;
    const s = swap.current.v;

    travel.current.position.set(pose.x * halfW * xRange, pose.y * halfH * (narrow ? 0.3 : 1) + yShift, 0);
    travel.current.scale.setScalar(pose.scale * base * (0.6 + 0.4 * k) * (0.15 + 0.85 * s));

    // Free 360° spin (both axes) only counts while the showcase is on screen.
    const w = showcaseWeight();
    spin.current = THREE.MathUtils.damp(spin.current, spin.target, 4, delta);
    spin.pitch = THREE.MathUtils.damp(spin.pitch, spin.pitchTarget, 4, delta);
    pitch.current.rotation.x = spin.pitch * w;
    turn.current.rotation.set(0, pose.rotY - (1 - k) * Math.PI - (1 - s) * Math.PI + spin.current * w, pose.rotZ);

    // Mouse parallax: soft lerp towards the pointer (the free spin replaces
    // it in the showcase).
    const { x, y } = state.pointer;
    tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, x * 0.5 * (1 - w), 0.1);
    tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -y * 0.3 * (1 - w), 0.1);
  });

  return (
    <group ref={travel}>
      <group ref={pitch}>
        <group ref={turn}>
          <Float speed={reducedMotion ? 0 : 2} rotationIntensity={0.5} floatIntensity={reducedMotion ? 0 : 1}>
            <group ref={tilt}>
              <Mockup model={shown} />
            </group>
          </Float>
        </group>
      </group>
      <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={8} blur={2.6} far={3} color={shadowColor} />
    </group>
  );
}

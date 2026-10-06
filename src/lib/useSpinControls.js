import { useEffect } from 'react';
import { showcaseWeight, spin } from './choreography';

const TURN = Math.PI * 2;

/**
 * 360° spin for the showcase header.
 * - Mouse: the horizontal position maps to the angle — centre is face-on,
 *   each edge is half a turn, so crossing the screen is one full turn.
 * - Touch: horizontal drag adds to the angle; vertical swipes still scroll.
 */
export default function useSpinControls() {
  useEffect(() => {
    let lastX = null;

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse' || showcaseWeight() === 0) return;
      spin.target = (e.clientX / window.innerWidth - 0.5) * TURN;
    };
    const onTouchStart = (e) => {
      lastX = e.touches[0].clientX;
    };
    const onTouchMove = (e) => {
      if (lastX === null || showcaseWeight() === 0) return;
      const x = e.touches[0].clientX;
      spin.target += ((x - lastX) / window.innerWidth) * TURN * 1.2;
      lastX = x;
    };
    const onTouchEnd = () => {
      lastX = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}

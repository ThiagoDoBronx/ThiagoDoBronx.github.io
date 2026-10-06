import { useEffect } from 'react';
import { showcaseWeight, spin } from './choreography';

const TURN = Math.PI * 2;
const MAX_STEP = 120; // px — ignore jumps (pointer re-entering the window)

/**
 * Free 360° spin on both axes for the showcase header.
 * - Mouse: just moving the pointer turns the object — crossing the whole
 *   screen sideways is one full turn, top-to-bottom is one full flip.
 *   Moving over the model picker (`[data-no-spin]`) doesn't rotate.
 * - Touch: dragging on the stage (`[data-spin-stage]`, touch-action: none)
 *   rotates the same way; elsewhere the page scrolls as usual.
 */
export default function useSpinControls() {
  useEffect(() => {
    let last = null;
    let touching = false;

    const rotateBy = (dx, dy) => {
      if (Math.abs(dx) > MAX_STEP || Math.abs(dy) > MAX_STEP) return;
      spin.target += (dx / window.innerWidth) * TURN;
      spin.pitchTarget += (dy / window.innerHeight) * TURN;
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const prev = last;
      last = { x: e.clientX, y: e.clientY };
      if (!prev || showcaseWeight() === 0 || e.target.closest?.('[data-no-spin]')) return;
      rotateBy(last.x - prev.x, last.y - prev.y);
    };
    const onPointerLeave = () => {
      last = null;
    };

    const onTouchStart = (e) => {
      touching = !!e.target.closest?.('[data-spin-stage]');
      last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!touching || !last || showcaseWeight() === 0) return;
      const t = e.touches[0];
      rotateBy((t.clientX - last.x) * 1.2, (t.clientY - last.y) * 1.2);
      last = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => {
      touching = false;
      last = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}

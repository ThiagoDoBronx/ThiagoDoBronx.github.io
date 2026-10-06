import { useEffect } from 'react';
import { spin, spinWeight } from './choreography';

const TURN = Math.PI * 2;
const MAX_STEP = 120; // px — ignore jumps (pointer re-entering the window)

/**
 * Free 360° spin on both axes, in the showcase header and at 100% scroll.
 * - Mouse: just moving the pointer turns the object — crossing the whole
 *   screen sideways is one full turn, top-to-bottom is one full flip.
 *   Moving over the model picker (`[data-no-spin]`) doesn't rotate.
 * - Touch: on the stage (`[data-spin-stage]`), with the page fully at the
 *   top or at the end (100%), a gesture that starts sideways spins the
 *   mockup (both axes for the rest of that drag). A gesture that starts
 *   up/down always scrolls, so the page never feels stuck. Scrolling is
 *   blocked per gesture (non-passive touchmove + preventDefault), never with
 *   `touch-action: none`.
 */
export default function useSpinControls() {
  useEffect(() => {
    let last = null;
    let touching = false; // gesture started on the stage, direction unknown
    let spinning = false; // gesture locked to spinning

    const rotateBy = (dx, dy) => {
      if (Math.abs(dx) > MAX_STEP || Math.abs(dy) > MAX_STEP) return;
      spin.target += (dx / window.innerWidth) * TURN;
      spin.pitchTarget += (dy / window.innerHeight) * TURN;
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const prev = last;
      last = { x: e.clientX, y: e.clientY };
      if (!prev || spinWeight() === 0 || e.target.closest?.('[data-no-spin]')) return;
      rotateBy(last.x - prev.x, last.y - prev.y);
    };
    const onPointerLeave = () => {
      last = null;
    };

    const onTouchStart = (e) => {
      touching = e.touches.length === 1 && !!e.target.closest?.('[data-spin-stage]') && spinWeight() > 0.95;
      spinning = false;
      last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!touching || !last) return;
      const t = e.touches[0];
      if (!spinning) {
        const dx = Math.abs(t.clientX - last.x);
        const dy = Math.abs(t.clientY - last.y);
        if (dx + dy < 3) return; // too small to tell the direction yet
        if (dy >= dx) {
          touching = false; // vertical: let the page scroll
          return;
        }
        spinning = true;
      }
      if (e.cancelable) e.preventDefault(); // this drag spins, it doesn't scroll
      rotateBy((t.clientX - last.x) * 1.2, (t.clientY - last.y) * 1.2);
      last = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => {
      touching = false;
      spinning = false;
      last = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
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

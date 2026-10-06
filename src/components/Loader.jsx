import { useEffect, useRef } from 'react';
import { gsap } from '../lib/choreography';

/**
 * Counts up while the 3D scene boots, then lifts like a curtain.
 * Calls `onDone` once the page underneath is visible.
 */
export default function Loader({ ready, brand, onDone }) {
  const root = useRef();
  const count = useRef();
  const counter = useRef({ v: 0 });
  const minTime = useRef(null);

  useEffect(() => {
    minTime.current = gsap.to(counter.current, {
      v: 86,
      duration: 1.4,
      ease: 'power4.out',
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.current.v)).padStart(3, '0');
      },
    });
    return () => minTime.current.kill();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const tl = gsap.timeline({ delay: Math.max(0, 1.4 - minTime.current.time()) });
    tl.to(counter.current, {
      v: 100,
      duration: 0.5,
      ease: 'power4.out',
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.current.v)).padStart(3, '0');
      },
    })
      .to(root.current.querySelectorAll('[data-fade]'), { autoAlpha: 0, duration: 0.4, ease: 'power4.out' })
      .to(root.current, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '<0.1')
      .add(() => onDone?.(), '-=0.55')
      .set(root.current, { display: 'none' });
    return () => tl.kill();
  }, [ready, onDone]);

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-end justify-between bg-ink p-[6vw] text-paper">
      <span data-fade className="label opacity-60">
        {brand}
      </span>
      <span data-fade ref={count} className="font-serif text-[18vw] leading-none italic md:text-[10vw]">
        000
      </span>
    </div>
  );
}

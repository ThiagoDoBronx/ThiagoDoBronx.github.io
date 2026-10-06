import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './choreography';

/** Viscous smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export default function useLenis(enabled) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}

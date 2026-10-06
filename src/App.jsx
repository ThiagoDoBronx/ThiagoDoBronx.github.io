import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import product from './data/product.json';
import Scene from './components/Scene';
import Loader from './components/Loader';
import Nav from './components/Nav';
import { Finale, Hero, Showcase, StorySection } from './components/Sections';
import { buildPoses, gsap, intro, pose, resetSpin } from './lib/choreography';
import useLenis from './lib/useLenis';
import useSpinControls from './lib/useSpinControls';

const EASE = 'power4.out';

export default function App() {
  const container = useRef();
  const progress = useRef();
  const [sceneReady, setSceneReady] = useState(false);
  const [entered, setEntered] = useState(false);
  // The mockup on stage, the ones waiting in the picker circles, and the
  // swap in progress (if any).
  const [mainIndex, setMainIndex] = useState(0);
  const [slots, setSlots] = useState(() => product.models.map((_, i) => i).slice(1));
  const [flight, setFlight] = useState(null);

  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const lenis = useLenis(!reducedMotion);
  useSpinControls();
  const poses = useMemo(() => buildPoses(product.sections), []);

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onLoaderDone = useCallback(() => setEntered(true), []);
  const onSelectModel = useCallback(
    (slot, rect) => {
      if (flight) return;
      resetSpin();
      setFlight({
        key: Date.now(),
        slot,
        rect,
        outgoing: product.models[mainIndex],
        outgoingIndex: mainIndex,
      });
      setMainIndex(slots[slot]);
    },
    [flight, mainIndex, slots],
  );
  const onFlightDone = useCallback(() => {
    setFlight((f) => {
      if (f) setSlots((s) => s.map((m, i) => (i === f.slot ? f.outgoingIndex : m)));
      return null;
    });
  }, []);

  // Theme the page from the product definition.
  useLayoutEffect(() => {
    const [paper, ink] = product.colors;
    document.documentElement.style.setProperty('--color-paper', paper);
    document.documentElement.style.setProperty('--color-ink', ink);
    document.title = product.title;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Freeze scrolling until the curtain lifts.
  useEffect(() => {
    const l = lenis.current;
    if (entered) {
      l?.start();
      document.documentElement.style.overflow = '';
    } else {
      l?.stop();
      document.documentElement.style.overflow = 'hidden';
    }
  }, [entered, lenis]);

  // Scroll choreography: the object travels through one keyframe per section.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      Object.assign(pose, poses[0]);

      const tl = gsap.timeline({
        defaults: { ease: EASE, duration: 1 },
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            if (progress.current) {
              progress.current.textContent = String(Math.round(self.progress * 100)).padStart(3, '0');
            }
          },
        },
      });
      // Every section is exactly one viewport tall, so segment i of the
      // timeline maps 1:1 onto the scroll between section i and i + 1.
      poses.slice(1).forEach((p, i) => tl.to(pose, { ...p }, i));

      // Depth layers drift at their own speed.
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 25 },
          {
            yPercent: -25,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      // Copy reveals per section.
      gsap.utils.toArray('[data-section]').forEach((section) => {
        const lines = section.querySelectorAll('[data-reveal-line]');
        const items = section.querySelectorAll('[data-reveal]');
        if (!lines.length && !items.length) return;
        gsap.set(lines, { yPercent: 110 });
        gsap.set(items, { autoAlpha: 0, y: 40 });
        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' },
          })
          .to(lines, { yPercent: 0, duration: 1.4, ease: EASE })
          .to(items, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: EASE }, 0.1);
      });

      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 });
    }, container);
    return () => ctx.revert();
  }, [poses]);

  // Intro once the loader is gone: the object spins into place, the hint fades in.
  useEffect(() => {
    if (!entered) return;
    const tl = gsap
      .timeline()
      .to(intro, { v: 1, duration: reducedMotion ? 0 : 2.2, ease: EASE }, 0)
      .to('[data-hero-fade]', { autoAlpha: 0.5, y: 0, duration: 1.4, ease: EASE }, 1);
    return () => tl.kill();
  }, [entered, reducedMotion]);

  const lastIndex = product.sections.length + 1;

  return (
    <>
      <Loader ready={sceneReady} brand={product.brand} onDone={onLoaderDone} />
      <Scene
        product={product}
        model={product.models[mainIndex]}
        flight={flight}
        onFlightDone={onFlightDone}
        reducedMotion={reducedMotion}
        onReady={onSceneReady}
      />
      <Nav ref={progress} product={product} />

      <main ref={container} className="main-container relative">
        <Showcase
          title={product.title}
          models={slots.map((i) => product.models[i])}
          flyingSlot={flight?.slot ?? -1}
          onSelect={onSelectModel}
        />
        <Hero hero={product.hero} />
        {product.sections.map((section, i) => (
          <StorySection key={section.title} section={section} index={i} />
        ))}
        <Finale product={product} index={lastIndex} model={product.models[mainIndex]} />
      </main>
    </>
  );
}

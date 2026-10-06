import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import product from './data/product.json';
import Scene from './components/Scene';
import Loader from './components/Loader';
import Nav from './components/Nav';
import { Finale, Hero, StorySection } from './components/Sections';
import { buildPoses, gsap, intro, pose } from './lib/choreography';
import useLenis from './lib/useLenis';

const EASE = 'power4.out';

export default function App() {
  const container = useRef();
  const progress = useRef();
  const [sceneReady, setSceneReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const lenis = useLenis(!reducedMotion);
  const poses = useMemo(() => buildPoses(product.sections), []);

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onLoaderDone = useCallback(() => setEntered(true), []);

  // Theme the page from the product definition.
  useLayoutEffect(() => {
    const [paper, ink] = product.colors;
    document.documentElement.style.setProperty('--color-paper', paper);
    document.documentElement.style.setProperty('--color-ink', ink);
    document.title = `${product.brand.split(' ')[0]} — ${product.name}`;
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

      gsap.set('[data-hero]', { yPercent: 110 });
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 });
    }, container);
    return () => ctx.revert();
  }, [poses]);

  // Intro once the loader is gone: headline rises, object spins into place.
  useEffect(() => {
    if (!entered) return;
    const tl = gsap
      .timeline()
      .to(intro, { v: 1, duration: reducedMotion ? 0 : 2.2, ease: EASE }, 0)
      .to('[data-hero]', { yPercent: 0, duration: 1.6, stagger: 0.12, ease: EASE }, 0)
      .to('[data-hero-fade]', { autoAlpha: 0.5, y: 0, duration: 1.4, ease: EASE }, 0.5);
    return () => tl.kill();
  }, [entered, reducedMotion]);

  const lastIndex = product.sections.length + 1;

  return (
    <>
      <Loader ready={sceneReady} brand={product.brand} onDone={onLoaderDone} />
      <Scene product={product} reducedMotion={reducedMotion} onReady={onSceneReady} />
      <Nav ref={progress} product={product} />

      <main ref={container} className="main-container relative">
        <Hero hero={product.hero} />
        {product.sections.map((section, i) => (
          <StorySection key={section.title} section={section} index={i} />
        ))}
        <Finale product={product} index={lastIndex} />
      </main>
    </>
  );
}

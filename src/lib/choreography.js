import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Mutable pose of the 3D protagonist. GSAP writes it (scroll-scrubbed),
 * the R3F render loop reads it every frame — no React re-renders involved.
 *
 * x / y are normalised to the half-viewport (-1 … 1), rotations in radians.
 */
export const pose = { x: 0, y: 0.02, rotY: 0, rotZ: 0, scale: 1.05, m: 0 };

/**
 * Free 360° spin (yaw + pitch) driven by the pointer (mouse / finger) while
 * the showcase header is on screen. `target` is set by input, `current`
 * eases towards it every frame.
 */
export const spin = { target: 0, current: 0, pitchTarget: 0, pitch: 0 };

/** Bring the free spin back to face-on by the shortest way round. */
export function resetSpin() {
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  spin.current = wrap(spin.current);
  spin.pitch = wrap(spin.pitch);
  spin.target = 0;
  spin.pitchTarget = 0;
}

/** 1 while the showcase header fills the screen, fading to 0 as it scrolls away. */
export function showcaseWeight() {
  return Math.min(1, Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6)));
}

/** Pose the object takes in the showcase header: alone, centred, face-on. */
const SHOWCASE = { x: 0, y: 0.02, rotY: 0, rotZ: 0, scale: 1.05, m: 0 };

/** Intro factor (0 → 1) played once the loader lifts. */
export const intro = { v: 0 };

/**
 * One keyframe per page section: showcase, hero, every product section, finale.
 * `m` (0…1) is how much the portrait-screen layout shift applies.
 * The object always sits on the side opposite to the copy, so the
 * text column keeps its negative space and the object owns the other half.
 */
export function buildPoses(sections) {
  const poses = [SHOWCASE, { x: 0.38, y: 0, rotY: -0.32, rotZ: -0.05, scale: 1, m: 1 }];

  sections.forEach((section, i) => {
    const side = section.align === 'right' ? -1 : 1;
    poses.push({
      x: 0.42 * side,
      y: i % 2 ? 0.08 : -0.06,
      // Turn the face towards the copy, never past ~30° so the print stays legible.
      rotY: -0.5 * side,
      rotZ: 0.06 * -side,
      scale: 1.05 + (i % 2) * 0.1,
      m: 1,
    });
  });

  poses.push({
    x: 0,
    y: 0.16,
    // One full turn on the way to the finale, landing face-on.
    rotY: Math.PI * 2,
    rotZ: 0,
    scale: 0.85,
    m: 1,
  });

  return poses;
}

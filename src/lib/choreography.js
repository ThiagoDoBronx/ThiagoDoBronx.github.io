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
export const pose = { x: 0.38, y: 0, rotY: -0.32, rotZ: -0.05, scale: 1 };

/** Intro factor (0 → 1) played once the loader lifts. */
export const intro = { v: 0 };

/**
 * One keyframe per page section: hero, every product section, finale.
 * The object always sits on the side opposite to the copy, so the
 * text column keeps its negative space and the object owns the other half.
 */
export function buildPoses(sections) {
  const poses = [{ x: 0.38, y: 0, rotY: -0.32, rotZ: -0.05, scale: 1 }];

  sections.forEach((section, i) => {
    const side = section.align === 'right' ? -1 : 1;
    poses.push({
      x: 0.42 * side,
      y: i % 2 ? 0.08 : -0.06,
      // Turn the face towards the copy, never past ~30° so the print stays legible.
      rotY: -0.5 * side,
      rotZ: 0.06 * -side,
      scale: 1.05 + (i % 2) * 0.1,
    });
  });

  poses.push({
    x: 0,
    y: 0.16,
    // One full turn on the way to the finale, landing face-on.
    rotY: Math.PI * 2,
    rotZ: 0,
    scale: 0.85,
  });

  return poses;
}

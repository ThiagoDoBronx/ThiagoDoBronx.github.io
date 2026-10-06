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
export const pose = { x: -0.04, y: 0.02, rotY: 0, rotZ: 0, scale: 1.05, m: 0, ms: 1 };

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

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** 1 while the showcase header fills the screen, fading to 0 as it scrolls away. */
export function showcaseWeight() {
  return clamp01(1 - window.scrollY / (window.innerHeight * 0.6));
}

/** 1 once the page is scrolled all the way down (100%), 0 just before it. */
export function endWeight() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return clamp01(1 - (max - window.scrollY) / (window.innerHeight * 0.12));
}

/** How much the free 360° spin applies: in the showcase and at the very end. */
export function spinWeight() {
  return Math.max(showcaseWeight(), endWeight());
}

/** Pose the object takes in the showcase header: alone, centred, face-on. */
const SHOWCASE = { x: -0.04, y: 0.02, rotY: 0, rotZ: 0, scale: 1.05, m: 0, ms: 1 };

/**
 * How the picker thumbnails are framed (see ThumbStage): the mockup's
 * rotation and how much of the circle's height it fills. Used so a mockup
 * flying in/out of a circle lines up with its thumbnail.
 */
export const THUMB_POSE = { pitch: 0.08, yaw: -0.45, fill: 0.64 };

/** Intro factor (0 → 1) played once the loader lifts. */
export const intro = { v: 0 };

/**
 * One keyframe per page section: showcase, hero, every product section, finale.
 * The object sits on the side opposite to the copy and always stays facing
 * the viewer — only a slight lean towards the text keeps it feeling alive.
 * On portrait screens, `m` scales the upward layout shift and `ms` the size.
 */
export function buildPoses(sections) {
  const poses = [SHOWCASE, { x: 0.52, y: 0, rotY: -0.12, rotZ: -0.03, scale: 0.95, m: 1, ms: 1 }];

  sections.forEach((section, i) => {
    const side = section.align === 'right' ? -1 : 1;
    poses.push({
      x: 0.42 * side,
      y: i % 2 ? 0.08 : -0.06,
      rotY: -0.14 * side,
      rotZ: 0.03 * -side,
      scale: 1.05,
      m: 1,
      ms: 1,
    });
  });

  poses.push({ x: 0, y: 0.16, rotY: 0, rotZ: 0, scale: 0.85, m: 1, ms: 1 });

  return poses;
}

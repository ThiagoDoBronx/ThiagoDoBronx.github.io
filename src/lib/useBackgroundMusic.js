import { useCallback, useEffect, useRef, useState } from 'react';
import { assetUrl } from '../components/mockups/shared';

const PREF_KEY = 'vv-music';
const readPref = () => {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
};
const savePref = (v) => {
  try {
    localStorage.setItem(PREF_KEY, v);
  } catch {
    /* storage unavailable: preference just isn't remembered */
  }
};

/**
 * Looping background music at a fixed volume.
 *
 * - Browsers block audio until the visitor interacts, so it starts on the
 *   first tap/click/key press (unless they switched it off on a past visit).
 * - Volume goes through a Web Audio gain node: iOS ignores `audio.volume`.
 * - Fades in/out, pauses while the tab is hidden.
 * - If the file isn't there (`available` false) nothing is shown or played.
 */
export default function useBackgroundMusic({ src, volume = 0.4 } = {}) {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const graph = useRef(null); // { ctx, gain }
  const wanted = useRef(readPref() !== 'off');

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const url = assetUrl(src);
    fetch(url, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || '';
        if (cancelled || !r.ok || !type.startsWith('audio/')) return;
        const a = new Audio(url);
        a.loop = true;
        a.preload = 'none';
        a.addEventListener('play', () => setPlaying(true));
        a.addEventListener('pause', () => setPlaying(false));
        audio.current = a;
        setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      audio.current?.pause();
      graph.current?.ctx.close();
    };
  }, [src]);

  const start = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (!graph.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(a).connect(gain).connect(ctx.destination);
      graph.current = { ctx, gain };
    }
    const { ctx, gain } = graph.current;
    ctx.resume();
    a.play()
      .then(() => gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.5))
      .catch(() => {});
  }, [volume]);

  const stop = useCallback(() => {
    const a = audio.current;
    if (!a || !graph.current) return a?.pause();
    const { ctx, gain } = graph.current;
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    setTimeout(() => a.pause(), 600);
  }, []);

  // First interaction anywhere starts the music (the toggle handles itself).
  useEffect(() => {
    if (!available) return;
    const events = ['pointerdown', 'keydown', 'touchend'];
    const remove = () => events.forEach((e) => window.removeEventListener(e, kick));
    function kick(e) {
      if (e.target?.closest?.('[data-sound-toggle]')) return remove();
      remove();
      if (wanted.current) start();
    }
    events.forEach((e) => window.addEventListener(e, kick, { passive: true }));
    return remove;
  }, [available, start]);

  // Pause while the tab is in the background.
  useEffect(() => {
    if (!available) return;
    const onVisibility = () => {
      if (document.hidden) audio.current?.pause();
      else if (wanted.current && graph.current) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [available, start]);

  const toggle = useCallback(() => {
    wanted.current = !playing;
    savePref(wanted.current ? 'on' : 'off');
    if (wanted.current) start();
    else stop();
  }, [playing, start, stop]);

  return { available, playing, toggle };
}

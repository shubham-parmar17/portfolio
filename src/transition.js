// Tiny bridge so any link can trigger the animated page transition owned by App.
let handler = null;
let scroller = null;
export const state = { busy: false };

export const setNav = (f) => { handler = f; };
export const setScroller = (f) => { scroller = f; };
export const go = (to) => handler && handler(to);
export const scrollToTarget = (target) => scroller && scroller(target);
export const isTransitioning = () => state.busy;

export const hasPreloaderRun = () => {
  try { return !!sessionStorage.seen; } catch { return true; }
};

export const reduced = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
};

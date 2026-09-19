'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/* useLayoutEffect warns during SSR and there's no DOM to measure there anyway. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Keeps a drawer mounted long enough to play its exit animation.
 *
 * Both drawers previously did `if (!isOpen) return null`, so they vanished in a
 * single frame — an entrance animation with no exit reads as a glitch rather
 * than a transition. This returns:
 *
 *   isMounted — render the markup at all (stays true through the exit)
 *   isVisible — drives the `data-open` attribute the CSS transitions key off
 *   ref       — attach to the animating element (see below)
 *
 * For a transition to interpolate, the browser must resolve the element's
 * *closed* style before the open style is applied. The usual trick is a
 * double requestAnimationFrame, but rAF is paused while the page is hidden —
 * so a drawer opened in a background tab would stick at its start position
 * forever. Reading layout off the ref forces a synchronous style flush
 * instead, which the browser performs whether or not it's painting.
 */
export function useDrawerTransition<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  durationMs = 420
) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    setIsVisible(false);
    const timer = setTimeout(() => setIsMounted(false), durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, durationMs]);

  // Runs once the closed-state markup is in the DOM; flushes it, then opens.
  useIsomorphicLayoutEffect(() => {
    if (!isMounted || !isOpen || isVisible) return;

    // Forces a style/layout recalc so the closed transform is the transition's
    // resolved start value. Reading the box is enough — nothing to paint.
    void ref.current?.getBoundingClientRect();
    setIsVisible(true);
  }, [isMounted, isOpen, isVisible]);

  return { isMounted, isVisible, ref };
}

/** Closes a drawer on Escape while it's open. */
export function useEscapeKey(isActive: boolean, onEscape: () => void) {
  const handler = useRef(onEscape);
  handler.current = onEscape;

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handler.current();
  }, []);

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isActive, onKeyDown]);
}

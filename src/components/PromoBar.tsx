'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StarIcon } from './StarIcon';
import { isDropLive } from '@/lib/dropConfig';

interface PromoBarProps {
  message?: string;
}

const PRE_LAUNCH_MESSAGE =
  '"For The Stars" Launches September 23 — Join The Tribe To Get In First';
const LIVE_MESSAGE =
  '"For The Stars" Drop 001 Is Now Live — Shop The Signature Collection';

/* Dismissal is keyed to the message itself, so shipping a NEW announcement
   automatically shows the bar again to everyone who dismissed the old one.
   A single "promoDismissed" flag would silently hide every future campaign
   from exactly the people most likely to have been reading them. */
const storageKeyFor = (message: string) =>
  `papandu:promo-dismissed:${message.slice(0, 80)}`;

/* Reading localStorage in a layout effect lets us hide an already-dismissed bar
   before the browser paints, so repeat visitors don't see it flash. useEffect
   would run after paint. Falls back to useEffect on the server, where
   useLayoutEffect warns and there's no localStorage anyway. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const PromoBar: React.FC<PromoBarProps> = ({ message }) => {
  const [activeMessage, setActiveMessage] = useState(
    message || (typeof window !== 'undefined' && isDropLive() ? LIVE_MESSAGE : PRE_LAUNCH_MESSAGE)
  );
  // Starts visible so the server and first client render agree — anything else
  // is a hydration mismatch.
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const currentMsg = message || (isDropLive() ? LIVE_MESSAGE : PRE_LAUNCH_MESSAGE);
    setActiveMessage(currentMsg);

    try {
      if (window.localStorage.getItem(storageKeyFor(currentMsg)) === '1') {
        setIsDismissed(true);
      }
    } catch {
      // Private mode or blocked storage — just leave the bar up.
    }
  }, [message]);

  const handleDismiss = () => {
    setIsCollapsing(true);
    try {
      window.localStorage.setItem(storageKeyFor(activeMessage), '1');
    } catch {
      // Dismissal won't persist, but it should still close for this session.
    }
  };

  useEffect(() => {
    if (!isCollapsing) return;
    const timer = setTimeout(() => setIsDismissed(true), 340);
    return () => clearTimeout(timer);
  }, [isCollapsing]);

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Announcement"
      data-collapsing={isCollapsing}
      className="promo-bar"
      style={{
        position: 'relative',
        zIndex: 50,
        /* Gold, not black. The header directly below is papandu-red: black
           against it scores 1.73:1, so the two bands merged into one heavy
           dark mass. Gold separates at 8.67:1 and carries black text at
           14.65:1 — the best text contrast of any option tested, and gold as
           a solid fill is exactly what the brand guidelines reserve it for. */
        backgroundColor: 'var(--papandu-gold)',
        borderBottom: '1px solid rgba(9, 10, 14, 0.18)',
        userSelect: 'none',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '10px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 44px',
        }}
      >
        <StarIcon size={12} color="var(--papandu-red)" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)',
            letterSpacing: '0.06em',
            fontWeight: 500,
            color: 'var(--papandu-black)',
            lineHeight: 1.4,
          }}
        >
          {activeMessage}
        </span>
        <StarIcon size={12} color="var(--papandu-red)" style={{ flexShrink: 0 }} />
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="promo-bar-close"
      >
        <X size={15} strokeWidth={2.5} />
      </button>
    </aside>
  );
};

export default PromoBar;

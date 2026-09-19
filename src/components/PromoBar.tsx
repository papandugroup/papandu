import React from 'react';
import { StarIcon } from './StarIcon';

interface PromoBarProps {
  message?: string;
}

export const PromoBar: React.FC<PromoBarProps> = ({
  message = '"For The Stars" Launches September 23 — Join The Tribe To Get In First',
}) => {
  return (
    <aside
      aria-label="Announcement"
      style={{
        position: 'relative',
        zIndex: 50,
        backgroundColor: '#050608',
        borderBottom: '1px solid #1c1e24',
        padding: '10px 16px',
        userSelect: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        }}
      >
        <StarIcon size={12} color="#FBDC6A" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)',
            letterSpacing: '0.06em',
            fontWeight: 500,
            color: '#D4CFC7',
            textTransform: 'none',
            lineHeight: 1.4,
          }}
        >
          {message}
        </span>
        <StarIcon size={12} color="#FBDC6A" style={{ flexShrink: 0 }} />
      </div>
    </aside>
  );
};

export default PromoBar;

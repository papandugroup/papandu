import React from 'react';

interface StarIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

export const StarIcon: React.FC<StarIconProps> = ({
  size = 20,
  color = 'currentColor',
  className = '',
  filled = true,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={filled ? '0' : '1.5'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >

      {/* Precision 4-point faceted streetwear star */}
      <path d="M12 0L14.2 8.8L23 11L14.2 13.2L12 22L9.8 13.2L1 11L9.8 8.8L12 0Z" />
    </svg>
  );
};

export default StarIcon;


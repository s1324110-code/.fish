import { CSSProperties } from 'react';

type Props = {
  x: number;
  y: number;
  size: number;
  facingRight: boolean;
  stage: number;
  revealed: boolean;
};

export default function Fish({ x, y, size, facingRight, stage, revealed }: Props) {
  const style: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    transform: `scaleX(${facingRight ? 1 : -1})`,
    opacity: stage >= 3 ? 0.75 : 1,
  };

  return (
    <div className="fish" style={style}>
      {revealed ? (
        <svg viewBox="0 0 120 80" className="fish-svg human">
          <circle cx="40" cy="24" r="10" />
          <path d="M40 35 L40 62 M20 50 L60 50 M30 78 L40 62 L50 78" />
        </svg>
      ) : (
        <svg viewBox="0 0 120 80" className="fish-svg">
          <ellipse cx="52" cy="40" rx="34" ry="18" />
          <path d="M83 40 L112 20 L112 60 Z" />
          <circle cx="38" cy="36" r="2.5" />
          <path d="M20 40 C26 44, 28 48, 36 50" />
        </svg>
      )}
    </div>
  );
}

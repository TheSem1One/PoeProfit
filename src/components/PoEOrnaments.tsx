import React from 'react';

export const PoESeparator: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div className={`poe-separator-container ${className}`} style={style}>
      <svg className="poe-separator-svg" viewBox="0 0 500 16" fill="none" preserveAspectRatio="none">
        {/* Left wing */}
        <line x1="0" y1="8" x2="215" y2="8" stroke="url(#poeLineGradLeft)" strokeWidth="1.2" />
        <circle cx="215" cy="8" r="1.5" fill="#af8040" />
        {/* Diamond ornament in center */}
        <path d="M250 2 L256 8 L250 14 L244 8 Z" fill="#20180f" stroke="#c8995a" strokeWidth="1.2" />
        <path d="M250 5 L253 8 L250 11 L247 8 Z" fill="#ffd782" />
        {/* Left inner flourishes */}
        <path d="M225 8 C232 5, 238 6, 243 8" stroke="#8c6833" strokeWidth="1" fill="none" />
        {/* Right inner flourishes */}
        <path d="M275 8 C268 5, 262 6, 257 8" stroke="#8c6833" strokeWidth="1" fill="none" />
        {/* Right wing */}
        <circle cx="285" cy="8" r="1.5" fill="#af8040" />
        <line x1="285" y1="8" x2="500" y2="8" stroke="url(#poeLineGradRight)" strokeWidth="1.2" />
        {/* Gradients */}
        <defs>
          <linearGradient id="poeLineGradLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#af8040" stopOpacity="0" />
            <stop offset="60%" stopColor="#7a5a29" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c8995a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="poeLineGradRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8995a" stopOpacity="1" />
            <stop offset="40%" stopColor="#7a5a29" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#af8040" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const PoECornerBracket: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const getTransform = () => {
    switch (position) {
      case 'tr': return 'scaleX(-1)';
      case 'bl': return 'scaleY(-1)';
      case 'br': return 'scale(-1, -1)';
      default: return 'none';
    }
  };

  return (
    <div className={`poe-corner-bracket poe-corner-${position}`} style={{ transform: getTransform() }}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M1 19 V4 C1 2.34 2.34 1 4 1 H19" stroke="#9e7436" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 6 V4 H6" stroke="#ffd280" strokeWidth="1.2" />
        <rect x="2" y="2" width="2.5" height="2.5" fill="#e6b359" />
      </svg>
    </div>
  );
};

export const PoEEmblemIcon: React.FC = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      {/* Outer gear / sun spike circle */}
      <circle cx="16" cy="16" r="14" stroke="#7e5c26" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="16" cy="16" r="11" fill="url(#emblemInnerGrad)" stroke="#cda059" strokeWidth="1.5" />
      {/* Center chaos / kalandra diamond star */}
      <polygon points="16,6 18.5,13.5 26,16 18.5,18.5 16,26 13.5,18.5 6,16 13.5,13.5" fill="url(#emblemStarGrad)" stroke="#533c16" strokeWidth="0.8" />
      <circle cx="16" cy="16" r="2.5" fill="#fff4cf" />
      <defs>
        <radialGradient id="emblemInnerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3d2912" />
          <stop offset="100%" stopColor="#120e0a" />
        </radialGradient>
        <linearGradient id="emblemStarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd885" />
          <stop offset="100%" stopColor="#ab772a" />
        </linearGradient>
      </defs>
    </svg>
  );
};

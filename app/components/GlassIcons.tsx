"use client";

import React from 'react';
import './GlassIcons.css';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
  /* Added locally: these tiles navigate to Discord and LinkedIn, so they have
     to be anchors. A <button> here would not be announced as a link and could
     not be opened in a new tab. */
  href?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 40%))'
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target={item.href ? '_blank' : undefined}
          rel={item.href ? 'noopener noreferrer' : undefined}
          className={`icon-btn ${item.customClass || ''}`}
          aria-label={item.label}
        >
          <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default GlassIcons;

import React from 'react';

// Line icon in the same style as lucide-react, so it accepts the same props.
export function BearCub({ size = 24, strokeWidth = 2, className, style, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      <path d="M5.38 9.48A2.8 2.8 0 1 1 8.93 6.16" />
      <path d="M18.62 9.48A2.8 2.8 0 1 0 15.07 6.16" />
      <circle cx="12" cy="13" r="7.5" />
      <ellipse cx="12" cy="15.8" rx="3.1" ry="2.4" />
      <path d="M10.9 17.1q1.1.7 2.2 0" />
      <ellipse cx="12" cy="14.8" rx="1.05" ry=".7" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="11.6" r=".95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11.6" r=".95" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({ light = false }) {
  return (
    <a href="/" className={`logo${light ? ' logo--light' : ''}`} aria-label="Cozy Cubs Australia home">
      <span className="logo__mark">
        <BearCub size={28} strokeWidth={1.8} />
      </span>
      <span>
        <span className="logo__name">Cozy Cubs</span>
        <span className="logo__tag">Custom Bedding Studio</span>
      </span>
    </a>
  );
}

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ocozycubso',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z'
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/cozycubsau/',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z'
  }
];

export function SocialLinks({ size = 17 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
      {SOCIALS.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ display: 'inline-flex' }}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </span>
  );
}

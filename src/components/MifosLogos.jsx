import React from 'react';

// Exact stylized Mifos X Logo (Green and Cyan/Blue X mark on top-left)
export function MifosXIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left green triangle/chevron */}
      <path d="M6 8L20 20L6 32V24L12 20L6 16V8Z" fill="#78be20" />
      {/* Right cyan/blue triangle/chevron */}
      <path d="M34 8L20 20L34 32V24L28 20L34 16V8Z" fill="#0071bc" />
    </svg>
  );
}

// Center Big Mifos Logo with Segmented Globe Icon (Exact match to screenshot)
export function MifosBigLogo({ className = "h-28" }) {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full max-w-full">
        {/* "Mifos" text */}
        <text 
          x="10" 
          y="72" 
          fontFamily="'Inter', 'Open Sans', -apple-system, sans-serif" 
          fontSize="68" 
          fontWeight="400" 
          fill="#4a4a4a" 
          letterSpacing="-1px"
        >
          Mifos
        </text>

        {/* Segmented Globe */}
        <g transform="translate(195, 10)">
          {/* Outer circle / Globe clipping */}
          <mask id="globe-mask">
            <circle cx="40" cy="40" r="38" fill="#ffffff" />
          </mask>
          
          <g mask="url(#globe-mask)">
            {/* Top-Right Green quadrant */}
            <path d="M40 40 L40 0 A40 40 0 0 1 80 40 Z" fill="#78be20" />
            {/* Top-Left Lime quadrant */}
            <path d="M40 40 L0 40 A40 40 0 0 1 40 0 Z" fill="#95d600" />
            {/* Bottom-Right Dark Blue quadrant */}
            <path d="M40 40 L80 40 A40 40 0 0 1 40 80 Z" fill="#005a9c" />
            {/* Bottom-Left Cyan/Blue quadrant */}
            <path d="M40 40 L40 80 A40 40 0 0 1 0 40 Z" fill="#0071bc" />
            
            {/* White curved meridian lines */}
            <path d="M-5 40 Q40 20 85 40" stroke="#ffffff" strokeWidth="4.5" fill="none" />
            <path d="M-5 40 Q40 60 85 40" stroke="#ffffff" strokeWidth="4.5" fill="none" />
            <path d="M40 -5 Q20 40 40 85" stroke="#ffffff" strokeWidth="4.5" fill="none" />
            <path d="M40 -5 Q60 40 40 85" stroke="#ffffff" strokeWidth="4.5" fill="none" />
            <line x1="40" y1="-5" x2="40" y2="85" stroke="#ffffff" strokeWidth="4" />
            <line x1="-5" y1="40" x2="85" y2="40" stroke="#ffffff" strokeWidth="4" />
          </g>

          {/* Registered trademark symbol ® */}
          <text 
            x="81" 
            y="12" 
            fontFamily="'Inter', sans-serif" 
            fontSize="12" 
            fontWeight="bold" 
            fill="#555555"
          >
            ®
          </text>
        </g>
      </svg>
    </div>
  );
}

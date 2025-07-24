import React from 'react';

interface PetPawLogoProps {
  className?: string;
  size?: number;
}

export default function PetPawLogo({ className = "w-6 h-6", size }: PetPawLogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      width={size}
      height={size}
    >
      <path d="M12 2C12.5523 2 13 2.44772 13 3V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V3C11 2.44772 11.4477 2 12 2Z" />
      <path d="M8.5 3.5C9.32843 3.5 10 4.17157 10 5C10 5.82843 9.32843 6.5 8.5 6.5C7.67157 6.5 7 5.82843 7 5C7 4.17157 7.67157 3.5 8.5 3.5Z" />
      <path d="M15.5 3.5C16.3284 3.5 17 4.17157 17 5C17 5.82843 16.3284 6.5 15.5 6.5C14.6716 6.5 14 5.82843 14 5C14 4.17157 14.6716 3.5 15.5 3.5Z" />
      <path d="M6 7.5C6.82843 7.5 7.5 8.17157 7.5 9C7.5 9.82843 6.82843 10.5 6 10.5C5.17157 10.5 4.5 9.82843 4.5 9C4.5 8.17157 5.17157 7.5 6 7.5Z" />
      <path d="M18 7.5C18.8284 7.5 19.5 8.17157 19.5 9C19.5 9.82843 18.8284 10.5 18 10.5C17.1716 10.5 16.5 9.82843 16.5 9C16.5 8.17157 17.1716 7.5 18 7.5Z" />
      <path d="M12 8C14.7614 8 17 10.2386 17 13C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13C7 10.2386 9.23858 8 12 8Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

// Alternative simpler paw design
export function SimplePawLogo({ className = "w-6 h-6", size }: PetPawLogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      width={size}
      height={size}
    >
      {/* Main pad */}
      <ellipse cx="12" cy="16" rx="4" ry="3.5" />
      
      {/* Top left toe */}
      <ellipse cx="8" cy="9" rx="1.5" ry="2" transform="rotate(-15 8 9)" />
      
      {/* Top center toe */}
      <ellipse cx="12" cy="7" rx="1.5" ry="2.5" />
      
      {/* Top right toe */}
      <ellipse cx="16" cy="9" rx="1.5" ry="2" transform="rotate(15 16 9)" />
      
      {/* Left side toe */}
      <ellipse cx="6.5" cy="12.5" rx="1.2" ry="1.8" transform="rotate(-30 6.5 12.5)" />
      
      {/* Right side toe (thumb) */}
      <ellipse cx="17.5" cy="12.5" rx="1.2" ry="1.8" transform="rotate(30 17.5 12.5)" />
    </svg>
  );
}

// Veterinary themed logo with stethoscope + paw
export function VetPawLogo({ className = "w-6 h-6", size }: PetPawLogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      width={size}
      height={size}
    >
      {/* Stethoscope circle */}
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Stethoscope tube */}
      <path d="M10 8C10 8 12 10 14 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Paw print */}
      <ellipse cx="16" cy="18" rx="2.5" ry="2" />
      <ellipse cx="13" cy="14" rx="1" ry="1.5" />
      <ellipse cx="16" cy="13" rx="1" ry="1.5" />
      <ellipse cx="19" cy="14" rx="1" ry="1.5" />
      <ellipse cx="11.5" cy="16.5" rx="0.8" ry="1.2" />
      <ellipse cx="20.5" cy="16.5" rx="0.8" ry="1.2" />
    </svg>
  );
}

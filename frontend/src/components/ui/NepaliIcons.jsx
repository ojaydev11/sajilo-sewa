import React from 'react'

// Mountain illustration for hero section
export const MountainIllustration = ({ className = "w-full h-32" }) => (
  <svg className={className} viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e3f2fd" />
        <stop offset="50%" stopColor="#bbdefb" />
        <stop offset="100%" stopColor="#90caf9" />
      </linearGradient>
      <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e8eaf6" />
        <stop offset="100%" stopColor="#c5cae9" />
      </linearGradient>
    </defs>
    
    {/* Sky background */}
    <rect width="400" height="120" fill="url(#skyGradient)" />
    
    {/* Mountains */}
    <path d="M0 80 L60 30 L120 60 L180 20 L240 50 L300 25 L360 45 L400 35 L400 120 L0 120 Z" 
          fill="url(#mountainGradient)" stroke="none" />
    
    {/* Snow caps */}
    <path d="M55 30 L65 30 L60 25 Z" fill="#ffffff" />
    <path d="M175 20 L185 20 L180 15 Z" fill="#ffffff" />
    <path d="M295 25 L305 25 L300 20 Z" fill="#ffffff" />
    
    {/* Clouds */}
    <ellipse cx="80" cy="25" rx="15" ry="8" fill="#ffffff" opacity="0.8" />
    <ellipse cx="320" cy="30" rx="20" ry="10" fill="#ffffff" opacity="0.7" />
  </svg>
)

// Boudhanath Stupa illustration
export const BoudhanathIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stupaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff9c4" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <rect x="8" y="32" width="32" height="8" rx="2" fill="url(#stupaGradient)" />
    
    {/* Main dome */}
    <ellipse cx="24" cy="28" rx="16" ry="12" fill="url(#stupaGradient)" />
    
    {/* Spire base */}
    <rect x="20" y="16" width="8" height="12" rx="1" fill="#f59e0b" />
    
    {/* Spire levels */}
    <rect x="18" y="14" width="12" height="3" rx="1" fill="#d97706" />
    <rect x="19" y="11" width="10" height="3" rx="1" fill="#d97706" />
    <rect x="20" y="8" width="8" height="3" rx="1" fill="#d97706" />
    
    {/* Top ornament */}
    <circle cx="24" cy="6" r="3" fill="#dc2626" />
    <circle cx="24" cy="6" r="1" fill="#ffffff" />
    
    {/* Eyes */}
    <path d="M16 24 Q20 20 24 24 Q28 20 32 24" stroke="#1f2937" strokeWidth="2" fill="none" />
    <circle cx="18" cy="22" r="1" fill="#1f2937" />
    <circle cx="30" cy="22" r="1" fill="#1f2937" />
  </svg>
)

// Swayambhunath (Monkey Temple) illustration
export const SwayambhunathIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="templeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    
    {/* Temple base */}
    <rect x="10" y="30" width="28" height="10" rx="2" fill="url(#templeGradient)" />
    
    {/* Temple body */}
    <path d="M12 30 L24 18 L36 30 Z" fill="url(#templeGradient)" />
    
    {/* Spire */}
    <rect x="22" y="8" width="4" height="10" fill="#d97706" />
    
    {/* Prayer flags */}
    <path d="M8 20 L16 16 L24 20 L32 16 L40 20" stroke="#dc2626" strokeWidth="1" fill="none" />
    <path d="M8 22 L16 18 L24 22 L32 18 L40 22" stroke="#fbbf24" strokeWidth="1" fill="none" />
    <path d="M8 24 L16 20 L24 24 L32 20 L40 24" stroke="#10b981" strokeWidth="1" fill="none" />
    
    {/* Windows */}
    <rect x="18" y="24" width="4" height="4" rx="1" fill="#7c2d12" />
    <rect x="26" y="24" width="4" height="4" rx="1" fill="#7c2d12" />
  </svg>
)

// Traditional Bus icon
export const NepalieBusIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="busGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    
    {/* Bus body */}
    <rect x="6" y="16" width="36" height="20" rx="4" fill="url(#busGradient)" />
    
    {/* Windows */}
    <rect x="10" y="20" width="6" height="4" rx="1" fill="#e0f2fe" />
    <rect x="18" y="20" width="6" height="4" rx="1" fill="#e0f2fe" />
    <rect x="26" y="20" width="6" height="4" rx="1" fill="#e0f2fe" />
    <rect x="34" y="20" width="6" height="4" rx="1" fill="#e0f2fe" />
    
    {/* Wheels */}
    <circle cx="14" cy="38" r="4" fill="#374151" />
    <circle cx="34" cy="38" r="4" fill="#374151" />
    <circle cx="14" cy="38" r="2" fill="#6b7280" />
    <circle cx="34" cy="38" r="2" fill="#6b7280" />
    
    {/* Decorative elements */}
    <rect x="8" y="28" width="32" height="2" fill="#fbbf24" />
    <rect x="20" y="12" width="8" height="4" rx="2" fill="#dc2626" />
  </svg>
)

// Service category icons with Nepali styling
export const ServiceIcons = {
  Plumber: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.36 9L12 2.64 5.64 9 12 15.36 18.36 9Z" fill="#3b82f6" />
      <path d="M12 4L8 8H16L12 4Z" fill="#1d4ed8" />
      <rect x="10" y="12" width="4" height="8" rx="1" fill="#6b7280" />
      <circle cx="12" cy="18" r="2" fill="#3b82f6" />
    </svg>
  ),
  
  Electrician: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
      <path d="M13 2L8 8H12L11 14L16 8H12L13 2Z" fill="#fff9c4" />
    </svg>
  ),
  
  Cleaner: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="6" fill="#10b981" opacity="0.2" />
      <path d="M6 12L12 6L18 12" stroke="#10b981" strokeWidth="2" fill="none" />
      <rect x="10" y="12" width="4" height="8" rx="1" fill="#6b7280" />
      <path d="M8 20L16 20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  
  Tutor: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="12" rx="2" fill="#f59e0b" />
      <rect x="5" y="5" width="14" height="10" rx="1" fill="#fff9c4" />
      <path d="M8 8L16 8" stroke="#f59e0b" strokeWidth="1" />
      <path d="M8 10L14 10" stroke="#f59e0b" strokeWidth="1" />
      <path d="M8 12L12 12" stroke="#f59e0b" strokeWidth="1" />
      <rect x="2" y="18" width="20" height="2" rx="1" fill="#d97706" />
    </svg>
  ),
  
  Mechanic: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3L16.1 7.7L19.4 4.4L18 3L14.7 6.3Z" fill="#6b7280" />
      <circle cx="9" cy="15" r="6" fill="#3b82f6" opacity="0.2" />
      <path d="M15 9L9 15" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="9" cy="15" r="3" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <path d="M12 18L6 12" stroke="#6b7280" strokeWidth="2" />
    </svg>
  ),
  
  Handyman: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="18" height="3" rx="1" fill="#8b5cf6" />
      <circle cx="6" cy="13.5" r="1" fill="#ffffff" />
      <path d="M12 4L14 12L10 12L12 4Z" fill="#6b7280" />
      <rect x="11" y="2" width="2" height="4" rx="1" fill="#8b5cf6" />
    </svg>
  )
}
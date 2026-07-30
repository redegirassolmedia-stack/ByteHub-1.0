import React, { useState, useEffect } from 'react';

const DEFAULT_LOGO_URL = '/girassol_logo.png';

interface GirassolLogoProps {
  variant?: 'full' | 'icon' | 'white-text';
  className?: string;
  height?: number | string;
}

export const GirassolLogo: React.FC<GirassolLogoProps> = ({
  variant = 'full',
  className = 'h-10',
  height
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    return localStorage.getItem('girassol_custom_logo') || DEFAULT_LOGO_URL;
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      const customLogo = localStorage.getItem('girassol_custom_logo');
      setLogoSrc(customLogo || DEFAULT_LOGO_URL);
    };

    window.addEventListener('girassol_logo_updated', handleLogoUpdate);
    window.addEventListener('storage', handleLogoUpdate);
    return () => {
      window.removeEventListener('girassol_logo_updated', handleLogoUpdate);
      window.removeEventListener('storage', handleLogoUpdate);
    };
  }, []);

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`} style={height ? { height } : undefined}>
      <img
        src={logoSrc}
        alt="Rede Girassol"
        className={`h-full w-auto object-contain ${
          variant === 'white-text'
            ? 'bg-white p-1 rounded-xl shadow-2xs border border-slate-200/50'
            : ''
        }`}
      />
    </div>
  );
};



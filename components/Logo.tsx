'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
}

const sizeMap = {
  sm: { width: 100, height: 30 },
  md: { width: 150, height: 45 },
  lg: { width: 200, height: 60 },
  xl: { width: 250, height: 75 },
};

export const Logo = ({ size = 'md' }: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const logoSrc = isDark ? '/vendora_logo.png' : '/vendora-logo.png';
  const dimensions = sizeMap[size];

  return (
    <div className="relative">
      <Image
        src={logoSrc}
        alt="Vendora Logo"
        width={dimensions.width}
        height={dimensions.height}
        priority
      />
    </div>
  );
};

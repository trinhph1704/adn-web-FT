import React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 240, height = 240, className = '' }) => (
  <img
    src="src/assets/logo.png" // vi du 
    alt="AquaShop Logo"
    width={width}
    height={height}
    className={className}
    style={{ objectFit: 'contain' }}
    draggable={false}
  />
);

export default Logo;
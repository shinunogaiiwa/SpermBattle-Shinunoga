'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SpermProps {
  delay: number;
  duration: number;
  tailDuration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  opacity: number;
}

const Sperm: React.FC<SpermProps> = ({
  delay,
  duration,
  tailDuration,
  startX,
  startY,
  endX,
  endY,
  size,
  opacity,
}) => {
  const [isPoked, setIsPoked] = useState(false);
  const [pokePosition, setPokePosition] = useState({ x: 0, y: 0 });

  const handlePoke = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Calculate escape direction (away from click)
    const randomAngle = Math.random() * Math.PI * 2;
    const escapeDistance = 200 + Math.random() * 300;
    
    setPokePosition({
      x: Math.cos(randomAngle) * escapeDistance,
      y: Math.sin(randomAngle) * escapeDistance,
    });
    
    setIsPoked(true);
    
    // Reset after animation
    setTimeout(() => {
      setIsPoked(false);
    }, 800);
  };

  const pathVariants = {
    initial: {
      x: startX,
      y: startY,
      rotate: 0,
      scale: 0,
    },
    animate: isPoked ? {
      x: startX + pokePosition.x,
      y: startY + pokePosition.y,
      rotate: Math.random() * 360,
      scale: [1, 1.5, 0.8, 1],
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    } : {
      x: [startX, endX, startX],
      y: [startY, endY, startY],
      rotate: [0, 360, 720],
      scale: [0, 1, 0],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      variants={pathVariants}
      initial="initial"
      animate="animate"
      style={{ 
        opacity: isPoked ? 0.8 : opacity,
        pointerEvents: 'auto',
      }}
      onClick={handlePoke}
      onTouchStart={handlePoke}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Sperm head */}
        <ellipse
          cx="30"
          cy="30"
          rx="20"
          ry="25"
          fill={`url(#gradient-${startX}-${startY})`}
          opacity="0.6"
        />
        {/* Sperm tail */}
        <motion.path
          d="M 30 55 Q 40 70, 30 85 Q 20 100, 10 115"
          stroke={`url(#gradient-${startX}-${startY})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          animate={isPoked ? {
            d: [
              'M 30 55 Q 40 70, 30 85 Q 20 100, 10 115',
              'M 30 55 Q 50 60, 45 75 Q 60 90, 70 105',
              'M 30 55 Q 10 60, 15 75 Q 5 90, -5 105',
              'M 30 55 Q 40 70, 30 85 Q 20 100, 10 115',
            ],
          } : {
            d: [
              'M 30 55 Q 40 70, 30 85 Q 20 100, 10 115',
              'M 30 55 Q 20 70, 30 85 Q 40 100, 50 115',
              'M 30 55 Q 40 70, 30 85 Q 20 100, 10 115',
            ],
          }}
          transition={{
            duration: isPoked ? 0.4 : tailDuration,
            repeat: isPoked ? 2 : Infinity,
            ease: 'easeInOut',
          }}
        />
        <defs>
          <linearGradient id={`gradient-${startX}-${startY}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPoked ? "#39FF14" : "#FF5744"} />
            <stop offset="100%" stopColor={isPoked ? "#00FF00" : "#E84A3D"} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Poke effect */}
      {isPoked && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-green-400" />
        </motion.div>
      )}
    </motion.div>
  );
};

interface FloatingSpermProps {
  visible?: boolean;
  density?: number; // 1-50
  speed?: number; // 0.1-3 (multiplier)
}

export const FloatingSperm: React.FC<FloatingSpermProps> = ({
  visible = true,
  density = 15,
  speed = 1,
}) => {
  if (!visible) return null;

  const count = Math.max(1, Math.min(50, density));
  
  // Base duration inversely proportional to speed
  const baseDuration = 10;
  const randomRange = 10;
  
  const sperms = Array.from({ length: count }, (_, i) => {
    const moveDuration = (baseDuration + Math.random() * randomRange) / speed;
    const tailDuration = (2 + Math.random() * 1) / speed;
    
    return {
      id: i,
      delay: Math.random() * 3,
      duration: moveDuration,
      tailDuration: tailDuration,
      startX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      startY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      endX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      endY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      size: 30 + Math.random() * 40,
      opacity: 0.1 + Math.random() * 0.2,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden z-[5]" style={{ pointerEvents: 'none' }}>
      {sperms.map((sperm) => (
        <Sperm key={sperm.id} {...sperm} />
      ))}
    </div>
  );
};


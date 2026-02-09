'use client';

import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: 'sm' | 'md' | 'lg';
  opacity: number;
  animationDuration: string;
  animationDelay: string;
}

interface ShootingStar {
  id: number;
  top: string;
  left: string;
  angle: number;
  delay: number;
}

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    // Generate static stars
    const starCount = 100;
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as 'sm' | 'md' | 'lg',
      opacity: Math.random() * 0.7 + 0.3,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setStars(newStars);

    // Shooting star effect
    const interval = setInterval(() => {
      const id = Date.now();
      setShootingStars(prev => [
        ...prev,
        {
          id,
          top: `${Math.random() * 60}%`, // Start from upper part
          left: `${Math.random() * 100}%`,
          angle: Math.random() * 45 + 135, // Angle between 135 and 180 degrees
          delay: 0,
        }
      ]);

      // Remove old shooting stars
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 2000);

    }, 4000); // New shooting star every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white select-none`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size === 'sm' ? '1px' : star.size === 'md' ? '2px' : '3px',
            height: star.size === 'sm' ? '1px' : star.size === 'md' ? '2px' : '3px',
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration} ease-in-out infinite`,
            animationDelay: star.animationDelay,
            boxShadow: star.size === 'lg' ? '0 0 4px rgba(255, 255, 255, 0.8)' : 'none',
          }}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: star.top,
            left: star.left,
            width: '100px',
            transform: `rotate(${star.angle}deg) translateX(-100px)`,
            animation: 'shooting-star 1.5s linear forwards',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shooting-star {
          0% { transform: rotate(45deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: rotate(45deg) translateX(500px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

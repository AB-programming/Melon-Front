import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { ThumbsUp } from 'lucide-react';
import {numberDisplay} from '@/utils/conversion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Props {
  isLike: boolean;
  number: number;
  onPress: () => Promise<boolean> | boolean;
  disabled?: boolean
  className?: string
}

export function ThumbsUpButton({isLike, number, onPress, disabled = false, className = ""} : Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2, // 重力效果
            life: particle.life - 0.02,
          }))
          .filter((particle) => particle.life > 0),
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  async function handleLike() {
    if (disabled || isLoading) return
    setIsLoading(true)
    try {
      const result = await onPress()
      if (result) {
        setIsAnimating(true)
        if (!isLike) {
          createFireworks()
        }
        setTimeout(() => setIsAnimating(false), 300)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const createFireworks = () => {
    const newParticles: Particle[] = [];
    const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#feca57',
      '#ff9ff3',
    ];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  };

  return (
    <div className="relative">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `${particle.x + 50}px`,
            top: `${particle.y + 20}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            transition: 'all 0.016s linear',
          }}
        />
      ))}

      <Button
        onPress={handleLike}
        disabled={disabled || isLoading}
        className={`
          w-24 flex justify-center items-center gap-2 
          transition-all duration-300 ease-out
          ${
          isLike
            ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-md"
        }
          ${isAnimating ? "scale-110 shadow-xl" : "scale-100"}
          ${!disabled && !isLoading ? "hover:scale-105 active:scale-95" : ""}
          ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""}
          rounded-full font-medium
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </>
        ) : (
          <>
            <ThumbsUp
              size={18}
              className={`transition-all duration-300 ${
                isLike ? "fill-white text-white" : "text-gray-600"
              } ${isAnimating ? "rotate-12" : "rotate-0"}`}
            />
            <span className="text-sm font-medium">{numberDisplay(number)}</span>
          </>
        )}
      </Button>
    </div>
  );
}

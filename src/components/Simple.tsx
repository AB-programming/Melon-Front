'use client';

import confetti from 'canvas-confetti';
import { Button } from "@heroui/react";

export function Simple() {
  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Button
        color="secondary"
        onPress={handleClick}
        className="rounded-full hover:-translate-y-1 px-12 shadow-xl after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
      >
        Click me!
      </Button>
    </div>
  );
}

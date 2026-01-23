"use client";

import { useEffect, useRef } from "react";
import { type ReactElement } from "react";

type SoundEffect = "hover" | "click" | "typing" | "success" | "error" | "whoosh";

const soundEffects: Record<SoundEffect, string> = {
  hover: "/sounds/hover.mp3",
  click: "/sounds/click.mp3",
  typing: "/sounds/typing.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  whoosh: "/sounds/whoosh.mp3",
};

interface UseSoundProps {
  effect?: SoundEffect;
  enabled?: boolean;
  volume?: number;
}

export function useSound({ effect = "click", enabled = true, volume = 0.3 }: UseSoundProps = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Create audio element
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [enabled, volume]);

  const play = (customEffect?: SoundEffect) => {
    if (!enabled || !audioRef.current) return;

    const effectToPlay = customEffect || effect;
    const soundUrl = soundEffects[effectToPlay];

    if (soundUrl) {
      audioRef.current.src = soundUrl;
      audioRef.current.play().catch(() => {
        // Ignore errors (sound files might not exist)
      });
    }
  };

  return { play };
}

// Component for adding sound to elements
export function SoundWrapper({ children, sound = "hover", enabled = true }: {
  children: React.ReactNode;
  sound?: SoundEffect;
  enabled?: boolean;
}) {
  const { play } = useSound({ effect: sound, enabled });

  const handleMouseEnter = () => {
    if (sound === "hover") play();
  };

  const handleClick = () => {
    if (sound === "click") play();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}

// Keyboard shortcut sound
export function useKeyboardSound(enabled = true) {
  const { play } = useSound({ effect: "typing", enabled });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = () => {
      play();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, play]);
}

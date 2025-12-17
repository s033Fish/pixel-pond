import { useEffect, useRef, useState } from "react";

interface FishingProps {
  isVisible: boolean;
  onComplete: (success: boolean) => void;
}

export function Fishing({ isVisible, onComplete }: FishingProps) {
  if (!isVisible) return null;

  // --------------------
  // CONSTANTS
  // --------------------
  const containerHeight = 300;
  const barHeight = 80;
  const fishSize = 20;

  // --------------------
  // REFS (GAME STATE)
  // --------------------
  const fishY = useRef(200);
  const fishVelocity = useRef(0);

  const barY = useRef(140);
  const holding = useRef(false);

  const progress = useRef(5);
  const finished = useRef(false);

  // --------------------
  // STATE (UI ONLY)
  // --------------------
  const [progressUI, setProgressUI] = useState(5);

  // --------------------
  // DOM REFS
  // --------------------
  const fishEl = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLDivElement>(null);

  // --------------------
  // RESET ON START
  // --------------------
  useEffect(() => {
    fishY.current = 200;
    fishVelocity.current = 0;
    barY.current = 140;
    progress.current = 5;
    finished.current = false;

    setProgressUI(5);

    if (fishEl.current) {
      fishEl.current.style.transform = `translateY(${fishY.current}px)`;
    }
    if (barEl.current) {
      barEl.current.style.transform = `translateY(${barY.current}px)`;
    }
  }, [isVisible]);

  // --------------------
  // SPACEBAR CONTROL
  // --------------------
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") holding.current = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") holding.current = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // --------------------
  // GAME LOOP
  // --------------------
  useEffect(() => {
    let last = performance.now();
    let frame = 0;

    const loop = (t: number) => {
      const dt = (t - last) / 16;
      last = t;

      if (!finished.current) {
        // --------------------
        // FISH MOVEMENT
        // --------------------
        fishVelocity.current += (Math.random() - 0.5) * 0.4;
        fishVelocity.current = Math.max(
          Math.min(fishVelocity.current, 2),
          -2
        );

        fishY.current += fishVelocity.current;
        fishY.current = Math.max(
          0,
          Math.min(fishY.current, containerHeight - fishSize)
        );

        // --------------------
        // BAR MOVEMENT
        // --------------------
        barY.current += holding.current ? -3 : 1;
        barY.current = Math.max(
          0,
          Math.min(barY.current, containerHeight - barHeight)
        );

        // --------------------
        // APPLY TRANSFORMS
        // --------------------
        fishEl.current!.style.transform = `translateY(${fishY.current}px)`;
        barEl.current!.style.transform = `translateY(${barY.current}px)`;

        // --------------------
        // PROGRESS CHECK
        // --------------------
        const fishBottom = fishY.current + fishSize;
        const barBottom = barY.current + barHeight;

        const inside =
          fishY.current >= barY.current &&
          fishBottom <= barBottom;

        progress.current += inside ? 0.6 * dt : -0.5 * dt;
        progress.current = Math.max(0, Math.min(100, progress.current));

        // --------------------
        // THROTTLED UI UPDATE
        // --------------------
        frame++;
        if (frame % 5 === 0) {
          setProgressUI(progress.current);
        }

        // --------------------
        // END CONDITIONS
        // --------------------
        if (progress.current >= 100) {
          finished.current = true;
          onComplete(true);
          return;
        }

        if (progress.current <= 0) {
          finished.current = true;
          onComplete(false);
          return;
        }
      }

      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  // --------------------
  // RENDER
  // --------------------
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="flex gap-6 p-6 items-center">
        {/* Fishing Tube */}
        <div
          className="relative bg-blue-200 border-4 border-yellow-700 rounded-xl overflow-hidden"
          style={{ width: 90, height: containerHeight }}
        >
          {/* Player Bar */}
          <div
            ref={barEl}
            className="absolute left-2 w-12 bg-green-400 rounded-md opacity-80"
            style={{
              height: barHeight,
              willChange: "transform",
            }}
          />

          {/* Fish */}
          <div
            ref={fishEl}
            className="absolute left-[50px] w-5 h-5 bg-blue-500 rounded-full border border-black"
            style={{
              willChange: "transform",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Progress Bar */}
        <div
          className="relative w-6 bg-gray-300 border border-black rounded-xl"
          style={{ height: containerHeight }}
        >
          <div
            className="absolute bottom-0 w-full bg-green-500"
            style={{ height: `${progressUI}%` }}
          />
        </div>
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FishingProps {
  isVisible: boolean;
  onComplete: (success: boolean) => void;
}

const SPECIES_NAMES: Record<string, string> = {
  pufferfish: 'Pufferfish',
  goldfish: 'Goldfish',
  tetra: 'Neon Tetra',
};

export function Fishing({ isVisible, onComplete }: FishingProps) {
  if (!isVisible) return null;

  // ----- FISH POSITION -----
  const [fishY, setFishY] = useState(200); // px from top
  const fishYRef = useRef(fishY);
  const fishVelocityRef = useRef(0);

  // ----- PLAYER BAR -----
  const barHeight = 80; // green bar size
  const containerHeight = 300;
  const [barY, setBarY] = useState(140);
  const barYRef = useRef(barY);
  const holdingRef = useRef(false);

  // ----- CATCH METER -----
  const [progress, setProgress] = useState(5); // 0–100
  const progressRef = useRef(5);

  useEffect(() => {
    if (!isVisible) return;
  
    progressRef.current = 5;
    setProgress(5);
  
    fishVelocityRef.current = 0;
  
    setFishY(200);
    setBarY(140);
  }, [isVisible]);

  useEffect(() => {
    fishYRef.current = fishY;
  }, [fishY]);
  
  useEffect(() => {
    barYRef.current = barY;
  }, [barY]);

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (t: number) => {
      const dt = (t - lastTime) / 16; // Rough normalization
      lastTime = t;

      // --------------------------
      // CHECK FOR WIN
      // --------------------------

      if (progressRef.current >= 100) {
        onComplete(true);   // success
        return;
      }
      
      if (progressRef.current <= 0) {
        onComplete(false);  // fail
        return;
      }

      // --------------------------
      // FISH MOVEMENT (random bob)
      // --------------------------
      let vel = fishVelocityRef.current;
      vel += (Math.random() - 0.5) * 0.5; // random acceleration
      vel = Math.max(Math.min(vel, 2), -2);
      fishVelocityRef.current = vel;

      setFishY((prev) => {
        let ny = prev + vel;
        if (ny < 0) ny = 0;
        if (ny > containerHeight - 20) ny = containerHeight - 20;
        return ny;
      });

      // --------------------------
      // PLAYER BAR MOVEMENT
      // --------------------------
      setBarY((prev) => {
        let ny = prev + (holdingRef.current ? -3 : 2); // rise fast, fall slow
        if (ny < 0) ny = 0;
        if (ny > containerHeight - barHeight) ny = containerHeight - barHeight;
        return ny;
      });

      // --------------------------
      // CATCH METER
      // --------------------------
      const fishBottom = fishYRef.current + 20;
      const barBottom = barYRef.current + barHeight;

      const inside =
        fishYRef.current >= barYRef.current &&
        fishBottom <= barBottom;

      console.log(
        "Inside",
        fishYRef.current,
        barYRef.current,
        fishBottom,
        barBottom,
        inside
      );

      if (inside) {
        progressRef.current += 0.7 * dt;
      } else {
        progressRef.current -= 0.5 * dt;
      }

      progressRef.current = Math.max(0, Math.min(100, progressRef.current));
      setProgress(progressRef.current);

      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  // --------------------------
  // SPACEBAR CONTROL
  // --------------------------
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") holdingRef.current = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") holdingRef.current = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm"
      >
      <div className="flex gap-6 p-6 items-center">
        {/* Fishing bar container */}
        <div
          className="relative bg-blue-200 border-4 border-yellow-700 rounded-xl"
          style={{ width: 90, height: containerHeight }}
        >
          {/* Player green bar */}
          <div
            className="absolute left-2 w-12 bg-green-400 rounded-md opacity-80"
            style={{
              height: barHeight,
              top: barY,
              transition: "top 0.05s linear",
            }}
          />

          {/* Fish icon */}
          <div
            className="absolute left-[50px] w-6 h-6 bg-blue-500 rounded-full border border-black"
            style={{ top: fishY }}
          />
        </div>

        {/* Progress bar */}
        <div
          className="relative w-6 bg-gray-300 border border-black rounded-xl"
          style={{ height: containerHeight }}
        >
          <div
            className="absolute bottom-0 w-full bg-green-500"
            style={{ height: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

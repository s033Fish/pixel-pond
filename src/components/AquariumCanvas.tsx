import { useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Fish } from '@/types/fish';
import { updateFishBehavior } from '@/lib/fishBehavior';
import fishTankBg from '@/assets/fish-tank-bg.png';
import pufferfishImg from '@/assets/pufferfish.png';
import goldfishImg from '@/assets/goldfish.png';
import betaImg from '@/assets/betafish.png';
import tetraImg from '@/assets/tetra.png';


const FISH_TEXTURES: Record<string, string> = {
  pufferfish: pufferfishImg,
  goldfish: goldfishImg,
  beta: betaImg,
  tetra: tetraImg,
};

const FISH_SCALES: Record<string, number> = {
  pufferfish: 0.15,
  goldfish: 0.18,
  beta: 0.14,
  tetra: 0.12,
};

interface AquariumCanvasProps {
  fish: Fish[];
  onFishUpdate: (fish: Fish[]) => void;
  onFishClick: (id: string) => void;
}

export function AquariumCanvas({ fish, onFishUpdate, onFishClick }: AquariumCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const spritesRef = useRef<Map<string, PIXI.Sprite>>(new Map());
  const fishRef = useRef<Fish[]>(fish);
  const dimensionsRef = useRef({ width: window.innerWidth, height: window.innerHeight });

  // Keep fishRef in sync
  useEffect(() => {
    fishRef.current = fish;
  }, [fish]);

  // Initialize PIXI Application
  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a3a5c,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Load background
    const bgTexture = PIXI.Texture.from(fishTankBg);
    const background = new PIXI.Sprite(bgTexture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // Animation loop
    let lastTime = performance.now();
    app.ticker.add(() => {
      const now = performance.now();
      const deltaMs = now - lastTime;
      lastTime = now;

      const currentFish = fishRef.current;
      if (currentFish.length === 0) return;

      const updatedFish = currentFish.map(f => 
        updateFishBehavior(f, deltaMs, dimensionsRef.current.width, dimensionsRef.current.height)
      );

      // Update sprite positions
      updatedFish.forEach(f => {
        const sprite = spritesRef.current.get(f.id);
        if (sprite) {
          sprite.x = f.x;
          sprite.y = f.y;
          
          // Flip sprite based on direction
          const facingLeft = Math.cos(f.direction) < 0;
          sprite.scale.x = facingLeft 
            ? -Math.abs(sprite.scale.x) 
            : Math.abs(sprite.scale.x);
          
          // Subtle bobbing animation
          sprite.rotation = Math.sin(now / 500 + f.x) * 0.05;
        }
      });

      fishRef.current = updatedFish;
      onFishUpdate(updatedFish);
    });

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dimensionsRef.current = { width, height };
      app.renderer.resize(width, height);
      background.width = width;
      background.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy(true, { children: true, texture: true });
      spritesRef.current.clear();
    };
  }, [onFishUpdate]);

  // Sync fish sprites with fish state
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const currentIds = new Set(fish.map(f => f.id));
    const spriteIds = new Set(spritesRef.current.keys());

    // Remove sprites for fish that no longer exist
    spriteIds.forEach(id => {
      if (!currentIds.has(id)) {
        const sprite = spritesRef.current.get(id);
        if (sprite) {
          app.stage.removeChild(sprite);
          sprite.destroy();
          spritesRef.current.delete(id);
        }
      }
    });

    // Add sprites for new fish
    fish.forEach(f => {
      if (!spritesRef.current.has(f.id)) {
        const textureUrl = FISH_TEXTURES[f.species];
        const texture = PIXI.Texture.from(textureUrl);
        const sprite = new PIXI.Sprite(texture);
        
        sprite.anchor.set(0.5);
        sprite.x = f.x;
        sprite.y = f.y;
        
        const scale = FISH_SCALES[f.species] || 0.15;
        sprite.scale.set(scale);
        
        // Enable interactivity
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.on('pointerdown', () => onFishClick(f.id));
        
        // Pixel-perfect rendering
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        
        app.stage.addChild(sprite);
        spritesRef.current.set(f.id, sprite);
      }
    });
  }, [fish, onFishClick]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 overflow-hidden"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

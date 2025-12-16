import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Fish, FISH_SPECIES, FishSpecies } from '@/types/fish';
import { createRandomPosition } from '@/lib/fishBehavior';

const STORAGE_KEY = 'aquarium-fish';

export function useFishManager(canvasWidth: number, canvasHeight: number) {
  const [fish, setFish] = useState<Fish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load fish from localStorage on mount
  useEffect(() => {
    const savedFish = localStorage.getItem(STORAGE_KEY);
    if (savedFish) {
      try {
        const parsed = JSON.parse(savedFish);
        setFish(parsed);
      } catch (e) {
        console.error('Failed to parse saved fish:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save fish to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fish));
    }
  }, [fish, isLoaded]);

  const addFish = useCallback((species?: FishSpecies) => {
    const selectedSpecies = species || FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)];
    const position = createRandomPosition(canvasWidth, canvasHeight);
    
    const newFish: Fish = {
      id: uuidv4(),
      species: selectedSpecies,
      x: position.x,
      y: position.y,
      direction: Math.random() * Math.PI * 2,
      speed: 30 + Math.random() * 50,
      state: 'moving',
      stateTimer: 1000 + Math.random() * 3000,
    };

    setFish(prev => [...prev, newFish]);
    return newFish;
  }, [canvasWidth, canvasHeight]);

  const removeFish = useCallback((id: string) => {
    setFish(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFish = useCallback((updatedFish: Fish[]) => {
    setFish(updatedFish);
  }, []);

  return {
    fish,
    addFish,
    removeFish,
    updateFish,
    isLoaded,
  };
}

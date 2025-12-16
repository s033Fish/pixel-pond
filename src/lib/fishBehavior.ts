import { Fish } from '@/types/fish';

const MIN_SPEED = 20;
const MAX_SPEED = 80;
const MIN_STATE_DURATION = 1000;
const MAX_STATE_DURATION = 4000;
const BOUNDARY_PADDING = 60;

export function updateFishBehavior(
  fish: Fish,
  deltaMs: number,
  canvasWidth: number,
  canvasHeight: number
): Fish {
  const updatedFish = { ...fish };
  
  // Update state timer
  updatedFish.stateTimer -= deltaMs;
  
  // State transition
  if (updatedFish.stateTimer <= 0) {
    if (updatedFish.state === 'idle') {
      // Start moving
      updatedFish.state = 'moving';
      updatedFish.direction = Math.random() * Math.PI * 2;
      updatedFish.speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    } else {
      // Start idling
      updatedFish.state = 'idle';
      updatedFish.speed = 0;
    }
    updatedFish.stateTimer = MIN_STATE_DURATION + Math.random() * (MAX_STATE_DURATION - MIN_STATE_DURATION);
  }
  
  // Movement
  if (updatedFish.state === 'moving') {
    const deltaSeconds = deltaMs / 1000;
    const dx = Math.cos(updatedFish.direction) * updatedFish.speed * deltaSeconds;
    const dy = Math.sin(updatedFish.direction) * updatedFish.speed * deltaSeconds;
    
    updatedFish.x += dx;
    updatedFish.y += dy;
    
    // Boundary bouncing
    const minX = BOUNDARY_PADDING;
    const maxX = canvasWidth - BOUNDARY_PADDING;
    const minY = BOUNDARY_PADDING + 40; // Account for water surface
    const maxY = canvasHeight - BOUNDARY_PADDING - 80; // Account for sand
    
    if (updatedFish.x < minX) {
      updatedFish.x = minX;
      updatedFish.direction = Math.PI - updatedFish.direction;
    }
    if (updatedFish.x > maxX) {
      updatedFish.x = maxX;
      updatedFish.direction = Math.PI - updatedFish.direction;
    }
    if (updatedFish.y < minY) {
      updatedFish.y = minY;
      updatedFish.direction = -updatedFish.direction;
    }
    if (updatedFish.y > maxY) {
      updatedFish.y = maxY;
      updatedFish.direction = -updatedFish.direction;
    }
    
    // Normalize direction
    updatedFish.direction = ((updatedFish.direction % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  }
  
  return updatedFish;
}

export function createRandomPosition(canvasWidth: number, canvasHeight: number) {
  const padding = 100;
  return {
    x: padding + Math.random() * (canvasWidth - padding * 2),
    y: padding + Math.random() * (canvasHeight - padding * 2 - 100), // Account for sand
  };
}

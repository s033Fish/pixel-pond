export interface Fish {
  id: string;
  species: 'pufferfish' | 'goldfish' | 'tetra' | 'beta';
  x: number;
  y: number;
  direction: number; // radians
  speed: number; // pixels per second
  state: 'idle' | 'moving';
  stateTimer: number; // milliseconds until next state transition
}

export type FishSpecies = Fish['species'];

export const FISH_SPECIES: FishSpecies[] = ['pufferfish', 'goldfish', 'tetra', 'beta'];

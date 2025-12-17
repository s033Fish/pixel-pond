import { useState, useCallback, useEffect } from 'react';
import { AquariumCanvas } from '@/components/AquariumCanvas';
import { AddFishButton } from '@/components/AddFishButton';
import { FishInfoToast } from '@/components/FishInfoToast';
import { HelpOverlay } from '@/components/HelpOverlay';
import { Fishing } from '@/components/Fishing';
import { useFishManager } from '@/hooks/useFishManager';
import { Fish } from '@/types/fish';

const SPECIES_NAMES: Record<string, string> = {
  pufferfish: 'Pufferfish',
  goldfish: 'Goldfish',
  beta: 'Beta Fish',
};

const Index = () => {
  const [dimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { fish, addFish, removeFish, updateFish, isLoaded } = useFishManager(dimensions.width, dimensions.height);
  const [toast, setToast] = useState<{ message: string; type: 'add' | 'remove' } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isFishing, setIsFishing] = useState(false);

  // Show help on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('pixeltank-visited');
    if (!hasVisited && isLoaded) {
      setShowHelp(true);
      localStorage.setItem('pixeltank-visited', 'true');
    }
  }, [isLoaded]);

  const handleAddFish = useCallback(() => {
    setIsFishing(true);
    // const newFish = addFish();
    // setToast({ 
    //   message: `Added a ${SPECIES_NAMES[newFish.species]}!`, 
    //   type: 'add' 
    // });
  }, []);

  const handleFishingComplete = useCallback(
    (success: boolean) => {
      setIsFishing(false);
  
      if (!success) return;
  
      const newFish = addFish();
      setToast({
        message: `Added a ${SPECIES_NAMES[newFish.species]}!`,
        type: 'add',
      });
    },
    [addFish]
  );

  const handleRemoveFish = useCallback((id: string) => {
    const fishToRemove = fish.find(f => f.id === id);
    if (fishToRemove) {
      removeFish(id);
      setToast({ 
        message: `${SPECIES_NAMES[fishToRemove.species]} swam away...`, 
        type: 'remove' 
      });
    }
  }, [fish, removeFish]);

  const handleFishUpdate = useCallback((updatedFish: Fish[]) => {
    // Only save periodically to avoid excessive localStorage writes
    // The actual state updates happen in the canvas component
  }, []);

  // Save fish state periodically
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      localStorage.setItem('aquarium-fish', JSON.stringify(fish));
    }, 5000);
    return () => clearInterval(interval);
  }, [fish, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="font-pixel text-sm text-muted-foreground animate-pulse">
          Loading aquarium...
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <AquariumCanvas 
        fish={fish} 
        onFishUpdate={handleFishUpdate}
        onFishClick={handleRemoveFish}
      />
      
      <AddFishButton onClick={handleAddFish} fishCount={fish.length} />
      
      {toast && (
        <FishInfoToast 
          message={toast.message} 
          type={toast.type}
          onComplete={() => setToast(null)}
        />
      )}

      <Fishing
        isVisible={isFishing}
        onComplete={handleFishingComplete}
      />

      <HelpOverlay 
        isVisible={showHelp} 
        onDismiss={() => setShowHelp(false)} 
      />

      {/* Title watermark */}
      <div className="fixed bottom-4 right-4 z-10">
        <span className="font-pixel text-xs text-foreground/20 select-none">
          PixelTank
        </span>
      </div>
    </main>
  );
};

export default Index;

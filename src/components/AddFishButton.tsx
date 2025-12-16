import { Plus, Fish } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddFishButtonProps {
  onClick: () => void;
  fishCount: number;
}

export function AddFishButton({ onClick, fishCount }: AddFishButtonProps) {
  return (
    <div className="fixed top-6 left-6 z-50 flex flex-col gap-3">
      <button
        onClick={onClick}
        className={cn(
          "group flex items-center gap-3 px-4 py-3",
          "bg-card/90 backdrop-blur-sm",
          "border-2 border-primary/30 rounded-lg",
          "shadow-pixel hover:shadow-pixel-hover",
          "transition-all duration-200",
          "hover:bg-card hover:border-primary/50",
          "hover:translate-y-[-2px]",
          "active:translate-y-[1px]"
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 group-hover:bg-primary/30 transition-colors">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <span className="font-pixel text-sm text-foreground">Add Fish</span>
      </button>
      
      <div className={cn(
        "flex items-center gap-2 px-4 py-2",
        "bg-card/80 backdrop-blur-sm",
        "border-2 border-border/50 rounded-lg",
        "shadow-pixel-sm"
      )}>
        <Fish className="w-4 h-4 text-accent-foreground" />
        <span className="font-pixel text-xs text-muted-foreground">
          {fishCount} {fishCount === 1 ? 'fish' : 'fish'}
        </span>
      </div>
    </div>
  );
}

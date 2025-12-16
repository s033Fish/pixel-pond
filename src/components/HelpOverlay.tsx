import { Info, MousePointerClick, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function HelpOverlay({ isVisible, onDismiss }: HelpOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div 
        className={cn(
          "max-w-md p-6 mx-4",
          "bg-card/95 backdrop-blur-md",
          "border-2 border-primary/30 rounded-xl",
          "shadow-pixel-lg",
          "animate-fade-in"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-pixel text-lg text-foreground">Welcome to PixelTank!</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/50 shrink-0">
              <Plus className="w-4 h-4 text-accent-foreground" />
            </div>
            <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
              Click the <span className="text-foreground">Add Fish</span> button to add a random fish to your tank
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/50 shrink-0">
              <MousePointerClick className="w-4 h-4 text-accent-foreground" />
            </div>
            <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
              Click on any fish to <span className="text-destructive">remove</span> it from the tank
            </p>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className={cn(
            "w-full px-4 py-3",
            "bg-primary text-primary-foreground",
            "font-pixel text-sm",
            "rounded-lg border-2 border-primary",
            "shadow-pixel hover:shadow-pixel-hover",
            "transition-all duration-200",
            "hover:translate-y-[-2px]",
            "active:translate-y-[1px]"
          )}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FishInfoToastProps {
  message: string;
  type: 'add' | 'remove';
  onComplete: () => void;
}

export function FishInfoToast({ message, type, onComplete }: FishInfoToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "px-6 py-3 rounded-lg",
        "bg-card/95 backdrop-blur-sm",
        "border-2 shadow-pixel",
        "font-pixel text-sm",
        "transition-all duration-300",
        type === 'add' ? 'border-success text-success' : 'border-destructive text-destructive',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {message}
    </div>
  );
}

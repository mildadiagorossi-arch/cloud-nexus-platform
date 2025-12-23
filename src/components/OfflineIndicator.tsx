import { useEffect, useState } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBanner(true);
        // Hide "back online" message after 3 seconds
        setTimeout(() => setShowBanner(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
        'transition-all duration-300 ease-out',
        'animate-in slide-in-from-bottom-4',
        isOnline
          ? 'bg-green-500/90 text-white backdrop-blur-sm'
          : 'bg-amber-500/90 text-white backdrop-blur-sm'
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-5 w-5" />
          <span className="font-medium">Connexion rétablie</span>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-medium">Mode hors ligne</span>
            <span className="text-xs opacity-90">Certaines fonctionnalités peuvent être limitées</span>
          </div>
        </>
      )}
      <button
        onClick={() => setShowBanner(false)}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

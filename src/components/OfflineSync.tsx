
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { offlineStorage } from '../utils/offlineStorage';

export const OfflineSync: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      syncData();
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    const queue = await offlineStorage.getSyncQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    try {
      // In a real app, you would loop through the queue and send data to your API
      // For this demo, we'll simulate a sync process
      console.log('Syncing data...', queue);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await offlineStorage.clearSyncQueue();
      console.log('Sync complete');
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!showStatus && !isSyncing) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in duration-300">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border ${
        isOnline ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
      }`}>
        {isSyncing ? (
          <RefreshCw size={16} className="animate-spin" />
        ) : isOnline ? (
          <Wifi size={16} />
        ) : (
          <WifiOff size={16} />
        )}
        <span className="text-xs font-bold uppercase tracking-wider">
          {isSyncing ? 'Syncing Progress...' : isOnline ? 'Back Online' : 'Offline Mode'}
        </span>
      </div>
    </div>
  );
};

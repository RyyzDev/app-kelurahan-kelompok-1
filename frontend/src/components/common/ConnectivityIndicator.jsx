import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConnectivityIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Permanent Small Indicator (Top Right) */}
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div
          className={`flex items-center px-2 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/10 ${
            isOnline ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
          }`}
        >
          {isOnline ? (
            <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 shadow-sm"></div>
          ) : (
            <WifiOff size={10} strokeWidth={3} className="mr-1.5" />
          )}
          <span className="text-[8px] font-black uppercase tracking-tighter">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Temporary Large Toast on Status Change */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xs px-6"
          >
            <div className={`p-4 rounded-3xl shadow-2xl border flex items-center space-x-4 ${
              isOnline ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'
            }`}>
              <div className={`p-2 rounded-xl ${isOnline ? 'bg-green-50' : 'bg-red-50'}`}>
                {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest">Koneksi {isOnline ? 'Terhubung' : 'Terputus'}</p>
                <p className="text-[10px] font-bold text-gray-400">
                  {isOnline ? 'Aplikasi siap sinkronisasi data.' : 'Aplikasi berjalan dalam mode offline.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectivityIndicator;

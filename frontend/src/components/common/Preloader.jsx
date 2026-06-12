import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-60"></div>

      <div className="relative flex flex-col items-center">
        {/* Animated Branded Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#0047AB] p-6 rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,71,171,0.5)] border-4 border-white mb-8"
        >
          <Sparkles size={64} className="text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Branded Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
            SI-<span className="text-[#0047AB]">GERCAP</span>
          </h1>
          <p className="text-[10px] font-black text-[#0047AB]/40 uppercase tracking-[0.4em] mt-1">
            Kelurahan Digital
          </p>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="mt-16 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#0047AB] to-transparent"
          />
        </div>
        
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]"
        >
          Menyelaraskan Sistem...
        </motion.p>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-12 text-center">
         <p className="text-[10px] font-bold text-gray-400">Versi 1.0.0 — Production Build</p>
      </div>
    </div>
  );
};

export default Preloader;

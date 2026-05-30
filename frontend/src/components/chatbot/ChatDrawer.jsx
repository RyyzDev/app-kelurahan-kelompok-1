import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Sparkles } from 'lucide-react';

const ChatDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo! Saya Asisten AI SI-GERCAP. Ada yang bisa saya bantu terkait layanan kelurahan hari ini?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: `Terima kasih atas pertanyaannya. Terkait "${input}", Anda dapat mengakses menu Layanan Persuratan untuk pengurusan dokumen atau menu Bansos untuk bantuan sosial. Apakah ada hal spesifik lain?`, 
        isBot: true 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Lighter blur for performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-[40px] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] z-[70] flex flex-col overflow-hidden font-sans"
            style={{ touchAction: 'none' }} // Prevents browser pull-to-refresh
          >
            {/* Handle Bar Area */}
            <div className="w-full flex justify-center py-5 shrink-0">
              <div className="w-14 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-8 pb-6 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                  <Bot size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none">Asisten AI</h3>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Online Protocol</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar"
              style={{ touchAction: 'auto' }} // Allows scrolling inside
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`flex flex-col max-w-[85%] ${msg.isBot ? 'items-start' : 'items-end'}`}>
                    <div className={`p-5 rounded-[26px] text-sm font-bold leading-relaxed shadow-sm
                      ${msg.isBot 
                        ? 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100' 
                        : 'bg-[#0047AB] text-white rounded-tr-none shadow-blue-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-black text-gray-300 uppercase mt-2 tracking-[0.1em] px-1">
                      {msg.isBot ? 'SI-GERCAP Bot' : 'Anda'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-8 pt-4 border-t border-gray-50 bg-white shrink-0 mb-safe">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan Anda..."
                  className="w-full bg-gray-50 border border-gray-100 py-5 pl-6 pr-16 rounded-[24px] focus:ring-4 focus:ring-[#0047AB]/5 focus:bg-white outline-none font-bold text-sm text-gray-700 transition-all placeholder:text-gray-300"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-3.5 bg-[#0047AB] text-white rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-90"
                >
                  <Send size={20} strokeWidth={2.5} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-2 opacity-30">
                 <Sparkles size={12} className="text-[#0047AB]" />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">AI Intelligence System</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}} />
    </AnimatePresence>
  );
};

export default ChatDrawer;

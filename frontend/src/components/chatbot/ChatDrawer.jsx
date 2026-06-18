import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChatDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo! Saya Asisten AI SI-GERCAP. Ada yang bisa saya bantu terkait layanan kelurahan hari ini?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), text: userText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Initial bot message for streaming
    const botMsgId = Date.now() + 1;
    const initialBotMsg = { id: botMsgId, text: '', isBot: true };
    setMessages(prev => [...prev, initialBotMsg]);

    try {
      const history = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        }));
      
      history.push({ role: 'user', content: userText });

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: history })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                accumulatedText += data.content;
                // Update the specific bot message with accumulated text
                setMessages(prev => prev.map(msg => 
                  msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg
                ));
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mendapatkan respon dari AI');
      console.error(err);
      // Remove the empty bot message on error
      setMessages(prev => prev.filter(msg => msg.id !== botMsgId));
    } finally {
      setIsTyping(false);
    }
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
                      {msg.isBot ? (
                        <div className="markdown-container">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => {
                                if (props.href && props.href.startsWith('/')) {
                                  return <Link to={props.href} {...props} className="text-blue-600 font-black bg-blue-100 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all inline-block mt-3" onClick={onClose}>{props.children}</Link>
                                }
                                return <a {...props} target="_blank" rel="noopener noreferrer">{props.children}</a>
                              }
                            }}
                          >{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-[9px] font-black text-gray-300 uppercase mt-2 tracking-[0.1em] px-1">
                      {msg.isBot ? 'SI-GERCAP Bot' : 'Anda'}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-gray-50 p-5 rounded-[26px] rounded-tl-none border border-gray-100 flex items-center space-x-2">
                       <Loader2 className="animate-spin text-blue-400" size={16} />
                       <span className="text-xs font-bold text-gray-400">Mengetik respon...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 pt-4 border-t border-gray-50 bg-white shrink-0 mb-safe">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  disabled={isTyping}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isTyping ? "Tunggu sebentar..." : "Ketik pesan Anda..."}
                  className="w-full bg-gray-50 border border-gray-100 py-5 pl-6 pr-16 rounded-[24px] focus:ring-4 focus:ring-[#0047AB]/5 focus:bg-white outline-none font-bold text-sm text-gray-700 transition-all placeholder:text-gray-300 disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 p-3.5 bg-[#0047AB] text-white rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-90 disabled:opacity-50 disabled:active:scale-100"
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
        
        /* Markdown Styling */
        .markdown-container h1, .markdown-container h2, .markdown-container h3 { 
          font-weight: 900; 
          margin-bottom: 0.5rem; 
          margin-top: 0.5rem; 
          color: #1a202c;
        }
        .markdown-container h1 { font-size: 1.25rem; }
        .markdown-container h2 { font-size: 1.1rem; }
        .markdown-container h3 { font-size: 1rem; }
        .markdown-container p { margin-bottom: 0.75rem; }
        .markdown-container p:last-child { margin-bottom: 0; }
        .markdown-container ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .markdown-container ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .markdown-container li { margin-bottom: 0.25rem; }
        .markdown-container strong { font-weight: 900; color: #1a202c; }
        .markdown-container code { background-color: rgba(0,0,0,0.05); padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.9em; }
        .markdown-container pre { background-color: #1a202c; color: white; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 0.75rem; }
        .markdown-container pre code { background-color: transparent; color: inherit; padding: 0; }
        .markdown-container a { color: #0047AB; text-decoration: underline; }
      `}} />
    </AnimatePresence>
  );
};

export default ChatDrawer;

import { useState } from 'react';
import { Send, ArrowLeft, MessageSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AspirasiPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      toast.success('Aspirasi Anda telah dikirim. Terima kasih!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Header */}
      <header className="bg-white px-6 py-5 flex items-center sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => navigate('/warga')}
          className="p-2 -ml-2 text-gray-400 hover:text-[#0047AB] transition mr-4"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-[#333] tracking-tight">Aspirasi Warga</h1>
      </header>

      <main className="p-6 max-w-3xl mx-auto pb-20">
        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEF5FF] rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#EEF5FF] rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
              <MessageSquare className="text-[#0047AB]" size={40} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#333] mb-4 tracking-tight">Sampaikan Aspirasi Anda</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
              Suara Anda sangat berarti bagi kemajuan kita. Sampaikan saran, kritik, atau keluhan terkait layanan kelurahan dengan aman dan nyaman.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-3 ml-1">Pesan Aspirasi</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-6 py-5 bg-[#F8FAFC] border border-gray-100 rounded-[32px] focus:ring-4 focus:ring-[#0047AB]/5 focus:border-[#0047AB] outline-none transition-all text-[#333] font-medium placeholder-gray-400 resize-none shadow-inner"
                  placeholder="Tuliskan aspirasi, saran, atau keluhan Anda secara mendetail di sini..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full py-5 bg-[#0047AB] text-white font-extrabold rounded-2xl hover:bg-[#003580] hover:shadow-xl hover:shadow-blue-200 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg shadow-blue-100 uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} strokeWidth={2.5} />
                    <span>Kirim Aspirasi</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 bg-[#EEF5FF] p-8 rounded-[32px] border border-[#0047AB]/10 flex items-start space-x-5 shadow-sm shadow-blue-100/20">
          <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0 mt-1">
            <Info className="text-[#0047AB]" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-extrabold text-[#0047AB] text-sm uppercase tracking-widest mb-2">Penting untuk Diketahui</h3>
            <p className="text-[#0047AB]/80 font-medium text-sm leading-relaxed">
              Setiap laporan akan diproses secara anonim dan ditinjau oleh tim administrasi kelurahan dalam waktu 2x24 jam. Kami menjamin kerahasiaan identitas Anda.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AspirasiPage;

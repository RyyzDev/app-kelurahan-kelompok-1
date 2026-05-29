import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Share2 } from 'lucide-react';

const QRCodeCard = ({ queueData }) => {
  if (!queueData) return null;

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-gray-100 flex flex-col items-center max-w-sm mx-auto relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#0047AB]"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EEF5FF] rounded-full opacity-50"></div>
      
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-extrabold text-[#333] mb-1 tracking-tight">Tiket Antrean</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">{queueData.date}</p>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-inner border-2 border-dashed border-gray-200 mb-8 relative">
        {/* Ticket punch holes */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full -translate-y-1/2 border-r border-gray-200"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full -translate-y-1/2 border-l border-gray-200"></div>
        
        <QRCodeSVG
          value={queueData.qrValue}
          size={180}
          level="H"
          includeMargin={false}
          className="rounded-xl"
        />
      </div>

      <div className="text-center w-full relative z-10">
        <p className="text-gray-400 font-extrabold text-[10px] uppercase tracking-[0.3em] mb-2">Nomor Antrean</p>
        <div className="relative inline-block mb-6">
           <p className="text-7xl font-black text-[#0047AB] tracking-tighter">{queueData.number}</p>
           <div className="absolute -bottom-1 left-0 w-full h-2 bg-[#4DA9FF]/20 rounded-full blur-sm"></div>
        </div>
        
        <div className="bg-[#F8FAFC] p-5 rounded-3xl text-left mb-8 space-y-3 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Waktu Kedatangan</span>
            <span className="font-extrabold text-[#333]">{queueData.slot}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Lokasi</span>
            <span className="font-extrabold text-[#333]">Layanan A</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 py-4 bg-[#0047AB] text-white rounded-2xl font-extrabold text-xs uppercase tracking-widest hover:bg-[#003580] transition-all shadow-lg shadow-blue-100"
          >
            <Printer size={16} strokeWidth={2.5} />
            <span>Cetak</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 py-4 bg-white text-[#0047AB] border-2 border-[#0047AB] rounded-2xl font-extrabold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            <Share2 size={16} strokeWidth={2.5} />
            <span>Bagikan</span>
          </button>
        </div>
        
        <button className="mt-6 flex items-center justify-center space-x-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#0047AB] transition-colors w-full">
           <Download size={14} strokeWidth={3} />
           <span>Simpan sebagai Gambar</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodeCard;

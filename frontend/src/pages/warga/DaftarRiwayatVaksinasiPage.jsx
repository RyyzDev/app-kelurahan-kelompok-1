import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

const mockVaksinList = [
  {
    id: 1,
    vaksin: 'Vaksinasi campak',
    tanggal: '2026-05-28',
    status: 0, // Belum Vaksin
    statusLabel: 'Belum Vaksin'
  },
  {
    id: 2,
    vaksin: 'Vaksinasi Tetanus',
    tanggal: '2026-05-25',
    status: 1, // selesai
    statusLabel: 'Sudah Vaksin'
  },
  {
    id: 3,
    vaksin: 'Vaksinasi ',
    tanggal: '2026-05-27',
    status: 1, // Selesai
    statusLabel: 'Sudah Vaksin'
  }
];

const DaftarRiwayatVaksinasiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/warga')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Riwayat Vaksinasi Saya</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          {mockVaksinList.map((vaksin) => (
            <button 
              key={vaksin.id}
              className="w-full bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#0047AB]/20 transition-all duration-300 group text-left flex items-center space-x-5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                vaksin.status === 1 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[#0047AB]'
              }`}>
              <Clock />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{vaksin.id}</p>
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                     vaksin.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {vaksin.statusLabel}
                   </span>
                </div>
                <h3 className="text-base font-black text-gray-800 truncate group-hover:text-[#0047AB] transition-colors">{vaksin.vaksin}</h3>
                <p className="text-[11px] text-gray-400 font-bold mt-1">Vaksin dilakukan pada {new Date(vaksin.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </button>
          ))}
        </div>

        {mockVaksinList.length === 0 && (
           <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic">Belum ada permohonan surat.</p>
           </div>
        )}
      </main>
    </div>
  );
};

export default DaftarRiwayatVaksinasiPage;

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ChevronRight, Clock, Download, MapPin } from 'lucide-react';

const mockSuratList = [
  {
    id: 'S-77281',
    keperluan: 'Surat Keterangan Domisili',
    format: 'Digital',
    tanggal: '2026-05-28',
    status: 1, // Verifikasi Data
    statusLabel: 'Sedang Diverifikasi'
  },
  {
    id: 'S-77285',
    keperluan: 'Surat Pengantar RT/RW',
    format: 'Cap Basah',
    tanggal: '2026-05-25',
    status: 3, // Siap Diambil
    statusLabel: 'Siap Diambil'
  },
  {
    id: 'S-77290',
    keperluan: 'Surat Keterangan Belum Menikah',
    format: 'Digital',
    tanggal: '2026-05-27',
    status: 2, // Penandatanganan Lurah
    statusLabel: 'Proses Tanda Tangan'
  }
];

const DaftarStatusSuratPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/warga/persuratan')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Status Surat Saya</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100 mb-8 flex items-center space-x-4">
           <div className="bg-white p-3 rounded-2xl shadow-sm text-[#0047AB]">
              <FileText size={24} strokeWidth={2.5} />
           </div>
           <p className="text-sm font-bold text-[#0047AB] leading-relaxed">
             Klik pada dokumen untuk melihat progres pengerjaan secara detail.
           </p>
        </div>

        <div className="space-y-4">
          {mockSuratList.map((surat) => (
            <button 
              key={surat.id}
              onClick={() => navigate(`/warga/persuratan/status/${surat.id}`, { state: { surat } })}
              className="w-full bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#0047AB]/20 transition-all duration-300 group text-left flex items-center space-x-5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                surat.status === 3 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-[#0047AB]'
              }`}>
                {surat.status === 3 ? (
                   surat.format === 'Digital' ? <Download size={24} strokeWidth={2.5} /> : <MapPin size={24} strokeWidth={2.5} />
                ) : (
                   <Clock size={24} strokeWidth={2.5} />
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{surat.id}</p>
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                     surat.status === 3 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                   }`}>
                     {surat.statusLabel}
                   </span>
                </div>
                <h3 className="text-base font-black text-gray-800 truncate group-hover:text-[#0047AB] transition-colors">{surat.keperluan}</h3>
                <p className="text-[11px] text-gray-400 font-bold mt-1">Diajukan pada {new Date(surat.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:text-[#0047AB] transition-colors">
                <ChevronRight size={18} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>

        {mockSuratList.length === 0 && (
           <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic">Belum ada permohonan surat.</p>
           </div>
        )}
      </main>
    </div>
  );
};

export default DaftarStatusSuratPage;

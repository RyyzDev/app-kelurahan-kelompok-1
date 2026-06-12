import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ChevronRight, Clock, Download, MapPin, Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import { getMyPermohonanSurat } from '../../services/suratService';
import toast from 'react-hot-toast';

const getStatusConfig = (status) => {
  switch (status) {
    case 'verifikasi':
      return { label: 'Verifikasi', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock };
    case 'penandatanganan_rt':
    case 'penandatanganan_rw':
    case 'penandatanganan':
      return { label: 'Proses TTD', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Clock };
    case 'siap_didownload':
    case 'siap_diambil':
      return { label: 'Siap Ambil', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle2 };
    case 'selesai':
      return { label: 'Selesai', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: FileText };
    case 'ditolak':
      return { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertCircle };
    default:
      return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: Clock };
  }
};

const CheckCircle2 = ({ size, strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 9-4.477 9-10S17.523 2 12 2 3 6.477 3 12s3.477 10 9 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const DaftarStatusSuratPage = () => {
  const navigate = useNavigate();
  const [permohonanList, setPermohonanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    const fetchPermohonan = async () => {
      try {
        const response = await getMyPermohonanSurat();
        setPermohonanList(response.data);
        setFilteredList(response.data);
      } catch (err) {
        toast.error('Gagal memuat riwayat permohonan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermohonan();
  }, []);

  useEffect(() => {
    let result = permohonanList;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.jenis_surat.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'Semua') {
      result = result.filter(item => {
        if (activeFilter === 'Proses') return ['verifikasi', 'penandatanganan_rt', 'penandatanganan_rw', 'penandatanganan'].includes(item.status);
        if (activeFilter === 'Selesai') return ['siap_didownload', 'siap_diambil', 'selesai'].includes(item.status);
        if (activeFilter === 'Ditolak') return item.status === 'ditolak';
        return true;
      });
    }

    setFilteredList(result);
  }, [searchTerm, activeFilter, permohonanList]);

  return (
    <div className="min-h-screen bg-white pb-12 font-sans">
      {/* Premium Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/warga')} className="p-2 hover:bg-gray-50 rounded-2xl transition-all active:scale-90 text-gray-400">
             <ArrowLeft size={24} strokeWidth={2.5} />
           </button>
           <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Riwayat Surat</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">Lacak & Kelola Dokumen</p>
           </div>
        </div>
        <div className="bg-[#0047AB] p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
           <FileText size={20} strokeWidth={2.5} />
        </div>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto space-y-8">
        {/* Search & Filter Bar */}
        <div className="space-y-5">
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search size={18} className="text-gray-300 group-focus-within:text-[#0047AB] transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Cari jenis surat atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm text-gray-700 placeholder-gray-300 shadow-inner"
              />
           </div>

           <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Semua', 'Proses', 'Selesai', 'Ditolak'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shrink-0
                    ${activeFilter === filter 
                      ? 'bg-[#0047AB] text-white shadow-lg shadow-blue-200' 
                      : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'}
                  `}
                >
                  {filter}
                </button>
              ))}
           </div>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 border-t-[#0047AB] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-blue-50 rounded-full animate-pulse"></div>
                </div>
             </div>
             <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Menyinkronkan Data</p>
          </div>
        ) : filteredList.length > 0 ? (
          <div className="space-y-5">
            {filteredList.map((item) => {
              const cfg = getStatusConfig(item.status);
              const StatusIcon = cfg.icon;

              return (
                <button 
                  key={item.id}
                  onClick={() => navigate(`/warga/persuratan/status/${item.id}`)}
                  className="w-full group bg-white border border-gray-100 rounded-[32px] p-1 transition-all hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                >
                  <div className="flex items-center p-5 space-x-5">
                    {/* Icon Part */}
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm ${cfg.bg} ${cfg.color}`}>
                       {item.status.includes('siap') ? (
                          item.format_surat === 'digital' ? <Download size={26} strokeWidth={2.5} /> : <MapPin size={26} strokeWidth={2.5} />
                       ) : (
                          <StatusIcon size={26} strokeWidth={2.5} />
                       )}
                    </div>

                    {/* Info Part */}
                    <div className="flex-1 min-w-0 text-left">
                       <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.id.substring(0, 8).toUpperCase()}</p>
                          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.color.replace('text', 'bg')}`}></div>
                             <span className="text-[9px] font-black uppercase tracking-wider">{cfg.label}</span>
                          </div>
                       </div>
                       <h3 className="text-base font-black text-gray-800 truncate mb-1 group-hover:text-[#0047AB] transition-colors">
                          {item.jenis_surat.nama_layanan}
                       </h3>
                       <div className="flex items-center space-x-3">
                          <p className="text-[11px] text-gray-400 font-bold">
                             {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                             {item.format_surat === 'digital' ? '📄 Digital' : '🖋️ Fisik'}
                          </p>
                       </div>
                    </div>

                    {/* Arrow */}
                    <div className="p-2 text-gray-200 group-hover:text-[#0047AB] transition-colors">
                       <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <Search size={32} className="text-gray-200" />
             </div>
             <p className="text-gray-400 font-bold text-sm italic">Tidak ditemukan permohonan surat.</p>
             <button 
               onClick={() => {setSearchTerm(''); setActiveFilter('Semua');}}
               className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#0047AB] hover:underline"
             >
               Reset Pencarian
             </button>
          </div>
        )}

        {/* Floating Action Button for New Request (Optional/Premium Feel) */}
        {!isLoading && (
          <button 
            onClick={() => navigate('/warga/persuratan/buat')}
            className="fixed bottom-8 right-6 bg-[#0047AB] text-white p-5 rounded-[28px] shadow-2xl shadow-blue-500/40 active:scale-90 transition-all z-40 md:hidden"
          >
            <FileText size={24} strokeWidth={2.5} />
          </button>
        )}
      </main>
    </div>
  );
};

export default DaftarStatusSuratPage;

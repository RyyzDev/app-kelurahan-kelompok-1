import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, ShieldCheck, CheckCircle2, Loader2, AlertCircle, MapPin, Clock, Info, Calendar, Hash, Tag } from 'lucide-react';
import DocumentStatusTracker from '../../components/persuratan/DocumentStatusTracker';
import { getPermohonanSuratDetail } from '../../services/suratService';
import toast from 'react-hot-toast';

const DetailStatusSuratPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getPermohonanSuratDetail(id);
        setSurat(response.data);
      } catch (err) {
        toast.error('Gagal memuat detail permohonan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
         <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-50 border-t-[#0047AB] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#0047AB]">
               <Clock size={24} />
            </div>
         </div>
         <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Memverifikasi Dokumen</p>
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#F8FAFC]">
         <div className="text-center bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 max-w-sm">
            <AlertCircle className="mx-auto text-red-400 mb-6" size={64} />
            <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Oops! Data Hilang</h2>
            <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed">Permohonan yang Anda cari tidak ditemukan atau sudah dihapus.</p>
            <button 
               onClick={() => navigate('/warga/persuratan/status')} 
               className="w-full py-4 bg-[#0047AB] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200"
            >
               Kembali ke Daftar
            </button>
         </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!surat.file_url) {
      toast.error('Tautan dokumen belum tersedia.');
      return;
    }
    window.open(surat.file_url, '_blank');
    toast.success('Membuka dokumen e-Surat...');
  };

  const isReady = ['siap_didownload', 'siap_diambil', 'selesai'].includes(surat.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      {/* Dynamic Transparent Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b border-gray-100 flex items-center space-x-5">
        <button onClick={() => navigate('/warga/persuratan/status')} className="p-2.5 hover:bg-gray-50 rounded-2xl transition-all active:scale-90 text-gray-400 border border-gray-100 shadow-sm bg-white">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
           <h1 className="text-xl font-black text-gray-900 tracking-tight">Detail Pelacakan</h1>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {surat.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Main Tracking Card */}
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
          <div className="bg-gradient-to-br from-[#0047AB] to-[#003580] p-10 text-white relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <FileText size={48} strokeWidth={2.5} className="mb-6 opacity-80" />
             <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">{surat.jenis_surat.nama_layanan}</h2>
             <div className="flex items-center space-x-2 text-blue-100/60 font-bold text-[11px] uppercase tracking-widest">
                <Tag size={12} />
                <span>{surat.format_surat === 'digital' ? 'E-Surat Digital' : 'Dokumen Fisik'}</span>
             </div>
          </div>

          <div className="border-t border-blue-800/20 p-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alasan Permohonan</h3>
            <p className="text-gray-600 font-medium leading-relaxed italic">"{surat.alasan_permohonan}"</p>
          </div>

          <div className="p-8 border-t border-gray-50">
             <div className="bg-gray-50 rounded-[32px] border border-gray-100 p-2 mb-10">
                <DocumentStatusTracker status={surat.status} format={surat.format_surat} />
             </div>

             {/* Dynamic Information Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-white border border-gray-100 rounded-[28px] shadow-sm flex items-start space-x-4">
                   <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                      <Calendar size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Diajukan</p>
                      <p className="text-sm font-bold text-gray-700">{new Date(surat.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>

                <div className="p-5 bg-white border border-gray-100 rounded-[28px] shadow-sm flex items-start space-x-4">
                   <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                      <Hash size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">No. Surat</p>
                      <p className="text-sm font-bold text-gray-700">{surat.nomor_surat || 'Belum Terbit'}</p>
                   </div>
                </div>
             </div>

             {/* Requirements Warning for Cap Basah */}
             {surat.format_surat === 'cap_basah' && (
                <div className="mb-8 p-6 bg-red-50/50 border border-red-100 rounded-[32px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 text-red-200 group-hover:rotate-12 transition-transform">
                      <AlertCircle size={48} />
                   </div>
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center space-x-2">
                      <Info size={14} />
                      <span>Penting: Persyaratan yang Harus Dibawa</span>
                   </p>
                   <p className="text-xs font-bold text-red-800 leading-relaxed mb-4 relative z-10">
                      Karena Anda memilih format <strong>Cap Basah</strong>, Anda wajib membawa dokumen fisik berikut ke kantor kelurahan untuk verifikasi akhir:
                   </p>
                   <ul className="space-y-2 relative z-10">
                      {surat.jenis_surat.persyaratan.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-3 text-[11px] font-extrabold text-red-700/80">
                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                           <span>{item}</span>
                        </li>
                      ))}
                   </ul>
                </div>
             )}

             {/* Admin Feedback Section */}
             {surat.catatan_admin && (
                <div className="mb-8 p-6 bg-orange-50/50 border border-orange-100 rounded-[32px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 text-orange-200 group-hover:rotate-12 transition-transform">
                      <Info size={48} />
                   </div>
                   <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center space-x-2">
                      <ShieldCheck size={14} />
                      <span>Catatan Petugas</span>
                   </p>
                   <p className="text-sm font-bold text-orange-800 leading-relaxed relative z-10">{surat.catatan_admin}</p>
                </div>
             )}

             {/* Action Button */}
             {surat.format_surat === 'digital' ? (
               <button 
                 onClick={handleDownload}
                 disabled={!isReady}
                 className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-4 transition-all duration-500 shadow-xl text-xs
                   ${isReady 
                     ? 'bg-[#34A853] text-white shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] active:scale-95' 
                     : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed opacity-60'}
                 `}
               >
                 <Download size={20} strokeWidth={3} />
                 <span>Download E-Surat</span>
               </button>
             ) : (
               <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center space-x-5">
                  <div className={`p-4 rounded-2xl shadow-inner transition-colors duration-500 ${surat.status === 'siap_diambil' ? 'bg-green-100 text-green-600' : 'bg-white text-blue-600'}`}>
                    <MapPin size={28} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-[#0047AB] font-bold leading-relaxed">
                    {surat.status === 'siap_diambil' 
                     ? 'Dokumen fisik sudah siap! Silakan ambil di Kantor Kelurahan pada jam kerja dengan membawa KTP.'
                     : 'Permohonan sedang diproses. Anda akan menerima notifikasi jika dokumen fisik sudah siap diambil.'}
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Support Footer */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
           <div className="flex items-center space-x-2 text-gray-300">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified by SI-GERCAP Cloud</span>
           </div>
           <button className="text-[10px] font-black text-[#4DA9FF] uppercase tracking-widest hover:underline">Butuh Bantuan?</button>
        </div>
      </main>
    </div>
  );
};

export default DetailStatusSuratPage;

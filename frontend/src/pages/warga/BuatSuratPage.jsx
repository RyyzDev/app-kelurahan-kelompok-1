import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Smartphone, Stamp, CheckCircle2, ChevronRight, Clock, FileCheck, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getJenisSurat, createPermohonanSurat } from '../../services/suratService';

const BuatSuratPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [suratTypes, setSuratTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    jenis_surat_id: '',
    format_surat: '',
    alasan_permohonan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getJenisSurat();
        setSuratTypes(response.data);
      } catch (err) {
        toast.error('Gagal memuat jenis surat');
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  const handleNext = () => {
    if (step === 1 && (!formData.jenis_surat_id || !formData.format_surat)) {
      toast.error('Pilih jenis surat dan format terlebih dahulu');
      return;
    }
    if (step === 2 && (!formData.alasan_permohonan || formData.alasan_permohonan.length < 10)) {
      toast.error('Alasan permohonan minimal 10 karakter');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmitPermohonan = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim permohonan...');
    
    try {
      const response = await createPermohonanSurat(formData);
      
      if (response.offline) {
        setRefNumber('OFFLINE-' + Math.random().toString(36).substring(2, 7).toUpperCase());
        toast.success('Disimpan offline! Akan dikirim otomatis saat online.', { id: toastId });
      } else {
        setRefNumber(response.data.id.substring(0, 8).toUpperCase());
        toast.success('Permohonan berhasil terkirim!', { id: toastId });
      }
      
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim permohonan', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 1 || step === 4) {
      navigate('/warga');
    } else {
      setStep(step - 1);
    }
  };

  const goToStep = (targetStep) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const selectedSuratName = suratTypes.find(s => s.id === formData.jenis_surat_id)?.nama_layanan;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={handleBack} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
          {step === 4 ? 'Status Permohonan' : 'Buat Surat Baru'}
        </h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        {step < 4 && (
          <div className="flex justify-between items-center mb-10 px-4">
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`flex flex-col items-center relative flex-1 ${num < step ? 'cursor-pointer' : ''}`}
                onClick={() => goToStep(num)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 transition-all duration-500 ${step >= num ? 'bg-[#0047AB] text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                  {step > num ? <CheckCircle2 size={18} /> : num}
                </div>
                <span className={`text-[10px] font-black uppercase mt-2 tracking-widest ${step >= num ? 'text-[#0047AB]' : 'text-gray-300'}`}>
                  {num === 1 ? 'Jenis' : num === 2 ? 'Detail' : 'Kirim'}
                </span>
                {num < 3 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${step > num ? 'bg-[#0047AB]' : 'bg-gray-100'}`}></div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pilih Jenis Surat</label>
               {isLoadingTypes ? (
                 <div className="flex justify-center p-8">
                   <Loader2 className="animate-spin text-[#0047AB]" />
                 </div>
               ) : (
                 <div className="space-y-3">
                   <div className="grid grid-cols-1 gap-3 relative">
                     {suratTypes.slice(0, showAll ? suratTypes.length : 5).map((surat, index) => {
                       const isBlurred = !showAll && index === 4;
                       
                       return (
                         <button 
                           key={surat.id}
                           disabled={isBlurred}
                           onClick={() => setFormData({...formData, jenis_surat_id: surat.id})}
                           className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group relative overflow-hidden
                             ${formData.jenis_surat_id === surat.id ? 'border-[#0047AB] bg-blue-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-blue-200'}
                             ${isBlurred ? 'opacity-40 blur-[2px] cursor-default' : ''}
                           `}
                         >
                           <div>
                             <p className={`font-bold ${formData.jenis_surat_id === surat.id ? 'text-[#0047AB]' : 'text-gray-600'}`}>{surat.nama_layanan}</p>
                             <p className="text-[10px] text-gray-400 font-bold">{surat.estimasi_pengerjaan} Hari Kerja</p>
                           </div>
                           {!isBlurred && <ChevronRight size={18} className={formData.jenis_surat_id === surat.id ? 'text-[#0047AB]' : 'text-gray-300'} />}
                           
                           {isBlurred && (
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
                           )}
                         </button>
                       );
                     })}
                   </div>

                   {suratTypes.length > 4 && (
                     <button 
                       onClick={() => setShowAll(!showAll)}
                       className="w-full py-3 flex items-center justify-center space-x-2 text-[#0047AB] font-black uppercase tracking-widest text-[10px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                     >
                       <span>{showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'}</span>
                       {showAll ? <ChevronUp size={16} strokeWidth={3} /> : <ChevronDown size={16} strokeWidth={3} />}
                     </button>
                   )}
                 </div>
               )}
            </div>

            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pilih Format Surat</label>
               <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setFormData({...formData, format_surat: 'digital'})}
                   className={`p-6 rounded-[32px] border-2 flex flex-col items-center text-center transition-all ${formData.format_surat === 'digital' ? 'border-[#34A853] bg-green-50 shadow-lg' : 'border-gray-100 bg-white hover:border-blue-100'}`}
                 >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${formData.format_surat === 'digital' ? 'bg-[#34A853] text-white' : 'bg-blue-50 text-[#0047AB]'}`}>
                      <Smartphone size={28} strokeWidth={2.5} />
                   </div>
                   <h4 className="font-black text-xs uppercase tracking-tight mb-1">Kertas Digital</h4>
                   <p className="text-[10px] text-gray-400 font-bold leading-tight">Proses instan melalui e-Surat</p>
                 </button>

                 <button 
                   onClick={() => setFormData({...formData, format_surat: 'cap_basah'})}
                   className={`p-6 rounded-[32px] border-2 flex flex-col items-center text-center transition-all ${formData.format_surat === 'cap_basah' ? 'border-[#EF4444] bg-red-50 shadow-lg' : 'border-gray-100 bg-white hover:border-red-100'}`}
                 >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${formData.format_surat === 'cap_basah' ? 'bg-[#EF4444] text-white' : 'bg-red-50 text-[#EF4444]'}`}>
                      <Stamp size={28} strokeWidth={2.5} />
                   </div>
                   <h4 className="font-black text-xs uppercase tracking-tight mb-1">Kertas Cap Basah</h4>
                   <p className="text-[10px] text-gray-400 font-bold leading-tight">Ambil fisik di kantor</p>
                 </button>
               </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-4 bg-[#0047AB] text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              Lanjutkan
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-5 rounded-2xl mb-8 flex items-center space-x-4">
                   <div className="bg-white p-3 rounded-xl shadow-sm text-[#0047AB]">
                      <FileCheck size={24} strokeWidth={2.5} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Dokumen</p>
                      <p className="font-bold text-gray-800">{selectedSuratName}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Keterangan / Alasan Permohonan</label>
                      <textarea 
                        rows={6}
                        value={formData.alasan_permohonan}
                        onChange={(e) => setFormData({...formData, alasan_permohonan: e.target.value})}
                        placeholder="Berikan alasan lengkap mengapa Anda memerlukan surat ini..."
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:bg-white outline-none transition-all font-medium text-sm text-gray-700 resize-none"
                      />
                   </div>
                </div>
             </div>

             <button 
              onClick={handleNext}
              className="w-full py-4 bg-[#0047AB] text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              Lanjutkan ke Pengiriman
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
                <div className="bg-blue-50 w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-[#0047AB]">
                   <FileText size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Review Terakhir</h3>
                <p className="text-gray-500 font-medium text-sm mb-8">Pastikan data yang Anda masukkan sudah benar sebelum dikirim ke petugas.</p>

                <div className="space-y-4 text-left">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Keperluan</p>
                      <p className="font-bold text-gray-700">{selectedSuratName}</p>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Format Dokumen</p>
                      <p className="font-bold text-gray-700">{formData.format_surat === 'digital' ? '📄 Digital (E-Surat)' : '🖋️ Fisik (Cap Basah)'}</p>
                   </div>
                </div>
             </div>

             <button 
              onClick={handleSubmitPermohonan}
              disabled={isSubmitting}
              className="w-full py-5 bg-[#0047AB] text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center">
             <div className="bg-white w-full rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-900/10 p-10 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                
                <div className="text-center mb-10">
                   <div className="bg-green-50 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                      <CheckCircle2 size={40} strokeWidth={3} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 tracking-tight">Permohonan Diproses</h2>
                   <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Nomor Referensi: {refNumber}</p>
                </div>

                <div className="mt-10 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start space-x-4">
                   <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#0047AB]">
                      <Clock size={20} strokeWidth={2.5} />
                   </div>
                   <p className="text-xs text-[#0047AB] font-bold leading-relaxed text-left">
                      Status surat akan diperbarui secara otomatis. Silakan cek halaman <strong>"Status Surat Saya"</strong> secara berkala.
                   </p>
                </div>
             </div>

             <div className="flex flex-col w-full space-y-3 mt-10">
                <button 
                  onClick={() => navigate('/warga/persuratan/status')}
                  className="w-full py-5 bg-[#0047AB] text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all text-xs"
                >
                  Cek Status Surat Saya
                </button>
                <button 
                  onClick={() => navigate('/warga')}
                  className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-[#0047AB] transition-all active:scale-95"
                >
                  Kembali ke Menu
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuatSuratPage;

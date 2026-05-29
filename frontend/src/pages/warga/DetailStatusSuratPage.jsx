import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import DocumentStatusTracker from '../../components/persuratan/DocumentStatusTracker';
import toast from 'react-hot-toast';

const DetailStatusSuratPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const surat = state?.surat;

  if (!surat) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#F8FAFC]">
         <div className="text-center">
            <h2 className="text-xl font-black text-gray-400">Data tidak ditemukan</h2>
            <button onClick={() => navigate('/warga/persuratan/status')} className="mt-4 text-[#0047AB] font-bold">Kembali</button>
         </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (surat.status < 3) {
      toast.error('Dokumen belum siap didownload');
      return;
    }
    toast.success('Mengunduh dokumen e-Surat...');
    // Simulasi download
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/warga/persuratan/status')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Detail Pelacakan</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto flex flex-col items-center">
        <div className="bg-white w-full rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-900/10 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
          
          <div className="text-center mb-10">
             <div className="bg-blue-50 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-[#0047AB] shadow-inner">
                <FileText size={40} strokeWidth={2.5} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">{surat.keperluan}</h2>
             <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">ID REFERENSI: {surat.id}</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-[32px] border border-gray-100 p-2 mb-10">
             <DocumentStatusTracker currentStep={surat.status} format={surat.format} />
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Format</p>
                  <p className="font-extrabold text-gray-700">{surat.format === 'Digital' ? '📄 e-Surat (Digital)' : '🖋️ Fisik (Cap Basah)'}</p>
               </div>
               {surat.status === 3 && (
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                     <CheckCircle2 size={20} strokeWidth={3} />
                  </div>
               )}
            </div>

            {surat.format === 'Digital' ? (
              <button 
                onClick={handleDownload}
                disabled={surat.status < 3}
                className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl
                  ${surat.status === 3 
                    ? 'bg-[#34A853] text-white shadow-green-100 hover:bg-green-700 hover:scale-[1.02] active:scale-95' 
                    : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'}
                `}
              >
                <Download size={22} strokeWidth={3} />
                <span>Download e-Surat</span>
              </button>
            ) : (
              <div className="p-6 bg-blue-50 rounded-[24px] border border-blue-100 text-center">
                 <p className="text-xs text-[#0047AB] font-bold leading-relaxed">
                   {surat.status === 3 
                    ? 'Dokumen fisik Anda sudah siap! Silakan datang ke kantor kelurahan dengan membawa KTP asli.'
                    : 'Silakan tunggu hingga status berubah menjadi "Siap Diambil" sebelum datang ke kantor.'}
                 </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex items-center space-x-3 text-gray-400">
           <ShieldCheck size={20} strokeWidth={2.5} />
           <span className="text-[10px] font-black uppercase tracking-widest">SI-GERCAP Secure Verification</span>
        </div>
      </main>
    </div>
  );
};

export default DetailStatusSuratPage;

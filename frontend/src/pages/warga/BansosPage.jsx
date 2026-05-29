import { useState } from 'react';
import OCRUploader from '../../components/bansos/OCRUploader';
import RegistrationForm from '../../components/bansos/RegistrationForm';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, ClipboardCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BansosPage = () => {
  const [ocrData, setOcrData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOCRComplete = (data) => {
    setOcrData(data);
    toast.success('Data KTP berhasil diekstrak!');
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    // Simulasi pengiriman data
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Pendaftaran bansos berhasil dikirim!');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#34A853]"></div>
          <div className="bg-[#34A853]/10 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#34A853]/20">
            <CheckCircle2 className="text-[#34A853]" size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#333] mb-4 tracking-tight">Pendaftaran Diterima</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-10">
            Data Anda telah masuk ke sistem kami untuk proses verifikasi oleh Admin Kelurahan. Mohon tunggu informasi selanjutnya.
          </p>
          <button
            onClick={() => navigate('/warga')}
            className="w-full py-5 bg-[#0047AB] text-white rounded-2xl font-extrabold shadow-lg shadow-blue-100 hover:bg-[#003580] transition-all uppercase tracking-[0.2em] text-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-xl font-extrabold text-[#333] tracking-tight">Pendaftaran Bansos</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Hero Section */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-50 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEF5FF] rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0 relative z-10">
            <div className="max-w-2xl">
              <div className="w-16 h-16 bg-[#EEF5FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ClipboardCheck className="text-[#0047AB]" size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#333] mb-3 tracking-tight">Lengkapi Data Pengajuan</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Gunakan fitur AI Scan KTP untuk mempercepat proses pengisian data secara otomatis dan akurat.
              </p>
            </div>
            
            <div className="bg-[#EEF5FF] p-6 rounded-3xl border border-[#0047AB]/10 space-y-3">
               <h4 className="text-[#0047AB] font-extrabold text-xs uppercase tracking-widest">Alur Pendaftaran:</h4>
               <ul className="text-[#0047AB] text-[11px] font-bold space-y-2 opacity-80">
                  <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-white flex items-center justify-center mr-2 text-[10px]">1</span> Upload Foto KTP Asli</li>
                  <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-white flex items-center justify-center mr-2 text-[10px]">2</span> Verifikasi Data Otomatis</li>
                  <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-white flex items-center justify-center mr-2 text-[10px]">3</span> Lengkapi Detail & Kirim</li>
               </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: OCR Uploader */}
          <div className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center space-x-2 px-2">
                 <div className="w-6 h-6 bg-[#0047AB] rounded-lg flex items-center justify-center text-white text-[10px] font-black">01</div>
                 <h3 className="text-lg font-extrabold text-[#333] tracking-tight uppercase tracking-[0.1em]">Langkah 1: AI Scan KTP</h3>
              </div>
              <OCRUploader onOCRComplete={handleOCRComplete} />
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 px-2">
                 <div className="w-6 h-6 bg-[#0047AB] rounded-lg flex items-center justify-center text-white text-[10px] font-black">02</div>
                 <h3 className="text-lg font-extrabold text-[#333] tracking-tight uppercase tracking-[0.1em]">Langkah 2: Konfirmasi Data</h3>
              </div>
              
              <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-50 min-h-[400px]">
                {!ocrData ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
                      <Info className="text-gray-300" size={32} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-xl font-extrabold text-gray-300 mb-2 tracking-tight">Formulir Terkunci</h4>
                    <p className="text-gray-400 font-medium leading-relaxed">
                      Silakan upload foto KTP Anda terlebih dahulu di area sebelah kiri untuk membuka dan mengisi formulir pendaftaran.
                    </p>
                  </div>
                ) : (
                  <RegistrationForm 
                    initialData={ocrData} 
                    onSubmit={handleFormSubmit} 
                    isLoading={isLoading} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BansosPage;

import { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';

const OCRUploader = ({ onOCRComplete }) => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        simulateOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = () => {
    setIsProcessing(true);
    // Simulasi pemrosesan OCR selama 3 detik
    setTimeout(() => {
      const mockData = {
        nik: '3275010101010001',
        nama: 'BUDI SANTOSO',
        tempat_lahir: 'BEKASI',
        tgl_lahir: '1990-01-01',
        alamat: 'JL. MERDEKA NO. 123, KELURAHAN MAJU JAYA',
        rt_rw: '001/002',
      };
      setIsProcessing(false);
      onOCRComplete(mockData);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-[32px] p-10 flex flex-col items-center justify-center bg-white hover:bg-[#EEF5FF] hover:border-[#0047AB]/30 transition-all cursor-pointer group shadow-sm"
        >
          <div className="bg-[#EEF5FF] p-5 rounded-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Upload className="text-[#0047AB]" size={36} strokeWidth={2.5} />
          </div>
          <p className="text-xl font-extrabold text-[#333] tracking-tight">Upload Foto KTP</p>
          <p className="text-sm text-gray-400 text-center mt-2 font-medium leading-relaxed">
            Klik atau tarik file foto KTP Anda ke sini.<br/>Format JPG/PNG, maksimal 5MB.
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative group overflow-hidden rounded-[32px] border border-gray-100 bg-white p-5 shadow-xl shadow-blue-900/5">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-50">
            <img src={image} alt="KTP Preview" className="w-full h-full object-contain" />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-6">
                   <Loader2 className="text-[#0047AB] animate-spin" size={64} strokeWidth={1.5} />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={24} className="text-[#0047AB]/40" />
                   </div>
                </div>
                <h3 className="text-2xl font-extrabold text-[#333] mb-2 tracking-tight">Menganalisis KTP</h3>
                <p className="text-gray-500 font-medium">Kecerdasan Buatan sedang mengekstrak data dari foto KTP Anda...</p>
              </div>
            )}

            {!isProcessing && (
              <div className="absolute top-4 right-4 bg-[#34A853] text-white p-2 rounded-full shadow-lg scale-110 animate-bounce-short">
                <CheckCircle size={20} strokeWidth={3} />
              </div>
            )}
          </div>
          
          {!isProcessing && (
            <button 
              onClick={() => setImage(null)}
              className="mt-5 w-full py-4 flex items-center justify-center space-x-2 text-red-500 font-extrabold text-xs uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
            >
              <X size={16} strokeWidth={3} />
              <span>Ganti Foto KTP</span>
            </button>
          )}
        </div>
      )}

      <div className="bg-[#EEF5FF] p-5 rounded-2xl flex items-start space-x-4 border border-[#0047AB]/10 shadow-sm shadow-blue-100/20">
        <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
          <AlertCircle className="text-[#0047AB]" size={20} strokeWidth={2.5} />
        </div>
        <div className="text-xs text-[#0047AB] font-bold leading-relaxed">
          <strong>TIPS OPTIMAL:</strong> Pastikan KTP berada di area terang, tidak ada pantulan cahaya, dan teks terbaca dengan jelas oleh sistem AI.
        </div>
      </div>
    </div>
  );
};

export default OCRUploader;

import { CheckCircle2, Clock, Download, MapPin } from 'lucide-react';

const DocumentStatusTracker = ({ currentStep = 1, format = 'Digital' }) => {
  const steps = [
    { 
      id: 1, 
      label: 'Verifikasi Data', 
      desc: 'Petugas sedang meninjau dokumen Anda.',
      icon: Clock
    },
    { 
      id: 2, 
      label: 'Penandatanganan Lurah', 
      desc: 'Menunggu tanda tangan digital dari Pak Lurah.',
      icon: CheckCircle2
    },
    { 
      id: 3, 
      label: format === 'Digital' ? 'Siap Didownload' : 'Siap Diambil', 
      desc: format === 'Digital' ? 'Dokumen sudah terbit dalam format e-Surat.' : 'Silakan datang ke kantor kelurahan dengan membawa KTP asli.',
      icon: format === 'Digital' ? Download : MapPin
    }
  ];

  return (
    <div className="py-10 px-4 flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={step.id} className="w-full max-w-xs relative">
          {/* Zigzag Layout Logic */}
          <div className={`flex items-center space-x-6 mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
            {/* Icon Circle */}
            <div className={`
              w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 z-10 transition-all duration-700
              ${currentStep >= step.id ? 'bg-[#0047AB] text-white shadow-xl shadow-blue-200 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}
            `}>
              {currentStep > step.id ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <step.icon size={32} strokeWidth={2.5} />}
            </div>

            {/* Label & Description */}
            <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
              <h4 className={`text-lg font-black tracking-tight leading-tight ${currentStep >= step.id ? 'text-gray-800' : 'text-gray-300'}`}>
                {step.label}
              </h4>
              <p className={`text-[11px] font-bold mt-1 leading-relaxed ${currentStep >= step.id ? 'text-gray-500' : 'text-gray-200'}`}>
                {step.desc}
              </p>
            </div>
          </div>

          {/* Snake Connector Line (Zigzag Dot Path) */}
          {index < steps.length - 1 && (
            <div className={`absolute top-16 h-16 w-[2px] bg-transparent border-l-2 border-dashed border-gray-100 left-[31px] -z-0`}>
               {/* Animated Fill for Line */}
               <div 
                 className="absolute top-0 left-[-2px] w-[2px] bg-[#0047AB] transition-all duration-1000 origin-top" 
                 style={{ height: currentStep > step.id ? '100%' : '0%' }}
               />
               
               {/* Floating Dots to accentuate zigzag */}
               <div className={`absolute top-1/2 ${index % 2 === 0 ? 'left-[20px]' : 'right-[20px]'} w-2 h-2 rounded-full bg-gray-100`}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentStatusTracker;

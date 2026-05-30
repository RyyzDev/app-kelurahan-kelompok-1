import { CheckCircle2, Clock, Download, MapPin, FileCheck } from 'lucide-react';

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
      desc: 'Dokumen sedang ditandatangani oleh Lurah.',
      icon: FileCheck
    },
    { 
      id: 3, 
      label: format === 'Digital' ? 'Siap Didownload' : 'Siap Diambil', 
      desc: format === 'Digital' ? 'Dokumen sudah terbit dalam format e-Surat.' : 'Silakan datang ke kantor kelurahan.',
      icon: format === 'Digital' ? Download : MapPin
    }
  ];

  return (
    <div className="py-12 px-4 w-full max-w-sm mx-auto relative">
      {/* SVG Zigzag Connector Path - Adjusted to start from Left */}
      <div className="absolute inset-0 pointer-events-none px-4" style={{ top: '64px', bottom: '100px' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
          {/* Base Path (Gray Dotted) */}
          <path 
            d="M 18 0 L 82 50 L 18 100" 
            fill="none" 
            stroke="#F1F5F9" 
            strokeWidth="4" 
            strokeDasharray="8 8"
          />
          
          {/* Segment 1: Step 1 (Left) to Step 2 (Right) */}
          <path 
            d="M 18 0 L 82 50" 
            fill="none" 
            stroke={currentStep >= 2 ? (currentStep === 3 ? "#34A853" : "#0047AB") : "transparent"} 
            strokeWidth="4"
            strokeDasharray="200"
            strokeDashoffset={currentStep >= 2 ? 0 : 200}
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Segment 2: Step 2 (Right) to Step 3 (Left) */}
          <path 
            d="M 82 50 L 18 100" 
            fill="none" 
            stroke={currentStep === 3 ? "#34A853" : "transparent"} 
            strokeWidth="4"
            strokeDasharray="200"
            strokeDashoffset={currentStep === 3 ? 0 : 200}
            className="transition-all duration-1000 ease-in-out delay-500"
          />
        </svg>
      </div>

      {/* Steps List */}
      <div className="space-y-20 relative z-10">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isFinal = currentStep === 3 && step.id === 3;
          const isReached = currentStep >= step.id;
          
          const iconColorClass = (isCompleted || isFinal) 
            ? 'bg-[#34A853] border-[#34A853] text-white shadow-green-100' 
            : isActive 
              ? 'bg-[#0047AB] border-[#0047AB] text-white shadow-blue-100' 
              : 'bg-white border-gray-100 text-gray-300 shadow-none';
          
          const textOpacityClass = isReached ? 'opacity-100' : 'opacity-30';
          
          // New Inverted Layout Logic:
          // index 0, 2 (Icon Left, Text Right)
          // index 1 (Icon Right, Text Left)
          const isIconLeft = index % 2 === 0;

          return (
            <div 
              key={step.id} 
              className={`flex items-center ${isIconLeft ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Icon Circle */}
              <div className={`
                w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 transition-all duration-500 border-2 z-20 shadow-xl
                ${iconColorClass}
                ${isActive || isFinal ? 'scale-110' : ''}
              `}>
                {isCompleted ? (
                   <CheckCircle2 size={32} strokeWidth={3} />
                ) : (
                   <step.icon size={30} strokeWidth={2.5} />
                )}
              </div>

              {/* Text Information */}
              <div className={`flex-1 px-6 transition-all duration-500 ${textOpacityClass} ${isIconLeft ? 'text-left' : 'text-right'}`}>
                <h4 className={`text-base font-black tracking-tight leading-none ${isReached ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </h4>
                <p className={`text-[10px] font-bold text-gray-400 mt-2 leading-relaxed max-w-[150px] inline-block ${isReached ? 'text-gray-500' : 'text-gray-200'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentStatusTracker;

import { CheckCircle2, Clock, Download, MapPin, FileCheck, ShieldCheck, UserCheck } from 'lucide-react';

const DocumentStatusTracker = ({ status = 'verifikasi', format = 'digital' }) => {
  // Map backend status to step IDs for the tracker
  const statusMap = {
    'verifikasi': 1,
    'penandatanganan_rt': 2,
    'penandatanganan_rw': 3,
    'penandatanganan': 4,
    'siap_didownload': 5,
    'siap_diambil': 5,
    'selesai': 6,
    'ditolak': 0
  };

  const currentStepId = statusMap[status] || 1;

  // Define steps based on format
  const getSteps = () => {
    const baseSteps = [
      { id: 1, label: 'Verifikasi', desc: 'Peninjauan oleh Admin Kelurahan.', icon: Clock },
    ];

    if (format === 'digital') {
      baseSteps.push(
        { id: 2, label: 'TTD RT', desc: 'Menunggu tanda tangan Ketua RT.', icon: UserCheck },
        { id: 3, label: 'TTD RW', desc: 'Menunggu tanda tangan Ketua RW.', icon: ShieldCheck },
      );
    }

    baseSteps.push(
      { id: 4, label: 'TTD Lurah', desc: 'Proses tanda tangan Pejabat Kelurahan.', icon: FileCheck },
      { id: 5, label: format === 'digital' ? 'Siap Download' : 'Siap Diambil', desc: format === 'digital' ? 'e-Surat sudah terbit.' : 'Silakan ambil di kantor.', icon: format === 'digital' ? Download : MapPin }
    );

    return baseSteps;
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  return (
    <div className="py-10 px-4 w-full max-w-sm mx-auto relative">
      {/* Dynamic Connector Path */}
      <div className="absolute inset-0 pointer-events-none px-4" style={{ top: '64px', bottom: '64px' }}>
        <svg width="100%" height="100%" viewBox={`0 0 100 ${(totalSteps - 1) * 100}`} preserveAspectRatio="none" className="overflow-visible">
          {/* Base Path */}
          <path 
            d={steps.map((_, i) => `${i === 0 ? 'M' : 'L'} ${i % 2 === 0 ? 18 : 82} ${i * 100}`).join(' ')} 
            fill="none" 
            stroke="#F1F5F9" 
            strokeWidth="4" 
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* Steps List */}
      <div className="space-y-12 relative z-10">
        {steps.map((step, index) => {
          const isCompleted = currentStepId > step.id;
          const isActive = currentStepId === step.id;
          const isReached = currentStepId >= step.id;
          
          const iconColorClass = isCompleted
            ? 'bg-[#34A853] border-[#34A853] text-white shadow-green-100' 
            : isActive 
              ? 'bg-[#0047AB] border-[#0047AB] text-white shadow-blue-100' 
              : 'bg-white border-gray-100 text-gray-300 shadow-none';
          
          const textOpacityClass = isReached ? 'opacity-100' : 'opacity-30';
          const isIconLeft = index % 2 === 0;

          return (
            <div key={step.id} className={`flex items-center ${isIconLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 border-2 z-20 shadow-lg ${iconColorClass} ${isActive ? 'scale-110' : ''}`}>
                {isCompleted ? <CheckCircle2 size={28} strokeWidth={3} /> : <step.icon size={26} strokeWidth={2.5} />}
              </div>
              <div className={`flex-1 px-4 transition-all duration-500 ${textOpacityClass} ${isIconLeft ? 'text-left' : 'text-right'}`}>
                <h4 className={`text-sm font-black tracking-tight ${isReached ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</h4>
                <p className={`text-[9px] font-bold text-gray-400 mt-1 leading-tight ${isReached ? 'text-gray-500' : 'text-gray-200'}`}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentStatusTracker;

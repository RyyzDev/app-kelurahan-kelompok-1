import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FilePlus, ClipboardList, ShieldCheck } from 'lucide-react';

const PersuratanMenuPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Buat Surat',
      description: 'Ajukan permohonan surat keterangan baru (Domisili, Pengantar, dll).',
      icon: FilePlus,
      color: 'bg-red-50',
      iconColor: 'text-[#EF4444]',
      path: '/warga/persuratan/buat'
    },
    {
      title: 'Lihat Status Surat Saya',
      description: 'Pantau status pengerjaan dokumen dan download hasil e-Surat Anda.',
      icon: ClipboardList,
      color: 'bg-blue-50',
      iconColor: 'text-[#0047AB]',
      path: '/warga/persuratan/status'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/warga')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex items-center space-x-2">
           <ShieldCheck className="text-[#0047AB]" size={24} strokeWidth={2.5} />
           <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Layanan Persuratan</h1>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-10">
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Administrasi Warga</h2>
           <p className="text-gray-500 font-medium mt-2">Pilih layanan persuratan yang Anda butuhkan di bawah ini.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#0047AB]/20 transition-all duration-300 group text-left flex items-center space-x-6"
            >
              <div className={`${item.color} w-20 h-20 rounded-[24px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className={item.iconColor} size={36} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-800 mb-1 group-hover:text-[#0047AB] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.description}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:text-[#0047AB] group-hover:bg-blue-50 transition-all">
                 <ArrowLeft className="rotate-180" size={20} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PersuratanMenuPage;

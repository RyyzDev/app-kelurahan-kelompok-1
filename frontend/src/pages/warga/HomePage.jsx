import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { 
  FileEdit, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Home, 
  LayoutGrid, 
  Bell, 
  User as UserIcon,
  AlertCircle
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const services = [
    { name: 'Layanan Persuratan', icon: FileEdit, color: 'bg-[#EF4444]', iconColor: 'text-white', path: '/warga/persuratan' },
    { name: 'Bansos Digital', icon: FileText, color: 'bg-[#E6F6F4]', iconColor: 'text-[#34A853]', path: '/warga/bansos' },
    { name: 'Saran & Aspirasi', icon: MessageSquare, color: 'bg-[#E6F0F9]', iconColor: 'text-[#0047AB]', path: '/warga/aspirasi' },
    { name: 'UMKM Corner', icon: ShoppingBag, color: 'bg-[#F9F1E6]', iconColor: 'text-[#D97706]', path: '/warga/umkm' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans relative overflow-x-hidden">
      {/* Header Section with Sky Gradient & Skyline */}
      <div className="h-64 bg-gradient-to-b from-[#BFDBFE] to-[#F8FAFC] relative overflow-hidden">
        {/* Sky Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/40 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white/30 rounded-full blur-3xl"></div>
        
        {/* Centered Logo Placeholder */}
        <div className="absolute top-6 left-0 right-0 flex justify-center items-center flex-col z-10">
           <div className="flex items-center space-x-1">
              <div className="bg-[#34A853] w-3 h-3 rounded-sm"></div>
              <div className="bg-[#FBBC05] w-3 h-3 rounded-sm"></div>
              <div className="bg-[#EA4335] w-3 h-3 rounded-sm"></div>
           </div>
           <h1 className="text-sm font-black text-gray-800 tracking-tighter mt-1 uppercase">SI-<span className="text-[#0047AB]">GERCAP</span></h1>
        </div>

        {/* Landmarks / Landmark Silhouette */}
        <div className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none flex justify-center items-end h-full">
          <svg viewBox="0 0 1200 200" fill="#0047AB" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <rect x="50" y="100" width="40" height="100" />
            <rect x="100" y="60" width="30" height="140" />
            <rect x="140" y="120" width="50" height="80" />
            <rect x="200" y="40" width="20" height="160" />
            <rect x="230" y="80" width="40" height="120" />
            <rect x="300" y="50" width="60" height="150" />
            <rect x="380" y="110" width="30" height="90" />
            <rect x="420" y="30" width="20" height="170" />
            <rect x="460" y="70" width="50" height="130" />
            <path d="M550 50 L580 0 L610 50 V200 H550 Z" />
            <rect x="650" y="80" width="40" height="120" />
            <rect x="710" y="40" width="20" height="160" />
            <rect x="750" y="100" width="50" height="100" />
            <rect x="820" y="60" width="30" height="140" />
            <rect x="870" y="120" width="40" height="80" />
            <rect x="930" y="30" width="20" height="170" />
            <rect x="970" y="70" width="60" height="130" />
          </svg>
        </div>
      </div>

      {/* Floating User Greeting Card */}
      <div className="px-5 -mt-20 relative z-20 text-center">
        <div className="bg-white rounded-[28px] p-5 shadow-xl shadow-blue-900/5 border border-white flex items-center space-x-4 max-w-lg mx-auto">
          <div className="bg-[#FFF7ED] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
             <span className="text-2xl">👋</span>
          </div>
          <div className="overflow-hidden text-left">
            <span>Halo, </span><h2 className="text-lg font-extrabold text-gray-800 leading-tight truncate">{user?.name || 'Warga'}</h2>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">Pelayanan Gercap & Terintegrasi.</p>
          </div>
        </div>
      </div>

      {/* Menu Header */}
      <div className="px-6 mt-8 flex justify-between items-center max-w-lg mx-auto">
        <h3 className="font-extrabold text-gray-800 tracking-tight">Menu Layanan</h3>
      </div>

      {/* Service Icons Grid */}
      <div className="px-5 mt-8 grid grid-cols-3 gap-y-10 max-w-lg mx-auto">
        {services.map((service, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(service.path)}
            className="flex flex-col items-center group"
          >
            <div className={`${service.color} ${service.iconColor} w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-all duration-300`}>
               <service.icon size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-extrabold text-gray-600 text-center leading-tight max-w-[80px]">
              {service.name}
            </span>
          </button>
        ))}
      </div>

      {/* Promotional Banner */}
      <div className="px-5 mt-12 max-w-lg mx-auto">
        <div className="bg-[#0047AB] rounded-[32px] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-blue-200">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
           <div className="relative z-10 text-left">
              <h4 className="text-2xl font-black leading-tight max-w-[200px]">Pelayanan Digital Lebih Mudah</h4>
              <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Update Terbaru</span>
              </div>
           </div>
        </div>
      </div>

      {/* Event Section */}
      <div className="px-5 mt-10 max-w-lg mx-auto">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
           <h3 className="text-left font-extrabold text-gray-800 mb-6">Informasi & Pengumuman</h3>
           <div className="py-4 text-center">
              <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-300">
                 <AlertCircle size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 italic">Belum ada pengumuman baru</p>
           </div>
        </div>
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-6 left-5 right-5 z-50 max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[24px] shadow-2xl shadow-blue-900/10 p-2 flex items-center justify-between">
          <button onClick={() => navigate('/warga')} className="flex flex-col items-center flex-1 py-2">
            <div className="bg-[#0047AB] p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Home size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black text-[#0047AB] mt-1 uppercase tracking-widest">Beranda</span>
          </button>
          
          <button className="flex flex-col items-center flex-1 py-2 text-gray-400 hover:text-[#0047AB] transition-colors">
            <LayoutGrid size={20} strokeWidth={2} />
          </button>

          <button className="flex flex-col items-center flex-1 py-2 text-gray-400 hover:text-[#0047AB] transition-colors">
            <Bell size={20} strokeWidth={2} />
          </button>

          <button 
            onClick={() => dispatch(logout())}
            className="flex flex-col items-center flex-1 py-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <UserIcon size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default HomePage;

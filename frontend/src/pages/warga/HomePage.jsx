import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FileEdit, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  Home, 
  LayoutGrid, 
  Bell, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import ChatDrawer from '../../components/chatbot/ChatDrawer';
import PersuratanDrawer from '../../components/persuratan/PersuratanDrawer';
import BansosDrawer from '../../components/bansos/BansosDrawer';
import VaksinasiDrawer from '../../components/vaksinasi/VaksinasiDrawer';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPersuratanOpen, setIsPersuratanOpen] = useState(false);
  const [isBansosOpen, setIsBansosOpen] = useState(false);
  const [isVaksinasiOpen, setIsVaksinasiOpen] = useState(false);

  const services = [
    { 
      name: 'Layanan Persuratan', 
      icon: FileEdit, 
      color: 'bg-[#EF4444]', 
      iconColor: 'text-white', 
      onClick: () => setIsPersuratanOpen(true)
    },
    {
      name: 'Vaksinasi',
      icon: FileEdit,
      color: 'bg-[#E6F6F4}',
      iconColor: 'text-[#34A853]',
      onClick: () => setIsVaksinasiOpen(true)
    },
    { 
      name: 'Bansos Digital', 
      icon: FileText, 
      color: 'bg-[#E6F6F4]', 
      iconColor: 'text-[#34A853]', 
      onClick: () => setIsBansosOpen(true)
    },
    { 
      name: 'Saran & Aspirasi', 
      icon: MessageSquare, 
      color: 'bg-[#E6F0F9]', 
      iconColor: 'text-[#0047AB]', 
      onClick: () => navigate('/warga/aspirasi')
    },
    { 
      name: 'UMKM Corner', 
      icon: ShoppingBag, 
      color: 'bg-[#F9F1E6]', 
      iconColor: 'text-[#D97706]', 
      onClick: () => navigate('/warga/umkm')
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans relative overflow-x-hidden">
      {/* Header Section */}
      <div className="h-64 bg-gradient-to-b from-[#BFDBFE] to-[#F8FAFC] relative overflow-hidden">
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/40 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white/30 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 pointer-events-none z-0">
           {[...Array(5)].map((_, i) => (
             <div 
               key={i} 
               className="crane-container"
               style={{ 
                 top: `${20 + (i * 8)}%`, 
                 animationDelay: `${i * 1.5}s`,
                 animationDuration: `${15 + (i * 2)}s` 
               }}
             >
               <svg viewBox="0 0 50 50" className="crane w-8 h-8 fill-gray-400 opacity-40">
                  <path className="wing-top" d="M25 25 L40 10 L35 25 Z" />
                  <path className="wing-bottom" d="M25 25 L40 40 L35 25 Z" />
                  <path d="M10 25 L25 25 L20 28 L10 25 Z" />
               </svg>
             </div>
           ))}
        </div>

        <div className="absolute top-6 left-0 right-0 flex justify-center items-center flex-col z-10">
           <div className="flex items-center space-x-1">
              <div className="bg-[#34A853] w-3 h-3 rounded-sm"></div>
              <div className="bg-[#FBBC05] w-3 h-3 rounded-sm"></div>
              <div className="bg-[#EA4335] w-3 h-3 rounded-sm"></div>
           </div>
           <h1 className="text-sm font-black text-gray-800 tracking-tighter mt-1 uppercase text-center">SI-<span className="text-[#0047AB]">GERCAP</span></h1>
           <h3 className="text-[11px] text-gray-330 font-small leading-relaxed">Sistem Digital Kelurahan Cepat & Terintegrasi</h3>
        </div>

        <div className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none flex items-end">
          <svg viewBox="0 0 1200 120" fill="#0047AB" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32" preserveAspectRatio="none">
            <rect x="50" y="60" width="40" height="60" /><rect x="100" y="30" width="30" height="90" /><path d="M550 30 L580 0 L610 30 V120 H550 Z" />
            <rect x="650" y="50" width="40" height="70" /><rect x="970" y="40" width="60" height="80" />
          </svg>
        </div>
      </div>

      {/* Floating Greeting */}
      <div className="px-5 -mt-20 relative z-20">
        <div className="bg-white rounded-[28px] p-5 shadow-xl shadow-blue-900/5 border border-white flex items-center space-x-4 max-w-lg mx-auto">
          <div className="bg-[#FFF7ED] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
             <span className="text-2xl">👋</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-800 leading-tight truncate">Halo, {user?.name}</h2>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">Punya keperluan apa hari ini?</p>
          </div>
        </div>
      </div>

      {/* Services Icons */}
      <div className="px-5 mt-12 grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {services.map((service, idx) => (
          <button key={idx} onClick={service.onClick} className="flex flex-col items-center group text-center">
            <div className={`${service.color} ${service.iconColor} w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-all duration-300`}>
               <service.icon size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-extrabold text-gray-500 leading-tight">
              {service.name}
            </span>
          </button>
        ))}
      </div>

      {/* Banner */}
      <div className="px-5 mt-12 max-w-lg mx-auto">
        <div className="bg-[#0047AB] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           <h4 className="text-2xl font-black leading-tight max-w-[200px] relative z-10">Pelayanan Digital Lebih Mudah</h4>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-5 right-5 z-50 max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] shadow-2xl shadow-blue-900/10 p-2 flex items-center justify-between">
          <button 
            onClick={() => navigate('/warga')} 
            className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 ${isActive('/warga') ? 'text-[#0047AB]' : 'text-gray-400'}`}
          >
            <div className={`${isActive('/warga') ? 'bg-blue-50 p-2.5 rounded-2xl shadow-inner' : ''}`}>
              <Home size={22} strokeWidth={isActive('/warga') ? 3 : 2} />
            </div>
            <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${isActive('/warga') ? 'opacity-100' : 'opacity-0'}`}>Beranda</span>
          </button>
          
          <button 
            onClick={() => setIsPersuratanOpen(true)}
            className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 text-gray-400`}
          >
            <div className="p-2.5">
               <LayoutGrid size={22} strokeWidth={2} />
            </div>
          </button>

          <button onClick={() => setIsChatOpen(true)} className="flex flex-col items-center -mt-10 px-2">
            <div className="bg-[#0047AB] p-4 rounded-[22px] text-white shadow-xl shadow-blue-200 border-4 border-white active:scale-95 transition-all">
              <Sparkles size={28} strokeWidth={2.5} />
            </div>
          </button>

          <button className="flex flex-col items-center flex-1 py-2 text-gray-400">
            <Bell size={22} strokeWidth={2} />
          </button>

          <button 
            onClick={() => navigate('/warga/profil')}
            className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 ${isActive('/warga/profil') ? 'text-[#0047AB]' : 'text-gray-400'}`}
          >
            <div className={`${isActive('/warga/profil') ? 'bg-blue-50 p-2.5 rounded-2xl shadow-inner' : ''}`}>
              <UserIcon size={22} strokeWidth={isActive('/warga/profil') ? 3 : 2} />
            </div>
            <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${isActive('/warga/profil') ? 'opacity-100' : 'opacity-0'}`}>Profil</span>
          </button>
        </div>
      </div>

      {/* Drawers */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <PersuratanDrawer isOpen={isPersuratanOpen} onClose={() => setIsPersuratanOpen(false)} />
      <BansosDrawer isOpen={isBansosOpen} onClose={() => setIsBansosOpen(false)} />
      <VaksinasiDrawer isOpen={isVaksinasiOpen} onClose={() => setIsVaksinasiOpen(false)} />

      <style dangerouslySetInnerHTML={{ __html: `
        .crane-container { position: absolute; left: -10%; animation: fly-across linear infinite; }
        .wing-top { transform-origin: 25px 25px; animation: flap-top 0.4s ease-in-out infinite alternate; }
        .wing-bottom { transform-origin: 25px 25px; animation: flap-bottom 0.4s ease-in-out infinite alternate; }
        @keyframes fly-across { 0% { left: -10%; transform: scaleX(1); } 45% { left: 110%; transform: scaleX(1); } 50% { left: 110%; transform: scaleX(-1); } 95% { left: -10%; transform: scaleX(-1); } 100% { left: -10%; transform: scaleX(1); } }
        @keyframes flap-top { from { transform: rotate(0deg); } to { transform: rotate(-60deg); } }
        @keyframes flap-bottom { from { transform: rotate(0deg); } to { transform: rotate(60deg); } }
      `}} />
    </div>
  );
};

export default HomePage;

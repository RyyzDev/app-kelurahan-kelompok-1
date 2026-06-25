import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FileEdit, 
  FileText,
  Syringe, 
  MessageSquare, 
  ShoppingBag, 
  Home, 
  LayoutGrid, 
  Bell, 
  User as UserIcon,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  CalendarDays,
  Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import ChatDrawer from '../../components/chatbot/ChatDrawer';
import PersuratanDrawer from '../../components/persuratan/PersuratanDrawer';
import PengumumanDrawer from '../../components/pengumuman/PengumumanDrawer';
import VaksinasiDrawer from '../../components/vaksinasi/VaksinasiDrawer';
import { getAllEvents, registerForEvent, getMyRegistrations } from '../../services/eventService';
import { getAllPengumuman } from '../../services/pengumumanService';
import EventDetailDrawer, { TicketModal } from '../../components/events/EventDetailDrawer';
import toast from 'react-hot-toast';

const STATIC_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPersuratanOpen, setIsPersuratanOpen] = useState(false);
  const [isPengumumanOpen, setIsPengumumanOpen] = useState(false);
  const [isVaksinasiOpen, setIsVaksinasiOpen] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Drawer & Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newRegistration, setNewRegistration] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, registrationResponse, pengumumanResponse] = await Promise.all([
          getAllEvents(),
          getMyRegistrations(),
          getAllPengumuman()
        ]);
        setEvents(eventResponse.data);
        setMyRegistrations(registrationResponse.data);
        setPengumuman(pengumumanResponse.data || []);
      } catch (error) {
        toast.error('Gagal memuat data homepage.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDrawerOpen(true);
  };

  const handleRegister = async (eventId) => {
    setIsRegistering(true);
    try {
       const response = await registerForEvent(eventId);
      setNewRegistration(response.data);
      // Add to local state to update UI immediately
      setMyRegistrations(prev => [...prev, response.data]);
      setIsEventDrawerOpen(false);
      setIsTicketModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftar event.');
    } finally {
      setIsRegistering(false);
    }
  };

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
      icon: Syringe,
      color: 'bg-[#D1FAE5]',
      iconColor: 'text-[#059669]',
      onClick: () => setIsVaksinasiOpen(true)
    },
    { 
      name: 'Pengumuman Resmi', 
      icon: Megaphone, 
      color: 'bg-[#FEF3C7]', 
      iconColor: 'text-[#D97706]', 
      onClick: () => setIsPengumumanOpen(true)
    },
    { 
      name: 'UMKM Corner', 
      icon: ShoppingBag, 
      color: 'bg-[#DBEAFE]', 
      iconColor: 'text-[#0047AB]', 
      onClick: () => navigate('/warga/umkm')
    },
    { 
      name: 'Aspirasi Warga', 
      icon: MessageSquare, 
      color: 'bg-[#F3E8FF]', 
      iconColor: 'text-[#8B5CF6]', 
      onClick: () => navigate('/warga/aspirasi')
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
           <h1 className="text-sm font-black text-gray-800 tracking-tighter mt-1 uppercase text-center font-sans">SI-<span className="text-[#0047AB]">GERCAP</span></h1>
           <h3 className="text-[9px] font-black text-[#0047AB]/50 uppercase tracking-[0.3em] leading-relaxed">Kelurahan Digital</h3>
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
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-gray-800 leading-tight truncate">Halo, {user?.nama_lengkap?.split(' ')[0]}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Sudah tersinkronisasi</p>
          </div>
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-50 p-3 rounded-2xl text-[#0047AB] active:scale-90 transition-all">
             <Sparkles size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Services Icons */}
      <div className="px-5 mt-12 grid grid-cols-5 gap-4 max-w-lg mx-auto">
        {services.map((service, idx) => (
          <button key={idx} onClick={service.onClick} className="flex flex-col items-center group text-center">
            <div className={`${service.color} ${service.iconColor} w-14 h-14 rounded-3xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-all duration-300 transform group-hover:rotate-6`}>
               <service.icon size={22} strokeWidth={3} />
            </div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight leading-tight">
              {service.name.split(' ')[0]} <br/> {service.name.split(' ')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Banner */}
      <div className="px-5 mt-12 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-[#0047AB] to-[#003580] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Info Pelayanan</span>
              <h4 className="text-2xl font-black leading-tight max-w-[200px] mt-2">Pelayanan Digital Lebih Mudah</h4>
              <button onClick={() => setIsPersuratanOpen(true)} className="mt-6 px-6 py-3 bg-white text-[#0047AB] rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-black/10 active:scale-95 transition-all">Mulai Sekarang</button>
           </div>
           <div className="absolute -bottom-6 -right-6 opacity-20">
              <FileEdit size={120} strokeWidth={1} />
           </div>
        </div>
      </div>

      {/* NEW: Event Kelurahan Slider */}
      <div className="mt-12 space-y-6">
        <div className="px-6 flex items-center justify-between max-w-lg mx-auto">
           <h3 className="text-lg font-black text-gray-900 tracking-tight">Event Kelurahan</h3>
           <button className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest">Lihat Semua</button>
        </div>
        
        <div className="flex overflow-x-auto px-6 space-x-5 no-scrollbar pb-4 max-w-lg mx-auto scroll-smooth">
          {isLoading ? (
            [1, 2].map(i => (
              <div key={i} className="w-72 h-48 bg-white rounded-[32px] shrink-0 animate-pulse border border-gray-100 shadow-sm" />
            ))
          ) : events.map((event) => (
            <div key={event.id} onClick={() => handleEventClick(event)} className={`w-72 bg-white rounded-[32px] border border-gray-100 overflow-hidden shrink-0 shadow-xl shadow-blue-900/5 group transition-all cursor-pointer ${event.status === 'berakhir' ? 'grayscale opacity-70' : 'hover:scale-105'}`}>
               <div className="h-32 relative overflow-hidden">
                  {event.foto_url ? (
                     <img src={`${STATIC_URL}${event.foto_url}`} alt={event.nama_event} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><Calendar size={40}/></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white">
                     <MapPin size={10} strokeWidth={3} />
                     <span className="text-[9px] font-black uppercase tracking-widest">{event.lokasi || 'Online'}</span>
                  </div>
                  {event.status === 'berakhir' && (
                     <div className="absolute top-3 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                        Berakhir
                     </div>
                  )}
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                     <h4 className="font-black text-gray-800 text-sm truncate">{event.nama_event}</h4>
                     <div className="flex items-center space-x-2 text-gray-400 mt-1">
                        <Calendar size={10} strokeWidth={3} />
                        <span className="text-[9px] font-bold">{new Date(event.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'})}</span>
                     </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-xl text-[#0047AB]">
                     <ChevronRight size={16} strokeWidth={3} />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Pengumuman Terbaru Column */}
      <div className="mt-12 px-6 space-y-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
           <h3 className="text-lg font-black text-gray-900 tracking-tight">Pengumuman Terbaru</h3>
           <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-[#0047AB] rounded-full animate-ping"></div>
              <span className="text-[8px] font-black text-[#0047AB] uppercase tracking-widest">Informasi</span>
           </div>
        </div>

        <div className="space-y-4">
           {isLoading ? (
             [1, 2].map(i => (
               <div key={i} className="w-full h-24 bg-white rounded-[32px] animate-pulse border border-gray-100 shadow-sm" />
             ))
           ) : pengumuman.length === 0 ? (
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 text-center text-gray-400 font-bold text-xs">
                Belum ada pengumuman saat ini.
             </div>
           ) : pengumuman.slice(0, 3).map((item) => (
             <div key={item.id} onClick={() => setIsPengumumanOpen(true)} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 flex items-center space-x-5 group hover:shadow-2xl transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-blue-50 text-[#0047AB]">
                   <Megaphone size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                         PENGUMUMAN
                      </span>
                      <p className="text-[9px] font-bold text-gray-300">
                         {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </p>
                   </div>
                   <h4 className="font-black text-gray-800 text-sm truncate">{item.judul}</h4>
                   <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">{item.konten}</p>
                </div>
                <div className="text-gray-200 group-hover:text-[#0047AB] transition-colors">
                   <ChevronRight size={18} strokeWidth={3} />
                </div>
             </div>
           ))}
        </div>
        
        {pengumuman.length > 0 && (
          <button onClick={() => setIsPengumumanOpen(true)} className="w-full py-4 bg-gray-50 border border-gray-100 rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#0047AB] transition-all active:scale-95">
             Lihat Selengkapnya
          </button>
        )}
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

          <button 
            onClick={() => navigate('/warga/notifikasi')}
            className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 ${isActive('/warga/notifikasi') ? 'text-[#0047AB]' : 'text-gray-400'}`}
          >
            <div className={`${isActive('/warga/notifikasi') ? 'bg-blue-50 p-2.5 rounded-2xl shadow-inner' : 'p-2.5'}`}>
              <Bell size={22} strokeWidth={isActive('/warga/notifikasi') ? 3 : 2} />
            </div>
            <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${isActive('/warga/notifikasi') ? 'opacity-100' : 'opacity-0'}`}>Notifikasi</span>
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
      <PengumumanDrawer isOpen={isPengumumanOpen} onClose={() => setIsPengumumanOpen(false)} />
      <VaksinasiDrawer isOpen={isVaksinasiOpen} onClose={() => setIsVaksinasiOpen(false)} />

      {selectedEvent && (
        <EventDetailDrawer 
          event={selectedEvent}
          isOpen={isEventDrawerOpen}
          onClose={() => setIsEventDrawerOpen(false)}
          onRegister={handleRegister}
          isRegistered={myRegistrations.some(reg => reg.event_id === selectedEvent.id)}
          isLoading={isRegistering}
        />
      )}

      {isTicketModalOpen && newRegistration && (
        <TicketModal
          registration={newRegistration}
          event={events.find(e => e.id === newRegistration.event_id)}
          onClose={() => setIsTicketModalOpen(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .crane-container { position: absolute; left: -10%; animation: fly-across linear infinite; }
        .wing-top { transform-origin: 25px 25px; animation: flap-top 0.4s ease-in-out infinite alternate; }
        .wing-bottom { transform-origin: 25px 25px; animation: flap-bottom 0.4s ease-in-out infinite alternate; }
        @keyframes fly-across { 0% { left: -10%; transform: scaleX(1); } 45% { left: 110%; transform: scaleX(1); } 50% { left: 110%; transform: scaleX(-1); } 95% { left: -10%; transform: scaleX(-1); } 100% { left: -10%; transform: scaleX(1); } }
        @keyframes flap-top { from { transform: rotate(0deg); } to { transform: rotate(-60deg); } }
        @keyframes flap-bottom { from { transform: rotate(0deg); } to { transform: rotate(60deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default HomePage;

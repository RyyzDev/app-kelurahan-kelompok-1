import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Mail, 
  CreditCard, 
  Calendar,
  Bell,
  HelpCircle,
  Home,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import ChatDrawer from '../../components/chatbot/ChatDrawer';
import PersuratanDrawer from '../../components/persuratan/PersuratanDrawer';
import BansosDrawer from '../../components/bansos/BansosDrawer';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPersuratanOpen, setIsPersuratanOpen] = useState(false);
  const [isBansosOpen, setIsBansosOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { title: 'Pengaturan Akun', icon: Settings, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Notifikasi', icon: Bell, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Keamanan', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Pusat Bantuan', icon: HelpCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-6 flex items-center sticky top-0 z-10 shadow-sm justify-center">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight text-center">Profil Saya</h1>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8">
        {/* User Card */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-primary"></div>
          
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
             <UserIcon size={48} className="text-[#0047AB]" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name || 'Warga SI-GERCAP'}</h2>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Warga Terverifikasi</p>
        </div>

        {/* Identity Info */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-50 bg-[#F8FAFC]/50">
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Informasi Identitas</h3>
           </div>
           <div className="p-2">
              <div className="flex items-center space-x-4 p-4">
                 <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                    <CreditCard size={18} strokeWidth={2.5} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor NIK</p>
                    <p className="font-bold text-gray-700">{user?.nik || '-'}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border-t border-gray-50">
                 <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                    <Mail size={18} strokeWidth={2.5} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Terdaftar</p>
                    <p className="font-bold text-gray-700">{user?.email || '-'}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border-t border-gray-50">
                 <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                    <Calendar size={18} strokeWidth={2.5} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Lahir</p>
                    <p className="font-bold text-gray-700">01 Januari 1990</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Menu List */}
        <div className="space-y-3">
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              className="w-full bg-white p-5 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`${item.bgColor} ${item.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                  <item.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-gray-700">{item.title}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0047AB] transition-colors" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => dispatch(logout())}
          className="w-full py-5 bg-red-50 text-red-600 font-black rounded-[24px] uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-red-100 transition-all active:scale-95 mt-8 border border-red-100"
        >
          <LogOut size={18} strokeWidth={3} />
          <span>Keluar Aplikasi</span>
        </button>
      </main>

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
    </div>
  );
};

export default ProfilePage;

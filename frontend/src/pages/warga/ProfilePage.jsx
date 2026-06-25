import { useState, useEffect } from 'react';
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
  Home,
  LayoutGrid,
  Sparkles,
  Phone,
  MapPin,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2 as CheckIcon
} from 'lucide-react';
import ChatDrawer from '../../components/chatbot/ChatDrawer';
import PersuratanDrawer from '../../components/persuratan/PersuratanDrawer';
import PengumumanDrawer from '../../components/pengumuman/PengumumanDrawer';
import { getProfile, updateProfile, changePassword } from '../../services/userService';
import toast from 'react-hot-toast';

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {/* User Card Skeleton */}
    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-100"></div>
      <div className="w-24 h-24 bg-gray-100 rounded-[32px] mx-auto mb-6"></div>
      <div className="h-8 bg-gray-100 rounded-lg w-3/4 mx-auto mb-3"></div>
      <div className="h-6 bg-gray-50 rounded-full w-1/2 mx-auto"></div>
    </div>

    {/* Identity Info Skeleton */}
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-5 border-t first:border-t-0 border-gray-50">
          <div className="bg-gray-100 p-3 rounded-2xl w-11 h-11"></div>
          <div className="flex-1 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Menu List Skeleton */}
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="bg-gray-100 p-3.5 rounded-2xl w-12 h-12"></div>
            <div className="space-y-2 text-left">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-100 rounded w-48"></div>
            </div>
          </div>
          <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
        </div>
      ))}
    </div>
    
    {/* Logout Button Skeleton */}
    <div className="h-16 bg-gray-100 rounded-[32px] mt-10"></div>
  </div>
);

const ProfilePage = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPersuratanOpen, setIsPersuratanOpen] = useState(false);
  const [isPengumumanOpen, setIsPengumumanOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    phone: '',
    alamat: '',
    tanggal_lahir: ''
  });

  const [pwdData, setPwdData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [showPwd, setShowPwd] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
      setFormData({
        nama_lengkap: response.data.nama_lengkap,
        email: response.data.email,
        phone: response.data.phone || '',
        alamat: response.data.alamat || '',
        tanggal_lahir: response.data.tanggal_lahir ? response.data.tanggal_lahir.split('T')[0] : ''
      });
    } catch (err) {
      toast.error('Gagal memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Memperbarui profil...');
    try {
      await updateProfile(formData);
      toast.success('Profil berhasil diperbarui!', { id: toastId });
      setIsEditMode(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil', { id: toastId });
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Mengganti kata sandi...');
    try {
      await changePassword(pwdData);
      toast.success('Kata sandi berhasil diganti!', { id: toastId });
      setIsPasswordModalOpen(false);
      setPwdData({ old_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengganti kata sandi', { id: toastId });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-6 flex items-center sticky top-0 z-10 shadow-sm justify-center">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight text-center">Profil Saya</h1>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* User Card */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0047AB] to-blue-400"></div>
              
              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                <UserIcon size={48} className="text-[#0047AB]" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profile?.nama_lengkap}</h2>
              <p className="text-[10px] font-black text-[#34A853] mt-1.5 uppercase tracking-[0.2em] bg-green-50 px-4 py-1.5 rounded-full inline-block">Warga Terverifikasi</p>
            </div>

            {isEditMode ? (
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Edit Data Diri</h3>
                    <button type="button" onClick={() => setIsEditMode(false)} className="text-gray-400"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Nama Lengkap</label>
                      <input 
                        required
                        value={formData.nama_lengkap}
                        onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Alamat Email</label>
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Nomor HP</label>
                          <input 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm"
                            placeholder="08..."
                          />
                      </div>
                      <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Tgl Lahir</label>
                          <input 
                            type="date"
                            value={formData.tanggal_lahir}
                            onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm"
                          />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Alamat Lengkap</label>
                      <textarea 
                        rows={3}
                        value={formData.alamat}
                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                </div>

                <button type="submit" className="w-full py-5 bg-[#0047AB] text-white font-black rounded-3xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-100 active:scale-95 transition-all">Simpan Perubahan</button>
              </form>
            ) : (
              <>
                {/* Identity Info */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-2">
                  <div className="flex items-center space-x-4 p-5">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                        <CreditCard size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Nomor NIK</p>
                        <p className="font-black text-gray-700 truncate">{profile?.nik}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-t border-gray-50">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                        <Mail size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email Terdaftar</p>
                        <p className="font-black text-gray-700 truncate">{profile?.email}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-t border-gray-50">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                        <Phone size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Kontak WhatsApp</p>
                        <p className="font-black text-gray-700">{profile?.phone || 'Belum diatur'}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-t border-gray-50">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                        <MapPin size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Alamat Domisili</p>
                        <p className="text-sm font-bold text-gray-700 leading-tight">{profile?.alamat || 'Belum diatur'}</p>
                      </div>
                  </div>
                </div>

                {/* Menu List */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl transition-transform group-hover:scale-110 shadow-sm">
                        <Settings size={22} strokeWidth={2.5} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-gray-800 text-sm">Pengaturan Akun</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ubah data & informasi diri</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0047AB] transition-colors" />
                  </button>

                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="bg-green-50 text-green-600 p-3.5 rounded-2xl transition-transform group-hover:scale-110 shadow-sm">
                        <Shield size={22} strokeWidth={2.5} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-gray-800 text-sm">Keamanan</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ganti kata sandi berkala</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#34A853] transition-colors" />
                  </button>
                </div>
              </>
            )}

            {/* Logout Button */}
            {!isEditMode && (
              <button 
                onClick={() => {
                  toast.success('Sampai jumpa kembali!');
                  dispatch(logout());
                }}
                className="w-full py-5 bg-red-50 text-red-600 font-black rounded-[32px] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 hover:bg-red-100 transition-all active:scale-95 mt-10 border border-red-100 shadow-sm"
              >
                <LogOut size={18} strokeWidth={3} />
                <span>Keluar Aplikasi</span>
              </button>
            )}
          </>
        )}
      </main>

      {/* Password Modal */}
      {isPasswordModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="bg-green-50 p-2 rounded-xl text-green-600">
                        <Lock size={18} strokeWidth={2.5}/>
                     </div>
                     <h3 className="text-lg font-black text-gray-900 tracking-tight">Ganti Sandi</h3>
                  </div>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors"><X/></button>
               </div>
               <form onSubmit={handleChangePwd} className="p-8 space-y-6">
                  <div className="space-y-4">
                     <div className="relative">
                        <input 
                          required
                          type={showPwd ? 'text' : 'password'}
                          placeholder="Kata Sandi Lama"
                          value={pwdData.old_password}
                          onChange={(e) => setPwdData({...pwdData, old_password: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-sm"
                        />
                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-4 text-gray-300">{showPwd ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                     </div>
                     <div className="h-px bg-gray-50 w-2/3 mx-auto"></div>
                     <div className="relative">
                        <input 
                          required
                          type={showPwd ? 'text' : 'password'}
                          placeholder="Kata Sandi Baru"
                          value={pwdData.new_password}
                          onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-sm"
                        />
                     </div>
                     <div className="relative">
                        <input 
                          required
                          type={showPwd ? 'text' : 'password'}
                          placeholder="Ulangi Sandi Baru"
                          value={pwdData.confirm_new_password}
                          onChange={(e) => setPwdData({...pwdData, confirm_new_password: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-sm"
                        />
                     </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#34A853] text-white font-black rounded-3xl uppercase tracking-widest text-[10px] shadow-xl shadow-green-100 hover:bg-green-700 transition-all">Update Kata Sandi</button>
               </form>
            </div>
         </div>
      )}

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
            <Bell size={22} strokeWidth={isActive('/warga/notifikasi') ? 3 : 2} />
          </button>

          <button 
            onClick={() => navigate('/warga/profil')}
            className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 ${isActive('/warga/profil') ? 'text-[#0047AB]' : 'text-gray-400'}`}
          >
            <div className={`${isActive('/warga/profil') ? 'bg-blue-50 p-2.5 rounded-2xl shadow-inner' : ''}`}>
              <UserIcon size={22} strokeWidth={isActive('/warga/profil') ? 3 : 2} />
            </div>
          </button>
        </div>
      </div>

      {/* Drawers */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <PersuratanDrawer isOpen={isPersuratanOpen} onClose={() => setIsPersuratanOpen(false)} />
      <PengumumanDrawer isOpen={isPengumumanOpen} onClose={() => setIsPengumumanOpen(false)} />
    </div>
  );
};

export default ProfilePage;

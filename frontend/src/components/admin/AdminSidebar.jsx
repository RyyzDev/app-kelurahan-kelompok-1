import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  ClipboardCheck,
  Megaphone
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    toast.success('Berhasil keluar sistem');
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { title: 'Verifikasi Surat', icon: ClipboardCheck, path: '/admin/verifikasi' },
    { title: 'UMKM Management', icon: Store, path: '/admin/umkm' },
    { title: 'Pengaduan Warga', icon: Megaphone, path: '/admin/pengaduan' },
    { title: 'Data Kependudukan', icon: Users, path: '/admin/users' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-8 flex items-center space-x-3 shrink-0">
        <div className="bg-[#0047AB] p-2 rounded-xl shadow-lg shadow-blue-200">
           <LayoutDashboard className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
           <h1 className="text-lg font-black text-gray-900 tracking-tighter leading-none">SI-GERCAP</h1>
           <p className="text-[10px] font-black text-[#0047AB] uppercase tracking-[0.2em] mt-1">Admin Panel</p>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="px-6 mb-10">
         <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0047AB] flex items-center justify-center text-white font-black text-xl shadow-inner">
               {user?.nama_lengkap?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-black text-gray-800 truncate">{user?.nama_lengkap || 'Administrator'}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
            </div>
         </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Utama</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-blue-50 text-[#0047AB] shadow-sm' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-4">
                   <item.icon size={20} strokeWidth={isActive ? 3 : 2} className="transition-transform group-hover:scale-110" />
                   <span className={`text-sm font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
                </div>
                {isActive && (
                   <div className="w-1.5 h-1.5 rounded-full bg-[#0047AB] shadow-[0_0_8px_rgba(0,71,171,0.5)]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-50 space-y-4">
        <button className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all font-bold text-sm">
           <Settings size={20} strokeWidth={2} />
           <span>Pengaturan</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm"
        >
           <LogOut size={20} strokeWidth={3} />
           <span className="uppercase tracking-widest text-[10px]">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

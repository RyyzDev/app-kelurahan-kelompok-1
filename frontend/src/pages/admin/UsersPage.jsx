import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminGetAllUsers, adminGetUserDetail } from '../../services/userService';
import { 
  Users, 
  Search, 
  User as UserIcon, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Store,
  ChevronRight,
  X,
  Loader2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchUsers = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await adminGetAllUsers({ search });
      setUsers(response.data);
    } catch (err) {
      toast.error('Gagal memuat daftar penduduk');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleShowDetail = async (id) => {
    setIsDetailLoading(true);
    try {
      const response = await adminGetUserDetail(id);
      setSelectedUser(response.data);
    } catch (err) {
      toast.error('Gagal memuat detail penduduk');
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto p-10 w-full space-y-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Data Kependudukan</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Basis Data Warga Terintegrasi</p>
          </div>
          
          <div className="relative group min-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0047AB] transition-colors" size={20} strokeWidth={2.5} />
            <input 
              type="text"
              placeholder="Cari Nama, NIK, atau Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm focus:ring-4 focus:ring-[#0047AB]/5 focus:border-[#0047AB]/20 outline-none font-bold text-sm text-gray-700 transition-all placeholder-gray-300"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <Loader2 className="animate-spin text-[#0047AB]" size={40} />
             <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Sinkronisasi Basis Data...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100">
             <Users className="mx-auto text-gray-100 mb-6" size={80} />
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Tidak ada data penduduk yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <button 
                key={u.id}
                onClick={() => handleShowDetail(u.id)}
                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 text-left transition-all hover:shadow-2xl hover:-translate-y-1 group"
              >
                <div className="flex items-center space-x-4 mb-6">
                   <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0047AB] font-black text-lg shadow-inner group-hover:bg-[#0047AB] group-hover:text-white transition-colors duration-500">
                      {u.nama_lengkap.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-800 text-base truncate group-hover:text-[#0047AB] transition-colors">{u.nama_lengkap}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">NIK: {u.nik}</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-200 group-hover:text-[#0047AB] transition-colors" />
                </div>
                
                <div className="space-y-3">
                   <div className="flex items-center space-x-2 text-gray-500">
                      <Mail size={14} />
                      <span className="text-xs font-bold truncate">{u.email}</span>
                   </div>
                   <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Terdaftar {new Date(u.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                      <span className="bg-green-50 text-green-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">Aktif</span>
                   </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* User Detail Modal */}
      {(selectedUser || isDetailLoading) && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95">
               {isDetailLoading ? (
                  <div className="p-20 flex flex-col items-center">
                     <Loader2 className="animate-spin text-[#0047AB]" size={40} />
                     <p className="mt-4 text-gray-400 font-bold uppercase text-[10px]">Memuat Detail...</p>
                  </div>
               ) : (
                  <>
                     <div className="relative h-24 bg-gradient-to-r from-[#0047AB] to-blue-500 shrink-0">
                        <button 
                          onClick={() => setSelectedUser(null)}
                          className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all z-20"
                        >
                          <X size={20} />
                        </button>
                     </div>
                     
                     <div className="px-10 pb-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end -mt-10 mb-10 space-y-4 md:space-y-0 md:space-x-6">
                           <div className="w-24 h-24 bg-white rounded-[32px] p-1 shadow-2xl relative z-20">
                              <div className="w-full h-full bg-blue-50 rounded-[28px] flex items-center justify-center text-[#0047AB] font-black text-3xl">
                                 {selectedUser.nama_lengkap.charAt(0)}
                              </div>
                           </div>
                           <div className="flex-1 relative z-20">
                              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{selectedUser.nama_lengkap}</h3>
                              <div className="flex items-center space-x-3 mt-1">
                                 <span className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Warga Tetap</span>
                                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full flex items-center">
                                    <ShieldCheck size={10} className="mr-1" /> Terverifikasi
                                 </span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           {/* Info Identity */}
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Detail Identitas</h4>
                              <div className="space-y-5">
                                 <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><CreditCard size={18}/></div>
                                    <div>
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nomor NIK</p>
                                       <p className="text-sm font-bold text-gray-700">{selectedUser.nik}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Mail size={18}/></div>
                                    <div>
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                                       <p className="text-sm font-bold text-gray-700">{selectedUser.email}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Phone size={18}/></div>
                                    <div>
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Kontak HP</p>
                                       <p className="text-sm font-bold text-gray-700">{selectedUser.phone || '-'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Calendar size={18}/></div>
                                    <div>
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tgl Lahir</p>
                                       <p className="text-sm font-bold text-gray-700">
                                          {selectedUser.tanggal_lahir ? new Date(selectedUser.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><MapPin size={18}/></div>
                                    <div>
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alamat Domisili</p>
                                       <p className="text-sm font-bold text-gray-700 leading-relaxed">{selectedUser.alamat || '-'}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Activity Summary */}
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Aktivitas Terakhir</h4>
                              <div className="bg-gray-50 rounded-[32px] p-6 space-y-6">
                                 <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center"><FileText size={12} className="mr-2"/> Riwayat Permohonan</p>
                                    <div className="space-y-3">
                                       {selectedUser.permohonan.length > 0 ? selectedUser.permohonan.map(p => (
                                          <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                                             <span className="text-[11px] font-bold text-gray-600 truncate mr-2">{p.jenis_surat.nama_layanan}</span>
                                             <span className="text-[8px] font-black uppercase text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">{p.status.substring(0, 10)}</span>
                                          </div>
                                       )) : (
                                          <p className="text-[10px] text-gray-400 italic">Belum ada pengajuan</p>
                                       )}
                                    </div>
                                 </div>
                                 
                                 <div className="pt-4 border-t border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center"><Store size={12} className="mr-2"/> Status UMKM</p>
                                    {selectedUser.toko ? (
                                       <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                                          <span className="text-[11px] font-bold text-gray-600">{selectedUser.toko.nama_toko}</span>
                                          <span className="text-[8px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Pemilik Toko</span>
                                       </div>
                                    ) : (
                                       <p className="text-[10px] text-gray-400 italic">Tidak memiliki toko</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}
    </AdminLayout>
  );
};

export default UsersPage;

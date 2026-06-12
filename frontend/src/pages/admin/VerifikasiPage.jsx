import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Eye, Search, Filter, ShieldCheck, Loader2, FileCheck, Info, X, Archive, History, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAllPermohonan, verifyPermohonan, signPermohonan, updateProgressRT_RW } from '../../services/adminSuratService';
import toast from 'react-hot-toast';

const VerifikasiPage = () => {
  const [permohonan, setPermohonan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Archive states
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archivedData, setArchivedData] = useState([]);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'verify' | 'sign' | 'detail'
  const [adminNote, setAdminNotes] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');

  const fetchPermohonan = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPermohonan(); // Backend default exclude 'selesai' & 'ditolak'
      setPermohonan(response.data);
    } catch (err) {
      toast.error('Gagal memuat data permohonan');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArchive = async () => {
    setIsArchiveLoading(true);
    try {
      const [resSelesai, resDitolak, resDownload, resAmbil] = await Promise.all([
        getAllPermohonan('selesai'),
        getAllPermohonan('ditolak'),
        getAllPermohonan('siap_didownload'),
        getAllPermohonan('siap_diambil')
      ]);
      
      setArchivedData([
        ...resSelesai.data, 
        ...resDitolak.data, 
        ...resDownload.data, 
        ...resAmbil.data
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      toast.error('Gagal memuat arsip');
    } finally {
      setIsArchiveLoading(false);
    }
  };

  useEffect(() => {
    fetchPermohonan();
  }, []);

  const handleVerifyAction = async (action) => {
    const toastId = toast.loading('Memproses verifikasi...');
    try {
      await verifyPermohonan(selectedItem.id, { action, catatan_admin: adminNote });
      toast.success(action === 'approve' ? 'Permohonan disetujui!' : 'Permohonan ditolak.', { id: toastId });
      setModalType(null);
      fetchPermohonan();
    } catch (err) {
      toast.error('Gagal memproses verifikasi', { id: toastId });
    }
  };

  const handleSignAction = async () => {
    if (!nomorSurat) return toast.error('Nomor surat wajib diisi');
    const toastId = toast.loading('Menandatangani surat...');
    try {
      await signPermohonan(selectedItem.id, { nomor_surat: nomorSurat });
      toast.success('Surat berhasil ditandatangani!', { id: toastId });
      setModalType(null);
      fetchPermohonan();
    } catch (err) {
      toast.error('Gagal memproses tanda tangan', { id: toastId });
    }
  };

  const handleProgressAction = async (role) => {
    const toastId = toast.loading(`Memproses TTD ${role.toUpperCase()}...`);
    try {
      await updateProgressRT_RW(selectedItem.id, { role_signer: role });
      toast.success(`TTD ${role.toUpperCase()} berhasil!`, { id: toastId });
      setModalType(null);
      fetchPermohonan();
    } catch (err) {
      toast.error('Gagal memperbarui progres', { id: toastId });
    }
  };

  const filteredData = permohonan.filter(item => 
    item.user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.nik.includes(searchTerm) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto p-10 w-full space-y-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Permintaan Surat</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Antrean Verifikasi & Tanda Tangan Aktif</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 min-w-[350px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0047AB] transition-colors" size={20} strokeWidth={2.5} />
              <input 
                type="text"
                placeholder="Cari Antrean Aktif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm focus:ring-4 focus:ring-[#0047AB]/5 focus:border-[#0047AB]/20 outline-none font-bold text-sm text-gray-700 transition-all placeholder-gray-300"
              />
            </div>
            <button 
              onClick={() => { setIsArchiveOpen(true); fetchArchive(); }}
              className="flex items-center space-x-3 px-6 py-4 bg-gray-900 text-white rounded-[24px] shadow-xl hover:bg-gray-800 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest shrink-0"
            >
               <Archive size={18} />
               <span>Lihat Arsip</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <Loader2 className="animate-spin text-[#0047AB]" size={40} />
             <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Sinkronisasi Dokumen...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100 shadow-sm">
             <ShieldCheck className="mx-auto text-gray-100 mb-6" size={80} />
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Tidak ada antrean surat aktif</p>
          </div>
        ) : (
          <div className="bg-white rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black">
                  <tr>
                    <th className="px-10 py-6">Warga</th>
                    <th className="px-10 py-6">Jenis Surat</th>
                    <th className="px-10 py-6">Format</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/20 transition-colors duration-300 group">
                      <td className="px-10 py-8">
                        <div className="font-black text-gray-800 text-base group-hover:text-[#0047AB] transition-colors">{item.user.nama_lengkap}</div>
                        <div className="text-[11px] text-gray-300 font-bold mt-1 tracking-widest uppercase">{item.user.nik}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-bold text-gray-700 text-sm">{item.jenis_surat.nama_layanan}</div>
                        <div className="text-[10px] text-gray-400 mt-1 font-medium italic line-clamp-1">"{item.alasan_permohonan}"</div>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${item.format_surat === 'digital' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-orange-600'}`}>
                            {item.format_surat}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#0047AB] animate-pulse"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <button 
                           onClick={() => { setSelectedItem(item); setModalType('verify'); setAdminNotes(item.catatan_admin || ''); }}
                           className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-[#0047AB] transition-all active:scale-95 shadow-lg shadow-gray-200"
                         >
                            Kelola
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Archive Modal */}
      {isArchiveOpen && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#F8FAFC] w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col h-[85vh]">
               <div className="p-10 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-5">
                     <div className="bg-gray-100 p-4 rounded-3xl text-gray-500">
                        <History size={28} strokeWidth={2.5}/>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-gray-900">Arsip Permohonan</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Riwayat Surat Selesai & Ditolak</p>
                     </div>
                  </div>
                  <button onClick={() => setIsArchiveOpen(false)} className="p-3 bg-gray-50 text-gray-300 rounded-2xl hover:text-red-500 transition-all"><X size={24}/></button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                  {isArchiveLoading ? (
                     <div className="h-full flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-gray-300" size={48} />
                        <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Membuka Brankas Data...</p>
                     </div>
                  ) : archivedData.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center">
                        <Archive size={64} className="text-gray-100 mb-6" />
                        <p className="text-gray-400 font-bold italic">Belum ada data di dalam arsip.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {archivedData.map((item) => (
                           <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.status === 'selesai' || item.status.includes('siap') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                 {item.status === 'selesai' || item.status.includes('siap') ? <CheckCircle2 size={24}/> : <XCircle size={24}/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between mb-1">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.id.substring(0, 8).toUpperCase()}</p>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${item.status === 'selesai' || item.status.includes('siap') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                       {item.status}
                                    </span>
                                 </div>
                                 <h4 className="font-black text-gray-800 text-sm truncate">{item.jenis_surat.nama_layanan}</h4>
                                 <p className="text-[10px] text-gray-400 font-bold mt-1">Warga: {item.user.nama_lengkap}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {/* Management Modal (Existing) */}
      {modalType && selectedItem && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB]">
                        <FileCheck size={24} strokeWidth={2.5}/>
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-gray-900">Kelola Permohonan</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {selectedItem.id.substring(0, 8)}</p>
                     </div>
                  </div>
                  <button onClick={() => setModalType(null)} className="p-2 bg-gray-50 text-gray-300 rounded-2xl hover:text-red-500 transition-all"><X/></button>
               </div>

               <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                  {/* Status Helper */}
                  <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start space-x-4">
                     <Info size={20} className="text-[#0047AB] shrink-0 mt-1" />
                     <div className="text-xs font-bold text-[#0047AB] leading-relaxed">
                        Warga: <strong>{selectedItem.user.nama_lengkap}</strong><br/>
                        Surat: <strong>{selectedItem.jenis_surat.nama_layanan}</strong><br/>
                        Status Saat Ini: <span className="uppercase">{selectedItem.status.replace('_', ' ')}</span>
                     </div>
                  </div>

                  {/* Dynamic Action Forms */}
                  {selectedItem.status === 'verifikasi' && (
                     <div className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Catatan Verifikasi (Optional)</label>
                           <textarea 
                             rows={3}
                             value={adminNote}
                             onChange={(e) => setAdminNotes(e.target.value)}
                             className="w-full p-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm text-gray-700"
                             placeholder="Tambahkan catatan jika berkas kurang lengkap..."
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <button onClick={() => handleVerifyAction('approve')} className="py-5 bg-[#34A853] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-100 hover:bg-green-600 transition-all active:scale-95">Setujui Berkas</button>
                           <button onClick={() => handleVerifyAction('reject')} className="py-5 bg-white border border-red-100 text-red-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all active:scale-95">Tolak Permohonan</button>
                        </div>
                     </div>
                  )}

                  {selectedItem.status === 'penandatanganan_rt' && (
                     <button onClick={() => handleProgressAction('rt')} className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">Simulasi TTD RT (Lanjut ke RW)</button>
                  )}

                  {selectedItem.status === 'penandatanganan_rw' && (
                     <button onClick={() => handleProgressAction('rw')} className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">Simulasi TTD RW (Lanjut ke Lurah)</button>
                  )}

                  {selectedItem.status === 'penandatanganan' && (
                     <div className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Nomor Surat Resmi</label>
                           <input 
                             required
                             value={nomorSurat}
                             onChange={(e) => setNomorSurat(e.target.value)}
                             className="w-full p-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-sm text-gray-700"
                             placeholder="Contoh: 145/SKD/KEL-MJ/2026"
                           />
                        </div>
                        <button onClick={handleSignAction} className="w-full py-5 bg-[#0047AB] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-100 hover:bg-[#003580] transition-all active:scale-95">Tanda Tangani & Terbitkan</button>
                     </div>
                  )}

                  {['siap_didownload', 'siap_diambil', 'selesai', 'ditolak'].includes(selectedItem.status) && (
                     <div className="text-center py-10">
                        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                        <p className="font-bold text-gray-500">Proses untuk permohonan ini sudah selesai.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </AdminLayout>
  );
};

export default VerifikasiPage;

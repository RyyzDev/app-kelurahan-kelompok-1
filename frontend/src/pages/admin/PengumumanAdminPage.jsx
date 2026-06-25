import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Plus, Trash2, Megaphone, Loader2, Calendar } from 'lucide-react';
import pengumumanService from '../../services/pengumumanService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Modal for Add Announcement
const PengumumanModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    tanggal: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        judul: '',
        konten: '',
        tanggal: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      tanggal: new Date(formData.tanggal).toISOString(),
    };
    await onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-[2px]">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden font-sans">
          <form onSubmit={handleSubmit}>
            <div className="p-8 bg-[#F8FAFC] border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Buat Pengumuman Baru</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black">X</button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="text-xs uppercase font-black text-gray-400 tracking-widest block mb-2">Judul Pengumuman</label>
                <input 
                  name="judul" 
                  value={formData.judul} 
                  onChange={handleChange} 
                  placeholder="Contoh: Pemberitahuan Kerja Bakti" 
                  required 
                  className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none rounded-2xl font-bold text-sm transition-all"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase font-black text-gray-400 tracking-widest block mb-2">Tanggal Pengumuman</label>
                <input 
                  type="date" 
                  name="tanggal" 
                  value={formData.tanggal} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none rounded-2xl font-bold text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-black text-gray-400 tracking-widest block mb-2">Isi Pengumuman</label>
                <textarea 
                  name="konten" 
                  value={formData.konten} 
                  onChange={handleChange} 
                  placeholder="Tuliskan detail informasi di sini..." 
                  rows="6" 
                  required
                  className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none rounded-2xl font-bold text-sm transition-all resize-none"
                ></textarea>
              </div>
            </div>
            <div className="p-8 bg-[#F8FAFC] border-t border-gray-100 flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-6 py-3.5 bg-white border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 hover:bg-gray-50 transition-all active:scale-95">Batal</button>
              <button type="submit" className="px-6 py-3.5 bg-[#0047AB] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Simpan & Publikasikan</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PengumumanAdminPage = () => {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPengumuman = async () => {
    setIsLoading(true);
    try {
      const response = await pengumumanService.getAllPengumuman();
      setPengumumanList(response.data || []);
    } catch (err) {
      toast.error("Gagal memuat daftar pengumuman.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchPengumuman(); 
  }, []);

  const handleSave = async (data) => {
    const toastId = toast.loading('Menyimpan pengumuman...');
    try {
      await pengumumanService.createPengumuman(data);
      toast.success('Pengumuman berhasil dipublikasikan!', { id: toastId });
      setIsModalOpen(false);
      fetchPengumuman();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan.', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengumuman ini? Pengumuman tidak akan terlihat lagi oleh warga.')) {
      const toastId = toast.loading('Menghapus...');
      try {
        await pengumumanService.deletePengumuman(id);
        toast.success('Pengumuman berhasil dihapus!', { id: toastId });
        fetchPengumuman();
      } catch (err) {
        toast.error('Gagal menghapus.', { id: toastId });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 font-sans flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Kelola Pengumuman</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Publikasikan pengumuman resmi kelurahan ke beranda warga</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center space-x-2 bg-[#0047AB] text-white px-5 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Pengumuman Baru</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Pengumuman</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Tanggal</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pengumumanList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-20 text-center text-gray-400">
                        <Megaphone size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold text-sm">Belum ada pengumuman yang dibuat.</p>
                      </td>
                    </tr>
                  ) : (
                    pengumumanList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-6 max-w-md">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-[#0047AB] shrink-0">
                              <Megaphone size={18} strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-gray-800 text-sm leading-tight truncate">{item.judul}</h4>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed font-medium">{item.konten}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 whitespace-nowrap text-xs font-bold text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar size={12} />
                            <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 inline-flex items-center justify-center"
                            title="Hapus Pengumuman"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <PengumumanModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
};

export default PengumumanAdminPage;

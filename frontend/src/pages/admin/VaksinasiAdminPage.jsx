import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Plus, Edit, Trash2, Syringe, Loader2 } from 'lucide-react';
import vaksinasiService from '../../services/vaksinasiService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Modal for Add/Edit Schedule
const JadwalModal = ({ isOpen, onClose, onSave, jadwal }) => {
  const [formData, setFormData] = useState({
    nama_vaksin: '',
    deskripsi: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    lokasi: 'Kantor Kelurahan Saint Haven',
    kuota: 100,
  });

  useEffect(() => {
    if (jadwal) {
      setFormData({
        nama_vaksin: jadwal.nama_vaksin,
        deskripsi: jadwal.deskripsi || '',
        tanggal: jadwal.tanggal ? new Date(jadwal.tanggal).toISOString().split('T')[0] : '',
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
        lokasi: jadwal.lokasi,
        kuota: jadwal.kuota,
      });
    } else {
      setFormData({
        nama_vaksin: '', deskripsi: '', tanggal: '', jam_mulai: '08:00', jam_selesai: '15:00',
        lokasi: 'Kantor Kelurahan Saint Haven', kuota: 100,
      });
    }
  }, [jadwal]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      kuota: Number(formData.kuota),
      tanggal: new Date(formData.tanggal).toISOString(),
    };
    await onSave(dataToSave, jadwal?.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl shadow-xl w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="p-8"><h3 className="text-xl font-bold">{jadwal ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3></div>
            <div className="p-8 pt-0 max-h-[70vh] overflow-y-auto space-y-4">
              {/* Form fields */}
              <input name="nama_vaksin" value={formData.nama_vaksin} onChange={handleChange} placeholder="Nama Vaksin (e.g., COVID-19 Booster)" required className="w-full p-3 bg-gray-50 rounded-lg"/>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" name="jam_mulai" value={formData.jam_mulai} onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                <input type="time" name="jam_selesai" value={formData.jam_selesai} onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
              </div>
              <input name="lokasi" value={formData.lokasi} onChange={handleChange} placeholder="Lokasi" required className="w-full p-3 bg-gray-50 rounded-lg"/>
              <input type="number" name="kuota" value={formData.kuota} onChange={handleChange} placeholder="Kuota" required className="w-full p-3 bg-gray-50 rounded-lg"/>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} placeholder="Deskripsi (opsional)" rows="3" className="w-full p-3 bg-gray-50 rounded-lg"></textarea>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-white border rounded-lg font-bold text-sm">Batal</button>
              <button type="submit" className="px-6 py-3 bg-[#0047AB] text-white rounded-lg font-bold text-sm">Simpan</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VaksinasiAdminPage = () => {
  const [jadwalList, setJadwalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const fetchJadwal = async () => {
    setIsLoading(true);
    try {
      const response = await vaksinasiService.getAllJadwalAdmin();
      setJadwalList(response.data);
    } catch (err) {
      toast.error("Gagal memuat jadwal vaksinasi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJadwal(); }, []);

  const handleSave = async (data, id) => {
    const toastId = toast.loading(id ? 'Memperbarui...' : 'Menyimpan...');
    try {
      if (id) {
        await vaksinasiService.updateJadwal(id, data);
      } else {
        await vaksinasiService.createJadwal(data);
      }
      toast.success('Jadwal berhasil disimpan!', { id: toastId });
      setIsModalOpen(false);
      fetchJadwal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan.', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      const toastId = toast.loading('Menghapus...');
      try {
        await vaksinasiService.deleteJadwal(id);
        toast.success('Jadwal dihapus!', { id: toastId });
        fetchJadwal();
      } catch (err) {
        toast.error('Gagal menghapus.', { id: toastId });
      }
    }
  };
  
  const openModal = (jadwal = null) => {
    setSelectedJadwal(jadwal);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">Jadwal Vaksinasi</h1>
          <button onClick={() => openModal()} className="flex items-center space-x-2 bg-[#0047AB] text-white px-5 py-3 rounded-xl font-bold">
            <Plus /><span>Jadwal Baru</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-4">Vaksin</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Kuota</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {jadwalList.map(j => (
                  <tr key={j.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-4 font-bold">{j.nama_vaksin}</td>
                    <td className="p-4">{new Date(j.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</td>
                    <td className="p-4">{j.sisa_kuota} / {j.kuota}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${j.status === 'TERSEDIA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{j.status}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(j)} className="p-2 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(j.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <JadwalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} jadwal={selectedJadwal} />
    </AdminLayout>
  );
};

export default VaksinasiAdminPage;

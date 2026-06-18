import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Loader2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATIC_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Event Form Modal
const EventModal = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState({
    nama_event: '',
    deskripsi: '',
    tanggal: '',
    lokasi: '',
    foto: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        nama_event: event.nama_event,
        deskripsi: event.deskripsi || '',
        tanggal: event.tanggal ? new Date(event.tanggal).toISOString().slice(0, 16) : '',
        lokasi: event.lokasi || '',
        foto: null
      });
      setPreview(event.foto_url ? `${STATIC_URL}${event.foto_url}` : null);
    } else {
      // Reset for new event
      setFormData({ nama_event: '', deskripsi: '', tanggal: '', lokasi: '', foto: null });
      setPreview(null);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'tanggal') {
        data.append(key, new Date(formData[key]).toISOString());
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    });
    
    await onSave(data, event?.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8 border-b">
              <h3 className="text-xl font-black text-gray-800">{event ? 'Edit Event' : 'Tambah Event Baru'}</h3>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Nama Event</label>
                  <input type="text" name="nama_event" value={formData.nama_event} onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-400"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Tanggal & Waktu</label>
                  <input type="datetime-local" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Lokasi</label>
                <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-50 rounded-lg border"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Foto Event</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                    {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <ImageIcon className="text-gray-300" />}
                  </div>
                  <input type="file" name="foto" onChange={handleFileChange} className="text-sm"/>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-white border rounded-lg font-bold text-sm">Batal</button>
              <button type="submit" className="px-6 py-3 bg-[#0047AB] text-white rounded-lg font-bold text-sm">Simpan</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// Main Events Page
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response.data);
    } catch (err) {
      toast.error("Gagal memuat data event.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (data, id) => {
    const toastId = toast.loading(id ? 'Memperbarui event...' : 'Menyimpan event...');
    try {
      if (id) {
        await eventService.updateEvent(id, data);
      } else {
        await eventService.createEvent(data);
      }
      toast.success('Event berhasil disimpan!', { id: toastId });
      setIsModalOpen(false);
      fetchEvents(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan event.', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      const toastId = toast.loading('Menghapus event...');
      try {
        await eventService.deleteEvent(id);
        toast.success('Event berhasil dihapus!', { id: toastId });
        fetchEvents();
      } catch (err) {
        toast.error('Gagal menghapus event.', { id: toastId });
      }
    }
  };

  const openModal = (event = null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">Kelola Event</h1>
          <button onClick={() => openModal()} className="flex items-center space-x-2 bg-[#0047AB] text-white px-5 py-3 rounded-xl font-bold text-sm">
            <Plus size={18} />
            <span>Tambah Event</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        ) : events.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
             <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
             <p className="text-gray-400 font-bold">Belum ada event yang ditambahkan.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border">
            <table className="w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="p-4 text-sm font-bold uppercase text-gray-500">Event</th>
                  <th className="p-4 text-sm font-bold uppercase text-gray-500">Tanggal</th>
                  <th className="p-4 text-sm font-bold uppercase text-gray-500">Status</th>
                  <th className="p-4 text-sm font-bold uppercase text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {event.foto_url && <img src={`${STATIC_URL}${event.foto_url}`} alt={event.nama_event} className="w-full h-full object-cover"/>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{event.nama_event}</p>
                          <p className="text-xs text-gray-500">{event.lokasi || 'Online'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {new Date(event.tanggal).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${event.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(event)} className="p-2 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} event={selectedEvent} />
    </AdminLayout>
  );
};

export default EventsPage;

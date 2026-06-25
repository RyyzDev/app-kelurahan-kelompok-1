import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  getVaksinAntrianList, 
  getVaksinAntrianDetail, 
  updateVaksinAntrianStatus, 
  getEventAntrianList, 
  getEventAntrianDetail 
} from '../../services/adminSuratService';
import toast from 'react-hot-toast';
import { Syringe, Calendar, Users, Check, X, Clock, Loader2, ChevronRight } from 'lucide-react';

const AntrianAdminPage = () => {
  const [activeTab, setActiveTab] = useState('vaksin'); // 'vaksin' atau 'event'
  
  // Lists
  const [vaksinList, setVaksinList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  
  // Selection & Details
  const [selectedId, setSelectedId] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch vaccine or event list
  const loadLists = async () => {
    setIsLoadingLists(true);
    setSelectedId(null);
    setDetailList([]);
    try {
      if (activeTab === 'vaksin') {
        const res = await getVaksinAntrianList();
        setVaksinList(res.data || []);
      } else {
        const res = await getEventAntrianList();
        setEventList(res.data || []);
      }
    } catch (err) {
      toast.error('Gagal memuat daftar antrean.');
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, [activeTab]);

  // Fetch detail list when select an item
  const loadDetails = async (id) => {
    setSelectedId(id);
    setIsLoadingDetails(true);
    try {
      if (activeTab === 'vaksin') {
        const res = await getVaksinAntrianDetail(id);
        setDetailList(res.data || []);
      } else {
        const res = await getEventAntrianDetail(id);
        setDetailList(res.data || []);
      }
    } catch (err) {
      toast.error('Gagal memuat detail pendaftar.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Toggle status for vaccine queue (hadir / tidak_hadir / terdaftar)
  const handleStatusUpdate = async (pendaftaranId, newStatus) => {
    const toastId = toast.loading('Mengubah status...');
    try {
      await updateVaksinAntrianStatus(pendaftaranId, newStatus);
      toast.success('Status kehadiran diperbarui!', { id: toastId });
      // Reload details to match
      if (selectedId) {
        const res = await getVaksinAntrianDetail(selectedId);
        setDetailList(res.data || []);
      }
    } catch (err) {
      toast.error('Gagal memperbarui status.', { id: toastId });
    }
  };

  const getSelectedTitle = () => {
    if (activeTab === 'vaksin') {
      const selected = vaksinList.find(v => v.id === selectedId);
      return selected ? selected.nama_vaksin : '';
    } else {
      const selected = eventList.find(e => e.id === selectedId);
      return selected ? selected.nama_event : '';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 font-sans flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Kelola Antrean</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Pantau antrean warga yang mendaftar program vaksinasi dan event kelurahan</p>
          </div>
          
          {/* Tab buttons */}
          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('vaksin')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 transition-all ${
                activeTab === 'vaksin' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Syringe size={14} />
              <span>Antrean Vaksin</span>
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 transition-all ${
                activeTab === 'event' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Calendar size={14} />
              <span>Antrean Event</span>
            </button>
          </div>
        </div>

        {/* Content Split Panel */}
        <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
          
          {/* LEFT COLUMN: List of schedules/events */}
          <div className="w-1/3 flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-[#F8FAFC]">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider">
                {activeTab === 'vaksin' ? 'Daftar Jadwal Vaksinasi' : 'Daftar Event Kelurahan'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {isLoadingLists ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : activeTab === 'vaksin' ? (
                vaksinList.length === 0 ? (
                  <p className="text-xs font-bold text-gray-400 text-center py-20">Tidak ada jadwal vaksinasi.</p>
                ) : (
                  vaksinList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadDetails(item.id)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        selectedId === item.id 
                          ? 'bg-blue-50 border-blue-200 text-[#0047AB] shadow-md shadow-blue-100/50' 
                          : 'bg-white border-gray-100 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="font-black text-sm text-gray-800 group-hover:text-[#0047AB] transition-colors truncate">{item.nama_vaksin}</h4>
                        <div className="flex items-center space-x-3 text-gray-400 text-[10px] font-bold mt-2">
                          <span className="flex items-center space-x-1"><Clock size={10}/> <span>{item.jam_mulai}</span></span>
                          <span className="flex items-center space-x-1"><Users size={10}/> <span>{item._count?.pendaftar ?? 0} Pendaftar</span></span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0047AB] transition-colors" />
                    </button>
                  ))
                )
              ) : (
                eventList.length === 0 ? (
                  <p className="text-xs font-bold text-gray-400 text-center py-20">Tidak ada event kelurahan.</p>
                ) : (
                  eventList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadDetails(item.id)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        selectedId === item.id 
                          ? 'bg-blue-50 border-blue-200 text-[#0047AB] shadow-md shadow-blue-100/50' 
                          : 'bg-white border-gray-100 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="font-black text-sm text-gray-800 group-hover:text-[#0047AB] transition-colors truncate">{item.nama_event}</h4>
                        <div className="flex items-center space-x-3 text-gray-400 text-[10px] font-bold mt-2">
                          <span className="flex items-center space-x-1"><Calendar size={10}/> <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { dateStyle: 'short' })}</span></span>
                          <span className="flex items-center space-x-1"><Users size={10}/> <span>{item._count?.registrations ?? 0} Warga</span></span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0047AB] transition-colors" />
                    </button>
                  ))
                )
              )}
            </div>
          </div>
          
          {/* RIGHT COLUMN: Queue detailing */}
          <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider truncate max-w-lg">
                {selectedId ? `Detail Antrean: ${getSelectedTitle()}` : 'Detail Antrean Warga'}
              </h3>
              {selectedId && (
                <span className="bg-[#0047AB] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shrink-0">
                  {detailList.length} Terdaftar
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {!selectedId ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                  <Users size={64} className="opacity-30 mb-4" />
                  <p className="font-bold text-sm">Pilih jadwal vaksinasi atau event di kolom kiri untuk melihat daftar antrean.</p>
                </div>
              ) : isLoadingDetails ? (
                <div className="flex justify-center items-center h-full py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
              ) : detailList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                  <Users size={48} className="opacity-20 mb-3" />
                  <p className="font-bold text-sm">Belum ada warga yang terdaftar pada program ini.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {activeTab === 'vaksin' && (
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400">No. Antrean</th>
                      )}
                      <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400">Warga</th>
                      <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400">NIK</th>
                      {activeTab === 'vaksin' ? (
                        <>
                          <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400">Kehadiran</th>
                          <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400 text-center">Aksi Check-in</th>
                        </>
                      ) : (
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-400">Tanggal Daftar</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detailList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        {activeTab === 'vaksin' && (
                          <td className="p-5 font-black text-[#0047AB] text-md tracking-tighter">
                            V-{String(item.nomor_antrian).padStart(3, '0')}
                          </td>
                        )}
                        <td className="p-5">
                          <span className="font-bold text-gray-800 text-sm block leading-snug">{item.user.nama_lengkap}</span>
                        </td>
                        <td className="p-5 font-bold text-xs text-gray-400 tracking-wider">
                          {item.user.nik.substring(0, 8)}********
                        </td>
                        {activeTab === 'vaksin' ? (
                          <>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${
                                item.status === 'hadir' ? 'bg-green-100 text-green-700' :
                                item.status === 'tidak_hadir' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {item.status === 'terdaftar' ? 'Menunggu' : item.status}
                              </span>
                            </td>
                            <td className="p-5 text-center">
                              <div className="inline-flex space-x-2">
                                <button 
                                  onClick={() => handleStatusUpdate(item.id, 'hadir')}
                                  disabled={item.status === 'hadir'}
                                  className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                                    item.status === 'hadir' 
                                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                      : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white shadow-sm'
                                  }`}
                                  title="Tandai Hadir"
                                >
                                  <Check size={14} strokeWidth={3} />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(item.id, 'tidak_hadir')}
                                  disabled={item.status === 'tidak_hadir'}
                                  className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                                    item.status === 'tidak_hadir' 
                                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                      : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm'
                                  }`}
                                  title="Tandai Tidak Hadir"
                                >
                                  <X size={14} strokeWidth={3} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <td className="p-5 font-bold text-xs text-gray-500">
                            {new Date(item.registeredAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AntrianAdminPage;

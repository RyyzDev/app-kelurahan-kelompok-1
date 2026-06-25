import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAllAspirasi } from '../../services/aspirasiService';
import { MessageSquare, Calendar, User, Hash, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AspirasiAdminPage = () => {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAspirasi = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAspirasi();
      setAspirasiList(response.data || []);
    } catch (err) {
      toast.error('Gagal memuat daftar aspirasi warga.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirasi();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8 font-sans flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Aspirasi Warga</h1>
          <p className="text-sm font-bold text-gray-400 mt-1">Daftar masukan, kritik, dan saran yang disampaikan oleh warga kelurahan secara langsung</p>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide pb-10">
            {aspirasiList.length === 0 ? (
              <div className="bg-white rounded-[32px] p-20 text-center text-gray-400 border border-gray-100 shadow-xl shadow-blue-900/5">
                <MessageSquare size={56} className="mx-auto mb-4 opacity-30" />
                <p className="font-bold text-sm">Belum ada aspirasi warga yang masuk.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aspirasiList.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Top Row with Warga details */}
                      <div className="flex items-start justify-between pb-4 border-b border-gray-50 mb-4">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <User size={18} strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-gray-800 truncate leading-snug">{item.user.nama_lengkap}</h4>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                              <Hash size={8} /> {item.user.nik.substring(0, 8)}********
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 flex items-center gap-1 shrink-0 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                          <Calendar size={9} />
                          {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                        </span>
                      </div>

                      {/* Content Message */}
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-50 mb-4">
                        <p className="text-gray-700 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                          {item.pesan}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Status Info */}
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#0047AB] bg-blue-50/50 self-start px-3 py-1.5 rounded-lg border border-blue-100/30">
                      <MessageSquare size={10} />
                      <span>Masukan Warga</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AspirasiAdminPage;

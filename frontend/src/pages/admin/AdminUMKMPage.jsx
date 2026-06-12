import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getPendingProduk, verifyProduk } from '../../services/umkmService';
import { CheckCircle2, XCircle, Eye, ShoppingBag, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUMKMPage = () => {
  const [pendingProducts, setPendingProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const response = await getPendingProduk();
      setPendingProduk(response.data);
    } catch (err) {
      toast.error('Gagal memuat produk pending');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id, status) => {
    const action = status === 'disetujui' ? 'menyetujui' : 'menolak';
    const toastId = toast.loading(`Sedang ${action} produk...`);
    try {
      await verifyProduk(id, { status });
      toast.success(`Produk berhasil ${status}`, { id: toastId });
      fetchPending();
    } catch (err) {
      toast.error(`Gagal ${action} produk`, { id: toastId });
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-10 max-w-7xl w-full space-y-10 overflow-y-auto">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">UMKM Management</h2>
          <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Verifikasi Katalog Produk Warga</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <Loader2 className="animate-spin text-[#0047AB]" size={40} />
             <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Memuat Katalog...</p>
          </div>
        ) : pendingProducts.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100 shadow-sm">
             <ShoppingBag className="mx-auto text-gray-100 mb-6" size={80} />
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Semua produk sudah terverifikasi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5 group hover:shadow-2xl transition-all duration-500 flex flex-col">
                 <div className="h-56 relative overflow-hidden">
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                         <ShoppingBag size={64} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                       <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center">
                          <Clock size={10} className="mr-1.5" strokeWidth={3} />
                          Pending Review
                       </span>
                    </div>
                 </div>

                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg italic">@{p.toko.user.nama_lengkap}</p>
                       <p className="text-xl font-black text-gray-900">Rp {Number(p.harga).toLocaleString('id-ID')}</p>
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight">{p.nama_produk}</h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-8 leading-relaxed italic">"{p.deskripsi || 'Tidak ada deskripsi.'}"</p>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => handleVerify(p.id, 'disetujui')}
                         className="py-4 bg-[#34A853] text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center space-x-2"
                       >
                          <CheckCircle2 size={14} strokeWidth={3} />
                          <span>Approve</span>
                       </button>
                       <button 
                         onClick={() => handleVerify(p.id, 'ditolak')}
                         className="py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center space-x-2"
                       >
                          <XCircle size={14} strokeWidth={3} />
                          <span>Reject</span>
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminUMKMPage;

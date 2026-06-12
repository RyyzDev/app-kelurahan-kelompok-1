import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  Plus, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Tag
} from 'lucide-react';
import { getMyToko, registerToko, addProduk, updateProduk } from '../../services/umkmService';
import toast from 'react-hot-toast';

const MyTokoPage = () => {
  const navigate = useNavigate();
  const [toko, setToko] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Form State
  const [regData, setRegData] = useState({
    nama_toko: '',
    deskripsi: '',
    alamat_toko: '',
    phone_toko: ''
  });

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [productData, setProductData] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    kategori: '',
    stok: 0
  });

  const fetchToko = async () => {
    setIsLoading(true);
    try {
      const response = await getMyToko();
      setToko(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setToko(null);
      } else {
        toast.error('Gagal memuat data toko');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToko();
  }, []);

  const handleRegisterToko = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await registerToko(regData);
      toast.success('Toko berhasil didaftarkan!');
      fetchToko();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi toko gagal');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Menyimpan produk...');
    
    // Siapkan data untuk FormData
    const submissionData = {
      ...productData,
      foto: productFile // Field file untuk Multer
    };

    try {
      if (currentProduct) {
        await updateProduk(currentProduct.id, submissionData);
        toast.success('Produk diperbarui & menunggu verifikasi', { id: toastId });
      } else {
        await addProduk(submissionData);
        toast.success('Produk ditambahkan & menunggu verifikasi', { id: toastId });
      }
      setIsProductModalOpen(false);
      setCurrentProduct(null);
      setProductFile(null);
      setPreviewUrl('');
      fetchToko();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk', { id: toastId });
    }
  };

  const handleDeleteProduk = async (productId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    const toastId = toast.loading('Menghapus produk...');
    try {
      await deleteProduk(productId);
      toast.success('Produk berhasil dihapus', { id: toastId });
      fetchToko();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk', { id: toastId });
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setProductData({
      nama_produk: product.nama_produk,
      deskripsi: product.deskripsi || '',
      harga: Number(product.harga),
      kategori: product.kategori || '',
      stok: product.stok
    });
    setPreviewUrl(product.foto_url || '');
    setProductFile(null);
    setIsProductModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    setProductData({
      nama_produk: '',
      deskripsi: '',
      harga: '',
      kategori: '',
      stok: 0
    });
    setPreviewUrl('');
    setProductFile(null);
    setIsProductModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
         <Loader2 className="animate-spin text-[#0047AB]" size={40} />
         <p className="mt-4 text-gray-400 font-bold tracking-widest uppercase text-[10px]">Memuat Toko Anda...</p>
      </div>
    );
  }

  if (!toko) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
        <header className="bg-white border-b border-gray-100 px-6 py-5 flex items-center sticky top-0 z-10">
          <button onClick={() => navigate('/warga/umkm')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-800">Daftar Toko UMKM</h1>
        </header>

        <main className="p-6 max-w-xl mx-auto">
           <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 p-10 border border-gray-100 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-[#0047AB]">
                 <Store size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Buka Toko UMKM Anda</h2>
              <p className="text-gray-500 font-medium text-sm mb-10 leading-relaxed">Mulai kembangkan usaha Anda dan jangkau lebih banyak tetangga di kelurahan kita.</p>

              <form onSubmit={handleRegisterToko} className="space-y-5 text-left">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Nama Toko</label>
                    <input 
                      required
                      value={regData.nama_toko}
                      onChange={(e) => setRegData({...regData, nama_toko: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700"
                      placeholder="Contoh: Warung Berkah"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Deskripsi Usaha</label>
                    <textarea 
                      rows={3}
                      value={regData.deskripsi}
                      onChange={(e) => setRegData({...regData, deskripsi: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700"
                      placeholder="Jelaskan apa yang Anda jual..."
                    />
                 </div>
                 <button 
                   type="submit"
                   disabled={isRegistering}
                   className="w-full py-5 bg-[#0047AB] text-white font-black rounded-[24px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isRegistering ? 'Memproses...' : 'Daftar Sekarang'}
                 </button>
              </form>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate('/warga/umkm')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-400">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">{toko.nama_toko}</h1>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1.5 flex items-center">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
               Toko Aktif
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="bg-[#0047AB] text-white p-3 rounded-2xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-90 transition-all">
           <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-10">
         {/* Shop Stats/Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-5">
               <div className="w-14 h-14 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center">
                  <Package size={28} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Produk</p>
                  <p className="text-2xl font-black text-gray-900">{toko.produk.length}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-5 col-span-2">
               <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={28} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pesan Penting</p>
                  <p className="text-xs font-bold text-gray-600 leading-tight">Pastikan produk Anda memiliki foto yang jelas agar lebih cepat disetujui Admin.</p>
               </div>
            </div>
         </div>

         {/* Product List */}
         <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Katalog Produk Saya</h2>
            
            {toko.produk.length === 0 ? (
               <div className="py-20 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100">
                  <Package className="mx-auto text-gray-200 mb-4" size={64} />
                  <p className="text-gray-400 font-bold italic">Belum ada produk. Tambahkan sekarang!</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {toko.produk.map((p) => (
                     <div key={p.id} className="bg-white rounded-[32px] border border-gray-100 p-5 flex items-center space-x-5 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-50">
                           {p.foto_url ? (
                              <img src={p.foto_url} alt={p.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-200">
                                 <ImageIcon size={32} />
                              </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-1">
                              {p.status === 'pending' && <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center"><Clock size={10} className="mr-1" /> Pending</span>}
                              {p.status === 'disetujui' && <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center"><CheckCircle2 size={10} className="mr-1" /> Tampil</span>}
                              {p.status === 'ditolak' && <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center"><XCircle size={10} className="mr-1" /> Ditolak</span>}
                           </div>
                           <h3 className="font-black text-gray-800 truncate mb-0.5">{p.nama_produk}</h3>
                           <p className="text-sm font-black text-[#0047AB]">Rp {Number(p.harga).toLocaleString('id-ID')}</p>
                           
                           <div className="flex items-center space-x-2 mt-3">
                              <button onClick={() => openEditModal(p)} className="p-2 bg-gray-50 text-gray-400 hover:text-[#0047AB] hover:bg-blue-50 rounded-xl transition-all">
                                 <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduk(p.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900">{currentProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                  <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><XCircle /></button>
               </div>
               <form onSubmit={handleProductSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center"><Tag size={12} className="mr-1"/> Nama Produk</label>
                        <input required value={productData.nama_produk} onChange={(e) => setProductData({...productData, nama_produk: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="Kripik Pisang Manis" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center"><DollarSign size={12} className="mr-1"/> Harga (Rp)</label>
                           <input required type="number" value={productData.harga} onChange={(e) => setProductData({...productData, harga: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="15000" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center"><Package size={12} className="mr-1"/> Stok</label>
                           <input required type="number" value={productData.stok} onChange={(e) => setProductData({...productData, stok: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="50" />
                        </div>
                     </div>
                     
                     {/* Real File Upload */}
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center"><ImageIcon size={12} className="mr-1"/> Foto Produk</label>
                        <div className="flex items-center space-x-4">
                           <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                              {previewUrl ? (
                                 <img src={previewUrl} className="w-full h-full object-cover" />
                              ) : (
                                 <ImageIcon size={32} className="text-gray-200" />
                              )}
                           </div>
                           <label className="flex-1">
                              <div className="px-6 py-4 bg-blue-50 text-[#0047AB] rounded-2xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer hover:bg-blue-100 transition-all">
                                 Pilih Gambar
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                           </label>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold mt-2 ml-2">* Maksimal 5MB (JPG, PNG, WebP)</p>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Deskripsi Produk</label>
                        <textarea rows={3} value={productData.deskripsi} onChange={(e) => setProductData({...productData, deskripsi: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="Ceritakan keunggulan produk Anda..." />
                     </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#0047AB] text-white font-black rounded-3xl uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#003580] transition-all">
                     Simpan Produk
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default MyTokoPage;

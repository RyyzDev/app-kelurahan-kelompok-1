import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, Plus, Package, Edit, Trash2, Loader2, ImageIcon,
  DollarSign, Tag, ShoppingCart, BarChart2, XCircle, Clock, CheckCircle2
} from 'lucide-react';
import { getMyToko, getMyTokoDashboard, addProduk, updateProduk, deleteProduk } from '../../services/umkmService';
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, onSubmit, currentProduct, productData, setProductData, handleFileChange, previewUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900">{currentProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><XCircle /></button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
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
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Kategori</label>
                <input value={productData.kategori} onChange={(e) => setProductData({...productData, kategori: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="Contoh: Makanan Ringan" />
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center"><ImageIcon size={12} className="mr-1"/> Foto Produk</label>
                <div className="flex items-center space-x-4">
                   <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {previewUrl ? (<img src={previewUrl} className="w-full h-full object-cover" />) : (<ImageIcon size={32} className="text-gray-200" />)}
                   </div>
                   <label className="flex-1">
                      <div className="px-6 py-4 bg-blue-50 text-[#0047AB] rounded-2xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer hover:bg-blue-100 transition-all">Pilih Gambar</div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                   </label>
                </div>
                <p className="text-[9px] text-gray-400 font-bold mt-2 ml-2">* Maksimal 5MB (JPG, PNG, WebP)</p>
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Deskripsi Produk</label>
                <textarea rows={3} value={productData.deskripsi} onChange={(e) => setProductData({...productData, deskripsi: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 outline-none transition-all font-bold text-gray-700" placeholder="Ceritakan keunggulan produk Anda..." />
             </div>
          </div>
          <button type="submit" className="w-full py-5 bg-[#0047AB] text-white font-black rounded-3xl uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#003580] transition-all">Simpan Produk</button>
        </form>
      </div>
    </div>
  );
};


const MyTokoPage = () => {
  const navigate = useNavigate();
  const [toko, setToko] = useState(null);
  const [dashboard, setDashboard] = useState({ totalRevenue: 0, totalOrders: 0, orders: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({ nama_toko: '', deskripsi: '' });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [productData, setProductData] = useState({
    nama_produk: '', deskripsi: '', harga: '', kategori: '', stok: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const tokoResponse = await getMyToko();
      setToko(tokoResponse.data);
      // Only fetch dashboard if toko exists
      if (tokoResponse.data) {
        const dashboardResponse = await getMyTokoDashboard();
        setDashboard(dashboardResponse.data);
      }
    } catch (err) {
      if (err.response?.status === 404) setToko(null);
      else toast.error('Gagal memuat data toko Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRegisterToko = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await registerToko(regData);
      toast.success('Toko berhasil didaftarkan!');
      fetchData();
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
    const formData = new FormData();
    formData.append('nama_produk', productData.nama_produk);
    formData.append('deskripsi', productData.deskripsi);
    formData.append('harga', productData.harga);
    formData.append('kategori', productData.kategori);
    formData.append('stok', productData.stok);
    if (productFile) formData.append('foto', productFile);

    try {
      if (currentProduct) {
        await updateProduk(currentProduct.id, formData);
        toast.success('Produk diperbarui & menunggu verifikasi', { id: toastId });
      } else {
        await addProduk(formData);
        toast.success('Produk ditambahkan & menunggu verifikasi', { id: toastId });
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk', { id: toastId });
    }
  };
  
  const handleDeleteProduk = async (productId) => { /* ... */ };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setProductData({
      nama_produk: product.nama_produk,
      deskripsi: product.deskripsi || '',
      harga: Number(product.harga),
      kategori: product.kategori || '',
      stok: product.stok
    });
    setPreviewUrl(product.foto_url ? `${(import.meta.env.VITE_API_URL || '').replace('/api', '')}${product.foto_url}` : '');
    setProductFile(null);
    setIsProductModalOpen(true);
  };
  
  const openAddModal = () => {
    setCurrentProduct(null);
    setProductData({ nama_produk: '', deskripsi: '', harga: '', kategori: '', stok: 0 });
    setPreviewUrl('');
    setProductFile(null);
    setIsProductModalOpen(true);
  };


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!toko) {
     return (
      <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
        <header className="bg-white border-b border-gray-100 px-6 py-5 flex items-center sticky top-0 z-10">
          <button onClick={() => navigate('/warga/umkm')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500"><ArrowLeft size={24} strokeWidth={2.5} /></button>
          <h1 className="text-xl font-extrabold text-gray-800">Daftar Toko UMKM</h1>
        </header>
        <main className="p-6 max-w-xl mx-auto">
           <div className="bg-white rounded-[40px] shadow-2xl p-10 border text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-[#0047AB]"><Store size={48} strokeWidth={2.5} /></div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Buka Toko UMKM Anda</h2>
              <p className="text-gray-500 font-medium text-sm mb-10">Mulai kembangkan usaha Anda dan jangkau lebih banyak tetangga.</p>
              <form onSubmit={handleRegisterToko} className="space-y-5 text-left">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Nama Toko</label>
                    <input required value={regData.nama_toko} onChange={(e) => setRegData({...regData, nama_toko: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold" placeholder="Contoh: Warung Berkah" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Deskripsi Usaha</label>
                    <textarea rows={3} value={regData.deskripsi} onChange={(e) => setRegData({...regData, deskripsi: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold" placeholder="Jelaskan apa yang Anda jual..." />
                 </div>
                 <button type="submit" disabled={isRegistering} className="w-full py-5 bg-[#0047AB] text-white font-black rounded-2xl uppercase tracking-widest disabled:opacity-50">{isRegistering ? 'Memproses...' : 'Daftar Sekarang'}</button>
              </form>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <header className="bg-white border-b px-6 py-5 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => navigate('/warga/umkm')} className="mr-4 p-2 rounded-full"><ArrowLeft /></button>
          <h1 className="text-xl font-black">{toko.nama_toko}</h1>
        </div>
        <button onClick={openAddModal} className="bg-[#0047AB] text-white p-3 rounded-2xl"><Plus /></button>
      </header>
      <main className="p-6 max-w-5xl mx-auto space-y-10">
        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4">Ringkasan Toko</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4"><div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign /></div><div><p className="text-xs font-bold text-gray-500">Total Pendapatan</p><p className="text-2xl font-black">Rp {Number(dashboard.totalRevenue).toLocaleString('id-ID')}</p></div></div>
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><ShoppingCart /></div><div><p className="text-xs font-bold text-gray-500">Pesanan Berhasil</p><p className="text-2xl font-black">{dashboard.orders.filter(o => o.status_pembayaran === 'berhasil').length}</p></div></div>
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4"><div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Package /></div><div><p className="text-xs font-bold text-gray-500">Jumlah Produk</p><p className="text-2xl font-black">{toko.produk.length}</p></div></div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4">Riwayat Pesanan Masuk</h2>
          <div className="bg-white rounded-2xl border">{dashboard.orders.length === 0 ? <p className="p-10 text-center text-gray-500">Belum ada pesanan.</p> : <table className="w-full text-left"><thead><tr className="border-b"><th className="p-4 text-sm">Order ID</th><th className="p-4 text-sm">Tanggal</th><th className="p-4 text-sm">Total</th><th className="p-4 text-sm">Status</th></tr></thead><tbody>{dashboard.orders.map(order => (<tr key={order.id} className="border-b last:border-b-0"><td className="p-4 font-mono text-xs">{order.id.substring(0, 8)}</td><td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td><td className="p-4 text-sm font-bold">Rp {Number(order.total_harga).toLocaleString('id-ID')}</td><td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${order.status_pembayaran === 'berhasil' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status_pembayaran}</span></td></tr>))}</tbody></table>}</div>
        </section>
        <section>
           <h2 className="text-xl font-black text-gray-800 mb-4">Katalog Produk Saya</h2>
           {toko.produk.length === 0 ? <div className="py-20 text-center bg-white rounded-[48px] border-2 border-dashed"><Package className="mx-auto text-gray-200 mb-4" size={64} /><p className="text-gray-400 font-bold italic">Belum ada produk.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{toko.produk.map((p) => (<div key={p.id} className="bg-white rounded-[32px] border p-5 flex items-center space-x-5"><div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border">{p.foto_url ? <img src={`${(import.meta.env.VITE_API_URL || '').replace('/api', '')}${p.foto_url}`} alt={p.nama_produk} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={32} /></div>}</div><div className="flex-1 min-w-0"><div className="flex items-center justify-between mb-1">{p.status === 'pending' && <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border flex items-center"><Clock size={10} className="mr-1" /> Pending</span>}{p.status === 'disetujui' && <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full border flex items-center"><CheckCircle2 size={10} className="mr-1" /> Tampil</span>}{p.status === 'ditolak' && <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full border flex items-center"><XCircle size={10} className="mr-1" /> Ditolak</span>}</div><h3 className="font-black text-gray-800 truncate mb-0.5 mt-1">{p.nama_produk}</h3><p className="text-sm font-black text-[#0047AB]">Rp {Number(p.harga).toLocaleString('id-ID')}</p><div className="flex items-center space-x-2 mt-3"><button onClick={() => openEditModal(p)} className="p-2 bg-gray-50 rounded-xl"><Edit size={16} /></button><button onClick={() => handleDeleteProduk(p.id)} className="p-2 bg-gray-50 rounded-xl"><Trash2 size={16} /></button></div></div></div>))}</div>}
        </section>
      </main>
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSubmit={handleProductSubmit} currentProduct={currentProduct} productData={productData} setProductData={setProductData} handleFileChange={handleFileChange} previewUrl={previewUrl} />
    </div>
  );
};

export default MyTokoPage;

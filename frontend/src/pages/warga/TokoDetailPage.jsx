import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  CheckCircle2, 
  Loader2,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicTokoById } from '../../services/umkmService';
import ProductDetailDrawer from '../../components/umkm/ProductDetailDrawer';
import CartSidebar from '../../components/umkm/CartSidebar';
import paymentService from '../../services/paymentService';
import toast from 'react-hot-toast';

const TokoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toko, setToko] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchTokoDetails = async () => {
      try {
        const response = await getPublicTokoById(id);
        setToko(response.data);
      } catch (err) {
        toast.error('Gagal memuat detail toko');
        navigate('/warga/umkm');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokoDetails();
  }, [id, navigate]);

  const isProductInCart = (productId) => cart.some(item => item.id === productId);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (isProductInCart(product.id)) {
      setIsCartOpen(true);
      return;
    }
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    toast.success(`${product.nama_produk} ditambah ke keranjang`, {
      icon: '🛒',
      style: { borderRadius: '20px', fontWeight: 'bold' }
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.error('Produk dihapus dari keranjang', { style: { borderRadius: '20px', fontWeight: 'bold' } });
  };

  const handleCheckout = async () => {
    const toastId = toast.loading('Menyiapkan pembayaran...');
    try {
      const checkoutItems = cart.map(item => ({
        id: item.id,
        nama_produk: item.nama_produk,
        harga: Number(item.harga),
        kuantitas: item.quantity
      }));
      const response = await paymentService.checkout(checkoutItems);
      const { snap_token } = response.data;

      window.snap.pay(snap_token, {
        onSuccess: (result) => {
          toast.success('Pembayaran Berhasil!', { id: toastId });
          setCart([]);
          setIsCartOpen(false);
        },
        onPending: (result) => toast('Pembayaran Menunggu...', { id: toastId, icon: '⏳' }),
        onError: (result) => toast.error('Pembayaran Gagal!', { id: toastId }),
        onClose: () => toast.dismiss(toastId)
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses checkout', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#0047AB] mb-4" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Memuat Profil Toko...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans relative">
      <header className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Profil Toko</h1>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-[#F8FAFC] text-gray-800 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
        >
          <ShoppingBag size={22} strokeWidth={2.5} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Seller Profile Card */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0047AB] to-blue-400"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center shrink-0 border-4 border-white shadow-inner">
              <User size={64} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{toko.user.nama_lengkap}</h2>
                  <span className="bg-green-50 text-[#34A853] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-100 flex items-center">
                    <CheckCircle2 size={10} className="mr-1" strokeWidth={3} /> Terverifikasi
                  </span>
                </div>
                <p className="text-[#0047AB] font-extrabold text-lg flex items-center justify-center md:justify-start">
                  <Store size={20} className="mr-2" strokeWidth={2.5} /> {toko.nama_toko}
                </p>
              </div>

              <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                {toko.deskripsi || 'Selamat datang di toko kami! Kami menyediakan produk UMKM berkualitas tinggi hasil buatan tangan warga Kelurahan Saint Haven.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin size={18} className="text-blue-400" />
                  <span className="text-sm font-bold">{toko.alamat_toko || 'Saint Haven, RT 04/RW 02'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone size={18} className="text-blue-400" />
                  <span className="text-sm font-bold">{toko.phone_toko || toko.user.phone || '0812-xxxx-xxxx'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Katalog Produk</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border border-gray-200">
              {toko.produk.length} Produk Tersedia
            </span>
          </div>

          {toko.produk.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-gray-100">
              <ShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-bold italic">Penjual ini belum memiliki produk aktif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {toko.produk.map((item) => {
                const inCart = isProductInCart(item.id);
                return (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ y: -8 }}
                    onClick={() => { setSelectedProduct({ ...item, toko }); setIsDrawerOpen(true); }}
                    className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col cursor-pointer"
                  >
                    <div className="h-52 overflow-hidden relative">
                      {item.foto_url ? (
                        <img src={item.foto_url} alt={item.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                          {item.kategori || 'Produk'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-gray-800 text-lg mb-2 group-hover:text-[#0047AB] transition-colors">{item.nama_produk}</h3>
                      <p className="text-xl font-black text-[#0047AB] mb-4">Rp {Number(item.harga).toLocaleString('id-ID')}</p>
                      
                      <button 
                        onClick={(e) => handleAddToCart(item, e)}
                        className={`mt-auto w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95
                          ${inCart ? 'bg-[#34A853] text-white' : 'bg-gray-50 text-[#0047AB] border border-blue-50 hover:bg-[#0047AB] hover:text-white'}
                        `}
                      >
                        {inCart ? <><CheckCircle2 size={16} strokeWidth={3} /><span>Di Keranjang</span></> : <><Plus size={16} strokeWidth={3} /><span>Keranjang</span></>}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ProductDetailDrawer 
        product={selectedProduct} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onAddToCart={handleAddToCart}
        isInCart={selectedProduct ? isProductInCart(selectedProduct.id) : false}
        onSellerClick={() => setIsDrawerOpen(false)}
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default TokoDetailPage;

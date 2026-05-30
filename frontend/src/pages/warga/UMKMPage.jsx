import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Store, 
  ShoppingCart, 
  Plus, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetailDrawer from '../../components/umkm/ProductDetailDrawer';
import CartSidebar from '../../components/umkm/CartSidebar';
import toast from 'react-hot-toast';

const mockUMKM = [
  {
    id: 1,
    name: 'Kripik Tempe Mak Mur',
    category: 'Camilan',
    price: 'Rp 15.000',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80',
    owner: 'Ibu Murni',
    description: 'Kripik tempe renyah dengan bumbu rempah rahasia warisan keluarga.',
    ingredients: 'Tempe Kedelai, Rempah, Garam'
  },
  {
    id: 2,
    name: 'Batik Tulis Sejahtera',
    category: 'Fashion',
    price: 'Rp 250.000',
    image: 'https://images.unsplash.com/photo-1582733734033-66f81a1796be?auto=format&fit=crop&w=400&q=80',
    owner: 'Bpk. Ahmad',
    description: 'Batik tulis asli buatan tangan perajin kelurahan.',
    ingredients: 'Katun Primisima, Pewarna Alami'
  },
  {
    id: 3,
    name: 'Sambal Uleg Juara',
    category: 'Bumbu Dapur',
    price: 'Rp 25.000',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80',
    owner: 'Ibu Siti',
    description: 'Sambal terasi uleg segar dengan cita rasa pedas nampol.',
    ingredients: 'Cabai Rawit, Terasi, Bawang'
  },
  {
    id: 4,
    name: 'Anyaman Bambu Kreatif',
    category: 'Kerajinan',
    price: 'Rp 45.000',
    image: 'https://images.unsplash.com/photo-1611486212330-972142704ece?auto=format&fit=crop&w=400&q=80',
    owner: 'Bpk. Jaka',
    description: 'Wadah anyaman bambu serbaguna yang kuat dan estetik.',
    ingredients: 'Bambu Apus Pilihan'
  }
];

const UMKMPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isProductInCart = (productId) => cart.some(item => item.id === productId);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (isProductInCart(product.id)) {
      setIsCartOpen(true);
      return;
    }
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    toast.success(`${product.name} ditambah ke keranjang`, {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans relative overflow-x-hidden">
      <header className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate('/warga')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex items-center space-x-2">
             <Store className="text-[#0047AB]" size={24} strokeWidth={2.5} />
             <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">UMKM Corner</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
           <button className="p-3 text-[#0047AB] hover:bg-blue-50 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] flex items-center space-x-2">
              <TrendingUp size={18} strokeWidth={3} />
              <span className="hidden md:inline">Toko Saya</span>
           </button>
           <button 
             onClick={() => setIsCartOpen(true)}
             className="relative p-3 bg-[#F8FAFC] text-gray-800 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
           >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                   {cart.length}
                </span>
              )}
           </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
        <div className="bg-gradient-to-br from-blue-700 to-[#0047AB] rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="mb-8 md:mb-0 md:mr-10 text-center md:text-left z-10">
            <h2 className="text-4xl font-black mb-3 tracking-tight leading-tight">Bangga Buatan <br/>Tetangga Kita</h2>
            <p className="text-blue-50 max-w-lg text-lg font-medium opacity-90 leading-relaxed">Katalog produk premium UMKM Kelurahan.</p>
          </div>
          <div className="bg-white/20 p-8 rounded-[40px] backdrop-blur-md shadow-inner border border-white/30 transform rotate-3 z-10">
            <ShoppingBag size={80} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockUMKM.map((item) => {
            const inCart = isProductInCart(item.id);
            return (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -8 }}
                onClick={() => { setSelectedProduct(item); setIsDrawerOpen(true); }}
                className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  <div className="absolute top-4 left-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white bg-black/40 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-white/20">{item.category}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-gray-800 text-lg leading-tight mb-2 group-hover:text-[#0047AB] transition-colors">{item.name}</h3>
                  <p className="text-xl font-black text-[#0047AB] mb-4">{item.price}</p>
                  
                  <button 
                    onClick={(e) => handleAddToCart(item, e)}
                    className={`mt-auto w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95 group/btn
                      ${inCart 
                        ? 'bg-[#34A853] text-white' 
                        : 'bg-gray-50 text-[#0047AB] border border-blue-50 hover:bg-[#0047AB] hover:text-white'}
                    `}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 size={16} strokeWidth={3} />
                        <span>Di Keranjang</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
                        <span>Keranjang</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-32 right-6 z-40"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-[#34A853] text-white px-8 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center space-x-4 shadow-[0_20px_50px_-12px_rgba(52,168,83,0.5)] animate-[pulse_2s_infinite] hover:scale-105 active:scale-95 transition-all"
            >
               <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 mb-1">Checkout</span>
                  <span className="text-lg">{cart.length} Item</span>
               </div>
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight size={20} strokeWidth={3} />
               </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailDrawer 
        product={selectedProduct} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onAddToCart={(p) => handleAddToCart(p)}
        isInCart={selectedProduct ? isProductInCart(selectedProduct.id) : false}
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default UMKMPage;

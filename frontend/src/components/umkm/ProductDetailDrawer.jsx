import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Info, ShieldCheck, Star, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

const ProductDetailDrawer = ({ product, isOpen, onClose, onAddToCart, isInCart, onSellerClick }) => {
  if (!product) return null;

  const storeName = product.toko?.nama_toko || 'Toko Lokal';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-[40px] shadow-2xl z-[90] flex flex-col overflow-hidden font-sans"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center py-4 shrink-0">
              <div className="w-14 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
               {/* Product Image Header */}
               <div className="relative h-72 w-full px-6">
                  {product.foto_url ? (
                    <img 
                      src={product.foto_url} 
                      alt={product.nama_produk} 
                      className="w-full h-full object-cover rounded-[32px] shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200">
                       <ShoppingBag size={80} />
                    </div>
                  )}
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-10 p-3 bg-white/80 backdrop-blur-md text-gray-800 rounded-2xl shadow-xl hover:bg-white transition-all"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
               </div>

               <div className="p-8 space-y-8">
                  {/* Title & Price */}
                  <div>
                    <button 
                      onClick={() => onSellerClick(product.toko.id)}
                      className="mb-3 flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <ShoppingBag size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{storeName}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="flex justify-between items-start mb-2">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight max-w-[70%]">{product.nama_produk}</h2>
                       <p className="text-2xl font-black text-[#0047AB]">Rp {Number(product.harga).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#34A853] bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                         {product.kategori || 'Produk UMKM'}
                       </span>
                       <div className="flex items-center text-orange-400">
                          <Star size={14} fill="currentColor" />
                          <span className="ml-1 text-xs font-black">4.9 (Terpopuler)</span>
                       </div>
                    </div>
                  </div>

                  {/* Narrative/Description */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center">
                        <Info size={16} className="mr-2" /> Narasi Produk
                     </h3>
                     <p className="text-gray-600 font-medium leading-relaxed">
                        {product.deskripsi || 'Dibuat dengan bahan-bahan pilihan berkualitas tinggi yang diambil langsung dari pengrajin lokal di kelurahan kita. Tanpa bahan pengawet dan diproses secara higienis untuk menjaga mutu terbaik.'}
                     </p>
                     <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stok Tersedia</p>
                           <p className="text-xs font-bold text-gray-700">{product.stok} Unit</p>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Masa Simpan</p>
                           <p className="text-xs font-bold text-gray-700">3-6 Bulan</p>
                        </div>
                     </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center space-x-4">
                     <div className="bg-white p-3 rounded-2xl text-[#0047AB] shadow-sm">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-[#0047AB] uppercase tracking-tight leading-tight">Terjamin Kelurahan</p>
                        <p className="text-[10px] text-blue-600 font-medium opacity-80">Produk ini telah melalui kurasi standar mutu UMKM Kelurahan.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sticky Footer CTA */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center space-x-4">
               <button 
                 onClick={() => {
                   if (!isInCart) onAddToCart(product);
                   onClose();
                 }}
                 className={`flex-1 py-5 rounded-3xl uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all font-black shadow-xl
                   ${isInCart 
                     ? 'bg-[#34A853] text-white shadow-green-100' 
                     : 'bg-[#0047AB] text-white shadow-blue-200 active:scale-95'}
                 `}
               >
                 {isInCart ? (
                   <>
                     <CheckCircle2 size={20} strokeWidth={3} />
                     <span>Sudah Di Keranjang</span>
                   </>
                 ) : (
                   <>
                     <ShoppingCart size={20} strokeWidth={3} />
                     <span>Tambah Ke Keranjang</span>
                   </>
                 )}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailDrawer;

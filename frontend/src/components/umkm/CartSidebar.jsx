import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const totalPrice = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
               <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-[#0047AB]">
                     <ShoppingBag size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">Keranjang Saya</h2>
               </div>
               <button onClick={onClose} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-all">
                  <X size={20} strokeWidth={3} />
               </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
               {cartItems.length > 0 ? (
                 cartItems.map((item) => (
                   <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-3xl border border-gray-100 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-extrabold text-gray-800 text-sm truncate">{item.name}</h4>
                         <p className="text-[#0047AB] font-black text-sm mt-0.5">{item.price}</p>
                         
                         <div className="flex items-center space-x-3 mt-3">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 py-1">
                               <button 
                                 onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                 className="p-1 text-gray-400 hover:text-[#0047AB] transition-colors"
                               >
                                  <Minus size={14} strokeWidth={3} />
                               </button>
                               <span className="w-8 text-center text-xs font-black text-gray-700">{item.quantity}</span>
                               <button 
                                 onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                 className="p-1 text-gray-400 hover:text-[#0047AB] transition-colors"
                               >
                                  <Plus size={14} strokeWidth={3} />
                               </button>
                            </div>
                         </div>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                         <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag size={64} className="mb-4" strokeWidth={1} />
                    <p className="font-bold">Keranjang Anda kosong</p>
                 </div>
               )}
            </div>

            {/* Footer / Summary */}
            <div className="p-8 border-t border-gray-100 bg-[#F8FAFC]/50 shrink-0">
               <div className="flex justify-between items-center mb-6 px-2">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total Pembayaran</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">{formatPrice(totalPrice)}</p>
               </div>

               <button 
                 disabled={cartItems.length === 0}
                 className="w-full py-5 bg-[#0047AB] text-white font-black rounded-3xl uppercase tracking-[0.2em] shadow-xl shadow-blue-200 flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
               >
                  <CreditCard size={20} strokeWidth={3} />
                  <span>Bayar Sekarang</span>
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

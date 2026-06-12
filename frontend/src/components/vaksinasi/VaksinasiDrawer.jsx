import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Syringe, History, ArrowRight } from 'lucide-react';

const VaksinasiDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Daftar Vaksinasi',
      description: 'Ajukan Pendaftaran Vaksinasi.',
      icon: Syringe,
      color: 'bg-red-50',
      iconColor: 'text-[#EF4444]',
      path: '/warga/vaksinasi/daftar'
    },
    {
      title: 'Riwayat Vaksinasi Saya',
      description: 'riwayat vaksinasi saya sebelumnya.',
      icon: History,
      color: 'bg-blue-50',
      iconColor: 'text-[#0047AB]',
      path: '/warga/vaksinasi/riwayat'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[80]"
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
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-2xl z-[90] flex flex-col overflow-hidden font-sans p-8 pb-12"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center mb-6">
              <div className="w-14 h-1.5 bg-gray-100 rounded-full" />
            </div>

            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Pilih Layanan</h3>
                <p className="text-sm font-bold text-gray-400 mt-1">Layanan Vaksinasi</p>
              </div>
              <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 transition-all">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    onClose();
                    navigate(item.path);
                  }}
                  className="w-full bg-[#F8FAFC] p-6 rounded-[32px] flex items-center space-x-5 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 border border-transparent hover:border-blue-100 transition-all duration-300 group"
                >
                  <div className={`${item.color} w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className={item.iconColor} size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-black text-gray-800 text-lg leading-none">{item.title}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-2">{item.description}</p>
                  </div>
                  <div className="text-gray-300 group-hover:text-[#0047AB] transition-colors">
                    <ArrowRight size={20} strokeWidth={3} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VaksinasiDrawer;

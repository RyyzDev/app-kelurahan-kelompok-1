import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllPengumuman } from '../../services/pengumumanService';
import toast from 'react-hot-toast';

const PengumumanDrawer = ({ isOpen, onClose }) => {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await getAllPengumuman();
          setPengumumanList(res.data || []);
        } catch (err) {
          toast.error('Gagal memuat daftar pengumuman.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      setSelectedItem(null); // Reset selection when opened
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setSelectedItem(null);
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[3px] z-[80]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) handleClose();
            }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-2xl z-[90] flex flex-col h-[80vh] overflow-hidden font-sans p-8 pb-12"
          >
            {/* Pull Bar */}
            <div className="w-full flex justify-center mb-6">
              <div className="w-14 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <AnimatePresence mode="wait">
              {!selectedItem ? (
                // VIEW 1: Announcement List
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                        <Megaphone className="text-[#0047AB]" size={26} strokeWidth={2.5} />
                        Pengumuman Resmi
                      </h3>
                      <p className="text-sm font-bold text-gray-400 mt-1">Informasi terbaru kelurahan untuk warga</p>
                    </div>
                    <button onClick={handleClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 transition-all">
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>

                  {/* List Container */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047AB] mb-4"></div>
                        <p className="font-bold text-sm">Memuat pengumuman...</p>
                      </div>
                    ) : pengumumanList.length === 0 ? (
                      <div className="text-center py-20 text-gray-400">
                        <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold">Belum ada pengumuman saat ini.</p>
                      </div>
                    ) : (
                      pengumumanList.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="w-full bg-[#F8FAFC] p-5 rounded-[28px] flex items-center space-x-5 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 border border-transparent hover:border-blue-100 transition-all duration-300 group"
                        >
                          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-[#0047AB] group-hover:scale-110 transition-transform duration-500">
                            <Megaphone size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center space-x-2 text-gray-400 text-[10px] font-bold mb-1">
                              <Calendar size={10} />
                              <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <h4 className="font-black text-gray-800 text-sm truncate leading-snug">{item.judul}</h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">{item.konten}</p>
                          </div>
                          <div className="text-gray-300 group-hover:text-[#0047AB] transition-colors">
                            <ChevronRight size={18} strokeWidth={3} />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                // VIEW 2: Announcement Detail
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <button 
                      onClick={() => setSelectedItem(null)} 
                      className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all flex items-center space-x-2 font-bold text-xs"
                    >
                      <ArrowLeft size={16} strokeWidth={3} />
                      <span>Kembali</span>
                    </button>
                    <button onClick={handleClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 transition-all">
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold mb-3">
                      <Calendar size={12} />
                      <span>{new Date(selectedItem.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-5 tracking-tight">{selectedItem.judul}</h3>
                    <div className="bg-[#F8FAFC] p-6 rounded-[28px] border border-gray-50">
                      <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                        {selectedItem.konten}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PengumumanDrawer;

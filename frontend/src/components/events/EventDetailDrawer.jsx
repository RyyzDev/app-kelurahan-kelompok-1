import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle2, Ticket, Award, Info, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const STATIC_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Separate component for the ticket modal
export const TicketModal = ({ registration, event, onClose }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden text-center">
        <div className="p-8 bg-green-500 text-white">
          <Award size={48} className="mx-auto" />
          <h3 className="text-2xl font-black mt-4">Pendaftaran Berhasil!</h3>
          <p className="opacity-80 font-bold text-sm mt-1">Simpan dan tunjukkan tiket QR ini di lokasi.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-white p-4 border-4 border-gray-100 rounded-3xl inline-block shadow-inner">
            <QRCodeSVG value={registration.id} size={180} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-bold">Tiket untuk:</p>
            <h4 className="text-xl font-extrabold text-gray-800">{event.nama_event}</h4>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-gray-800 text-white font-bold rounded-2xl">Tutup</button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const EventDetailDrawer = ({ event, isOpen, onClose, onRegister, isRegistered, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
        className="fixed inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-[40px] shadow-2xl z-[90] flex flex-col"
      >
        <div className="w-full flex justify-center py-4 shrink-0"><div className="w-14 h-1.5 bg-gray-200 rounded-full" /></div>
        
        <div className="flex-1 overflow-y-auto pb-32">
          {event.foto_url && (
            <div className="h-64 px-6">
              <img src={`${STATIC_URL}${event.foto_url}`} alt={event.nama_event} className="w-full h-full object-cover rounded-3xl" />
            </div>
          )}
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{event.nama_event}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-600"><Calendar size={16} className="text-blue-500"/><span>{new Date(event.tanggal).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</span></div>
              <div className="flex items-center space-x-2 font-semibold text-gray-600"><MapPin size={16} className="text-blue-500"/><span>{event.lokasi || 'Online'}</span></div>
            </div>
            <p className="text-gray-600 leading-relaxed">{event.deskripsi || 'Tidak ada deskripsi untuk event ini.'}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t">
          {isRegistered ? (
            <div className="flex items-center justify-center space-x-3 text-center py-4 bg-green-100 text-green-700 font-bold rounded-2xl">
              <CheckCircle2 />
              <span>Anda Sudah Terdaftar</span>
            </div>
          ) : (
            <button 
              onClick={() => onRegister(event.id)}
              disabled={isLoading}
              className="w-full py-5 bg-[#0047AB] text-white font-black rounded-2xl flex items-center justify-center space-x-3 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Ticket />}
              <span>Daftar Event Ini</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetailDrawer;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Syringe, Calendar, Clock, MapPin, Users, CheckCircle2, Ticket, Loader2, Info } from 'lucide-react';
import { getAvailableJadwal, registerForVaksinasi, getMyVaksinasi } from '../../services/vaksinasiService';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

// Ticket Modal for Vaccination
const VaksinasiTicketModal = ({ registration, onClose }) => {
    if (!registration) return null;
    const { jadwal } = registration;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-xl w-full max-w-sm text-center p-8">
                <CheckCircle2 size={48} className="mx-auto text-green-500" />
                <h3 className="text-2xl font-bold mt-4">Pendaftaran Berhasil!</h3>
                <p className="text-gray-500 mt-2">No. Antrian Anda: <span className="font-extrabold text-2xl text-blue-600">{registration.nomor_antrian}</span></p>
                <div className="my-6 p-4 bg-gray-100 rounded-2xl inline-block">
                    <QRCodeSVG value={registration.id} size={160} />
                </div>
                <p className="text-sm font-bold">{jadwal.nama_vaksin}</p>
                <p className="text-xs text-gray-500">{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                <button onClick={onClose} className="mt-6 w-full py-3 bg-gray-800 text-white font-bold rounded-xl">Tutup</button>
            </motion.div>
        </motion.div>
    );
};


const VaksinasiDrawer = ({ isOpen, onClose }) => {
  const [jadwalList, setJadwalList] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(null); // Use ID to track which one is loading
  const [ticket, setTicket] = useState(null); // For showing the ticket modal

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [jadwalRes, regisRes] = await Promise.all([
            getAvailableJadwal(),
            getMyVaksinasi()
          ]);
          setJadwalList(jadwalRes.data);
          setMyRegistrations(regisRes.data.map(r => r.jadwal_id));
        } catch (err) {
          toast.error("Gagal memuat jadwal vaksinasi.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleRegister = async (jadwalId) => {
    setIsRegistering(jadwalId);
    try {
      const response = await registerForVaksinasi(jadwalId);
      setTicket(response.data); // Show ticket modal
      setMyRegistrations(prev => [...prev, jadwalId]); // Update UI to show registered status
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mendaftar.');
    } finally {
      setIsRegistering(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[80]" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} className="fixed inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-[40px] shadow-2xl z-[90] flex flex-col p-8">
            <div className="text-center mb-6"><div className="w-14 h-1.5 bg-gray-200 rounded-full inline-block" /></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Jadwal Vaksinasi Tersedia</h3>
              <button onClick={onClose} className="p-2 text-gray-400 bg-gray-100 rounded-full"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {isLoading ? <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-500" /></div> : 
               jadwalList.length === 0 ? <p className="text-center text-gray-500 pt-20">Belum ada jadwal vaksinasi yang tersedia.</p> :
               jadwalList.filter(j => j.status === 'TERSEDIA').map(jadwal => {
                const isRegistered = myRegistrations.includes(jadwal.id);
                return (
                  <div key={jadwal.id} className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                    <h4 className="font-bold text-lg text-blue-800">{jadwal.nama_vaksin}</h4>
                    <p className="text-xs text-gray-500 mb-3">{jadwal.deskripsi}</p>
                    <div className="text-xs space-y-1 text-gray-600 font-medium">
                      <p className="flex items-center"><Calendar size={14} className="mr-2"/> {new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p className="flex items-center"><Clock size={14} className="mr-2"/> {jadwal.jam_mulai} - {jadwal.jam_selesai}</p>
                      <p className="flex items-center"><MapPin size={14} className="mr-2"/> {jadwal.lokasi}</p>
                      <p className="flex items-center"><Users size={14} className="mr-2"/> Sisa Kuota: {jadwal.sisa_kuota}</p>
                    </div>
                    <div className="mt-4">
                      {isRegistered ? (
                        <div className="w-full text-center py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm flex items-center justify-center"><CheckCircle2 size={16} className="mr-2"/> Terdaftar</div>
                      ) : (
                        <button onClick={() => handleRegister(jadwal.id)} disabled={isRegistering === jadwal.id} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center disabled:opacity-50">
                          {isRegistering === jadwal.id ? <Loader2 className="animate-spin"/> : <><Ticket size={16} className="mr-2"/> Daftar Sekarang</>}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
      {ticket && <VaksinasiTicketModal registration={ticket} onClose={() => setTicket(null)} />}
    </AnimatePresence>
  );
};

export default VaksinasiDrawer;

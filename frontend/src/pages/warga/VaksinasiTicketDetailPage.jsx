import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Calendar, Clock, MapPin, Syringe, Info, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getVaksinasiRegistrationById } from '../../services/vaksinasiService';
import toast from 'react-hot-toast';

const VaksinasiTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getVaksinasiRegistrationById(id);
        setTicket(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal memuat detail tiket vaksinasi.');
        navigate('/warga/notifikasi'); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32}/>
      </div>
    );
  }

  if (!ticket) return null;

  const { user, jadwal, nomor_antrian } = ticket;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b border-gray-100 flex items-center space-x-5">
        <button onClick={() => navigate('/warga/notifikasi')} className="p-2.5 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 border bg-white">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Tiket Vaksinasi</h1>
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden">
          <div className="p-8 text-center bg-blue-50">
             <div className="inline-block p-4 bg-white rounded-3xl border-4 border-gray-200 shadow-inner">
                <QRCodeSVG value={ticket.id} size={200} />
             </div>
             <p className="text-sm text-gray-500 font-bold mt-4">No. Antrian Anda</p>
             <p className="text-6xl font-black text-blue-600">{nomor_antrian}</p>
          </div>

          <div className="p-8 space-y-5">
             <div className="pb-4 border-b">
                <h3 className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2">Pemegang Tiket</h3>
                <div className="flex items-center space-x-3"><User className="text-gray-400"/><span className="font-bold text-gray-800">{user.nama_lengkap}</span></div>
                <div className="flex items-center space-x-3 mt-2"><Hash className="text-gray-400"/><span className="font-bold text-gray-800">{user.nik}</span></div>
             </div>
             <div className="pb-4 border-b">
                <h3 className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2">Detail Jadwal</h3>
                <div className="flex items-center space-x-3"><Syringe className="text-gray-400"/><span className="font-bold text-gray-800">{jadwal.nama_vaksin}</span></div>
                <div className="flex items-center space-x-3 mt-2"><Calendar className="text-gray-400"/><span className="font-bold text-gray-800">{new Date(jadwal.tanggal).toLocaleString('id-ID', { dateStyle: 'full' })}</span></div>
                <div className="flex items-center space-x-3 mt-2"><Clock className="text-gray-400"/><span className="font-bold text-gray-800">{jadwal.jam_mulai} - {jadwal.jam_selesai}</span></div>
                <div className="flex items-center space-x-3 mt-2"><MapPin className="text-gray-400"/><span className="font-bold text-gray-800">{jadwal.lokasi}</span></div>
             </div>
             <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center space-x-4">
                <Info className="text-yellow-500 shrink-0" size={24}/>
                <p className="text-xs font-bold text-yellow-700">Tunjukkan tiket QR ini dan KTP asli kepada petugas di lokasi untuk validasi.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaksinasiTicketDetailPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Calendar, MapPin, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getRegistrationById } from '../../services/eventService';
import toast from 'react-hot-toast';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getRegistrationById(id);
        setTicket(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal memuat detail tiket.');
        navigate(-1); // Go back if ticket not found or not authorized
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Memuat tiket...</p>
      </div>
    );
  }

  if (!ticket) return null;

  const { user, event } = ticket;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b border-gray-100 flex items-center space-x-5">
        <button onClick={() => navigate('/warga/notifikasi')} className="p-2.5 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 border bg-white">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Detail Tiket Event</h1>
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden">
          {/* Top part with Event Image */}
          {event.foto_url && (
            <div className="h-48 relative">
              <img src={`${import.meta.env.REACT_APP_API_URL}${event.foto_url}`} alt={event.nama_event} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="font-extrabold text-2xl tracking-tight">{event.nama_event}</h2>
              </div>
            </div>
          )}

          {/* QR Code Section */}
          <div className="p-8 text-center bg-gray-50">
             <div className="inline-block p-4 bg-white rounded-3xl border-4 border-gray-200 shadow-inner">
                <QRCodeSVG value={ticket.id} size={200} />
             </div>
             <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">ID Tiket: {ticket.id.substring(0,8)}</p>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-5">
             <div className="pb-4 border-b">
                <h3 className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2">Pemegang Tiket</h3>
                <div className="flex items-center space-x-3">
                   <User className="text-blue-500"/>
                   <span className="font-bold text-gray-800">{user.nama_lengkap}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                   <Hash className="text-blue-500"/>
                   <span className="font-bold text-gray-800">{user.nik}</span>
                </div>
             </div>
             <div className="pb-4 border-b">
                <h3 className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2">Detail Acara</h3>
                <div className="flex items-center space-x-3">
                   <Calendar className="text-blue-500"/>
                   <span className="font-bold text-gray-800">{new Date(event.tanggal).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                   <MapPin className="text-blue-500"/>
                   <span className="font-bold text-gray-800">{event.lokasi}</span>
                </div>
             </div>
             <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center space-x-4">
                <Info className="text-yellow-500 shrink-0" size={24}/>
                <p className="text-xs font-bold text-yellow-700">Tunjukkan tiket QR ini kepada petugas di lokasi acara untuk validasi.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;

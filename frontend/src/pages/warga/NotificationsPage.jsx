import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Ticket, Syringe, Loader2, ShoppingBag } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getMyRegistrations as getMyEventRegistrations } from '../../services/eventService';
import { getMyVaksinasi } from '../../services/vaksinasiService';
import { getMyOrders } from '../../services/orderService';
import toast from 'react-hot-toast';

// Tab for Event Tickets
const EventNotifications = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getMyEventRegistrations();
        setRegistrations(response.data);
      } catch (err) {
        toast.error('Gagal memuat riwayat event.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Ticket size={48} className="mx-auto mb-4" />
        <p className="font-bold">Anda belum terdaftar di event manapun.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map(({ id, event }) => (
        <Link to={`/warga/tiket/${id}`} key={id} className="block bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <QRCodeSVG value={id} size={56} />
            </div>
            <div className="flex-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${event.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {event.status === 'aktif' ? 'Akan Datang' : 'Berakhir'}
              </span>
              <h3 className="font-bold text-gray-800 mt-1">{event.nama_event}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
  };

  // Tab for Order History
  const OrderNotifications = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (err) {
        toast.error("Gagal memuat riwayat pesanan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <ShoppingBag size={48} className="mx-auto mb-4" />
        <p className="font-bold">Anda belum memiliki riwayat pesanan.</p>
      </div>
    );
  }

  const getStatusChip = (status) => {
    switch (status) {
      case 'berhasil': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Link to={`/warga/pesanan/${order.id}`} key={order.id} className="block bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400">Order ID: {order.id.substring(0, 8).toUpperCase()}</p>
              <p className="font-bold text-gray-800">Total: Rp {Number(order.total_harga).toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-500">{order.items.length} item · {new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${getStatusChip(order.status_pembayaran)}`}>
              {order.status_pembayaran}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
  };


  // Tab for Vaccination History
const VaksinasiNotifications = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getMyVaksinasi();
        setRegistrations(response.data);
      } catch (err) {
        toast.error("Gagal memuat riwayat vaksinasi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Syringe size={48} className="mx-auto mb-4" />
        <p className="font-bold">Anda belum memiliki riwayat pendaftaran vaksinasi.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {registrations.map(({ id, jadwal, nomor_antrian, status }) => (
        <Link to={`/warga/vaksinasi/tiket/${id}`} key={id} className="block bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <QRCodeSVG value={id} size={56} />
            </div>
            <div className="flex-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                status === 'hadir' ? 'bg-green-100 text-green-700' :
                jadwal.status === 'SELESAI' && status !== 'hadir' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {jadwal.status === 'SELESAI' ? (status === 'hadir' ? 'Selesai' : 'Tidak Hadir') : 'Terdaftar'}
              </span>
              <h3 className="font-bold text-gray-800 mt-1">{jadwal.nama_vaksin}</h3>
              <p className="text-xs text-gray-500">No. Antrian: {nomor_antrian}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}


// Main Notifications Page
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('event');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b border-gray-100 flex items-center space-x-5">
        <button onClick={() => navigate('/warga')} className="p-2.5 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 border bg-white">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Notifikasi & Tiket</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-100 p-2 rounded-2xl">
            <button 
              onClick={() => setActiveTab('event')}
              className={`flex-1 p-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${activeTab === 'event' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-500'}`}
            >
              <Ticket />
              <span>Event</span>
            </button>
            <button
              onClick={() => setActiveTab('vaksinasi')}
              className={`flex-1 p-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${activeTab === 'vaksinasi' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-500'}`}
            >
              <Syringe />
              <span>Vaksinasi</span>
            </button>
            <button
              onClick={() => setActiveTab('transaksi')}
              className={`flex-1 p-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${activeTab === 'transaksi' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-500'}`}
            >
              <ShoppingBag />
              <span>Transaksi</span>
            </button>
          </div>
        </div>
        
        {activeTab === 'event' && <EventNotifications />}
        {activeTab === 'vaksinasi' && <VaksinasiNotifications />}
        {activeTab === 'transaksi' && <OrderNotifications />}
      </main>
    </div>
  );
};

export default NotificationsPage;

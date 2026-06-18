import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getOrderById } from '../../services/orderService';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal memuat detail pesanan.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'berhasil': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-6 border-b flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full"><ArrowLeft /></button>
        <div>
          <h1 className="text-xl font-bold">Detail Pesanan</h1>
          <p className="text-xs text-gray-500">ID: {order.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </header>
      <main className="p-6">
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex justify-between items-center pb-4 border-b mb-4">
            <div>
              <p className="text-sm text-gray-500">Tanggal Pesanan</p>
              <p className="font-bold">{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${getStatusChip(order.status_pembayaran)}`}>
              {order.status_pembayaran}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <p className="font-extrabold text-2xl text-blue-600">Rp {Number(order.total_harga).toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-bold mb-4">Ringkasan Pesanan ({order.items.length} item)</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.nama_produk}</p>
                  <p className="text-sm text-gray-500">{item.kuantitas} x Rp {Number(item.harga).toLocaleString('id-ID')}</p>
                </div>
                <p className="font-bold">Rp {Number(item.kuantitas * item.harga).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;

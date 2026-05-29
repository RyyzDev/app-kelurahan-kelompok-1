import { useState } from 'react';
import SlotPicker from '../../components/antrian/SlotPicker';
import QRCodeCard from '../../components/antrian/QRCodeCard';
import toast from 'react-hot-toast';

const AntrianPage = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error('Silakan pilih slot waktu terlebih dahulu');
      return;
    }

    setIsBooking(true);
    // Simulasi API call
    setTimeout(() => {
      const mockResult = {
        id: 'Q-12345',
        number: 'A-042',
        slot: selectedSlot.time,
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        qrValue: 'SIGERCAP-Q-12345',
      };
      setQueueData(mockResult);
      setIsBooking(false);
      toast.success('Berhasil memesan antrean!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {!queueData ? (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-text-h mb-2">Ambil Antrean</h1>
            <p className="text-text mb-8">Pilih waktu kedatangan Anda untuk menghindari kerumunan.</p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-text-h">Slot Waktu Tersedia</h3>
              <SlotPicker onSelect={setSelectedSlot} selectedSlot={selectedSlot} />
            </div>

            <div className="border-t pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-text">Slot Terpilih:</p>
                <p className="font-bold text-primary">{selectedSlot ? selectedSlot.time : 'Belum dipilih'}</p>
              </div>
              <button
                disabled={!selectedSlot || isBooking}
                onClick={handleBooking}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 disabled:bg-gray-300 transition shadow-lg shadow-primary/20"
              >
                {isBooking ? 'Memproses...' : 'Konfirmasi Booking'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-h mb-2">Booking Berhasil!</h1>
              <p className="text-text">Tunjukkan QR Code ini kepada petugas saat di lokasi.</p>
            </div>
            
            <QRCodeCard queueData={queueData} />
            
            <button
              onClick={() => setQueueData(null)}
              className="mt-8 text-primary font-semibold hover:underline"
            >
              Kembali ke Pemilihan Slot
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AntrianPage;

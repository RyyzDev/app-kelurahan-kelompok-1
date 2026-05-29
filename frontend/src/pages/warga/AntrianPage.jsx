import { useState } from 'react';
import SlotPicker from '../../components/antrian/SlotPicker';
import QRCodeCard from '../../components/antrian/QRCodeCard';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AntrianPage = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header with Back Button */}
      <header className="bg-white px-6 py-5 flex items-center sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => navigate('/warga')}
          className="p-2 -ml-2 text-gray-400 hover:text-[#0047AB] transition mr-4"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-[#333] tracking-tight">Ambil Antrean</h1>
      </header>

      <main className="p-6 max-w-5xl mx-auto pb-20">
        {!queueData ? (
          <div className="space-y-8">
            {/* Page Header */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEF5FF] rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#EEF5FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Calendar className="text-[#0047AB]" size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-extrabold text-[#333] mb-3 tracking-tight">Pilih Waktu Kedatangan</h1>
                <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                  Booking waktu layanan untuk meminimalkan waktu tunggu di lokasi. 
                  Silakan pilih slot yang masih tersedia di bawah ini.
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#EEF5FF] p-5 rounded-[24px] border border-[#0047AB]/10 flex items-start space-x-4">
               <div className="bg-white p-2 rounded-xl shadow-sm">
                 <Info className="text-[#0047AB]" size={20} strokeWidth={2.5} />
               </div>
               <p className="text-[#0047AB] font-bold text-sm leading-relaxed">
                 Satu NIK hanya dapat memesan satu antrean per hari. Harap datang 10 menit sebelum slot waktu pilihan Anda.
               </p>
            </div>

            {/* Slot Picker Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-[#333] px-2 flex items-center">
                Slot Tersedia
                <span className="ml-3 text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider font-bold">Hari Ini</span>
              </h3>
              <SlotPicker onSelect={setSelectedSlot} selectedSlot={selectedSlot} />
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6 flex justify-between items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-none md:p-0 md:shadow-none">
              <div className="hidden md:block">
                <p className="text-gray-400 font-extrabold text-[10px] uppercase tracking-widest mb-1">Slot Terpilih</p>
                <p className="font-extrabold text-2xl text-[#0047AB] tracking-tight">
                  {selectedSlot ? selectedSlot.time : 'Pilih slot...'}
                </p>
              </div>
              
              <button
                disabled={!selectedSlot || isBooking}
                onClick={handleBooking}
                className="w-full md:w-auto px-12 py-5 bg-[#0047AB] text-white rounded-2xl font-extrabold text-sm uppercase tracking-[0.2em] hover:bg-[#003580] hover:shadow-xl hover:shadow-blue-200 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg shadow-blue-100"
              >
                {isBooking ? (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </div>
                ) : 'Konfirmasi Booking'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <div className="text-center mb-10 max-w-md">
              <div className="w-20 h-20 bg-[#34A853]/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#34A853]/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h1 className="text-3xl font-extrabold text-[#333] mb-3 tracking-tight">Booking Berhasil!</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                Nomor antrean Anda telah diterbitkan. Silakan simpan atau tunjukkan QR Code di bawah kepada petugas.
              </p>
            </div>
            
            <QRCodeCard queueData={queueData} />
            
            <button
              onClick={() => setQueueData(null)}
              className="mt-12 text-[#4DA9FF] font-extrabold text-sm uppercase tracking-[0.2em] hover:text-[#0047AB] transition-colors flex items-center space-x-2"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              <span>Ganti Slot Antrean</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AntrianPage;

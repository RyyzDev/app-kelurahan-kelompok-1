import { useState, useEffect, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Wifi, WifiOff, CheckCircle2, Loader2, RefreshCw, UserCheck, LogOut, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { saveScanOffline, getPendingScans, markScanAsSynced } from '../../utils/offlineQueue';

const ScanPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [scanResult, setScanResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const dispatch = useDispatch();

  const checkPendingScans = useCallback(async () => {
    const pending = await getPendingScans();
    setPendingSync(pending.length);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const timer = setTimeout(() => {
      checkPendingScans().catch(console.error);
    }, 0);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, [checkPendingScans]);

  const handleScan = async (result) => {
    if (!result || isVerifying) return;
    
    setIsVerifying(true);
    const qrValue = result[0]?.rawValue;

    setTimeout(async () => {
      const mockResult = {
        success: true,
        warga: {
          nama: 'Budi Santoso',
          nik: '3275010101010001',
          status: 'Eligible',
          bansos: 'Bansos Sembako Tahap 2'
        }
      };

      if (isOnline) {
        toast.success('Verifikasi Online Berhasil!');
      } else {
        await saveScanOffline({ qrValue, warga: mockResult.warga });
        await checkPendingScans();
        toast('Tersimpan Offline', { icon: '💾' });
      }

      setScanResult(mockResult.warga);
      setIsVerifying(false);
    }, 1500);
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Gagal Sinkronisasi: Anda sedang offline');
      return;
    }

    const pending = await getPendingScans();
    if (pending.length === 0) return;

    toast.loading('Mensinkronisasi data...', { id: 'sync' });
    
    for (const scan of pending) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await markScanAsSynced(scan.id);
    }

    toast.success('Sinkronisasi Berhasil!', { id: 'sync' });
    await checkPendingScans();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isOnline ? <Wifi size={22} strokeWidth={2.5} /> : <WifiOff size={22} strokeWidth={2.5} />}
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-none">Petugas Lapangan</h1>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online Protocol' : 'Offline Mode Active'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {pendingSync > 0 && (
            <button 
              onClick={handleSync}
              className="flex items-center space-x-2 bg-[#0047AB] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-md shadow-blue-100"
            >
              <RefreshCw size={14} strokeWidth={3} className={isOnline ? 'animate-spin' : ''} />
              <span>Sync ({pendingSync})</span>
            </button>
          )}
          <button onClick={() => dispatch(logout())} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
             <LogOut size={22} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        {!scanResult ? (
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0047AB]">
                 <QrCode size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Scan Antrean</h2>
              <p className="text-gray-500 font-medium mt-1">Verifikasi QR Code warga untuk distribusi</p>
            </div>

            <div className="aspect-square w-full bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-white p-2">
              <Scanner
                onScan={handleScan}
                onError={(error) => console.log(error?.message)}
                constraints={{ facingMode: 'environment' }}
                styles={{ container: { width: '100%', height: '100%', borderRadius: '32px' } }}
              />
              {isVerifying && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                  <Loader2 className="animate-spin mb-4 text-[#4DA9FF]" size={56} strokeWidth={3} />
                  <p className="font-black uppercase tracking-[0.2em] text-xs">Authenticating...</p>
                </div>
              )}
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-[#4DA9FF] rounded-tl-2xl shadow-[0_0_15px_rgba(77,169,255,0.5)]"></div>
                  <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-[#4DA9FF] rounded-tr-2xl shadow-[0_0_15px_rgba(77,169,255,0.5)]"></div>
                  <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-[#4DA9FF] rounded-bl-2xl shadow-[0_0_15px_rgba(77,169,255,0.5)]"></div>
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-[#4DA9FF] rounded-br-2xl shadow-[0_0_15px_rgba(77,169,255,0.5)]"></div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4DA9FF] to-transparent top-0 animate-[scan_2s_linear_infinite] shadow-[0_0_10px_rgba(77,169,255,0.8)]"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center space-x-5 shadow-sm">
              <div className="bg-blue-50 p-3.5 rounded-2xl text-[#0047AB]">
                <UserCheck size={28} strokeWidth={2.5} />
              </div>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                DATA TERSIMPAN OTOMATIS JIKA OFFLINE. PASTIKAN SINKRONISASI SETELAH TERHUBUNG INTERNET.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#0047AB] p-10 flex flex-col items-center text-white relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="bg-white/20 p-5 rounded-[32px] mb-6 backdrop-blur-md">
                 <CheckCircle2 size={64} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Verifikasi Berhasil</h2>
              <p className="text-blue-100/70 text-xs font-black uppercase tracking-widest mt-2">Validated Citizen</p>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</p>
                  <p className="text-xl font-extrabold text-gray-800">{scanResult.nama}</p>
                </div>
                <div className="border-b border-gray-50 pb-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">NIK Identitas</p>
                  <p className="text-xl font-extrabold text-gray-800 tracking-wider">{scanResult.nik}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Program Bantuan</p>
                  <p className="text-xl font-extrabold text-[#0047AB]">{scanResult.bansos}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-4">
                <button 
                  onClick={() => setScanResult(null)}
                  className="w-full py-5 bg-[#0047AB] text-white font-black rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest"
                >
                  Konfirmasi Selesai
                </button>
                <button 
                  onClick={() => setScanResult(null)}
                  className="w-full py-5 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                >
                  Laporkan Kendala
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanPage;

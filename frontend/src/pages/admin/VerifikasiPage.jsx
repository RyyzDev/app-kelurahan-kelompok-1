import { CheckCircle2, XCircle, Eye, Search, Filter, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockApplications = [
  { 
    id: 1, 
    nik: '3275010101010001', 
    nama: 'Budi Santoso', 
    tgl_daftar: '2026-05-28', 
    status: 'Perlu Review',
    skor: 85
  },
  { 
    id: 2, 
    nik: '3275010101010005', 
    nama: 'Ani Wijaya', 
    tgl_daftar: '2026-05-28', 
    status: 'Perlu Review',
    skor: 70
  },
  { 
    id: 3, 
    nik: '3275010101010010', 
    nama: 'Eko Sulistyo', 
    tgl_daftar: '2026-05-27', 
    status: 'Disetujui',
    skor: 92
  },
  { 
    id: 4, 
    nik: '3275010101010012', 
    nama: 'Siti Aminah', 
    tgl_daftar: '2026-05-27', 
    status: 'Ditolak',
    skor: 45
  },
];

const VerifikasiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/admin')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
           <ShieldCheck className="text-[#0047AB]" size={24} />
           <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Verifikasi Bansos</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Daftar Pengajuan</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Review dan validasi data KTP otomatis warga.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
              <input 
                type="text"
                placeholder="Cari NIK atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none font-medium text-sm transition-all"
              />
            </div>
            <button className="flex items-center space-x-2 px-5 py-3 border border-gray-200 bg-white rounded-2xl hover:bg-gray-50 transition font-bold text-sm text-gray-600">
              <Filter size={18} strokeWidth={2.5} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-8 py-5">Identitas Warga</th>
                  <th className="px-8 py-5">Tgl Daftar</th>
                  <th className="px-8 py-5 text-center">Skor Kelayakan</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                    <td className="px-8 py-6">
                      <div className="font-extrabold text-gray-800 text-base">{app.nama}</div>
                      <div className="text-xs text-gray-400 font-bold mt-0.5">{app.nik}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-bold">
                      {new Date(app.tgl_daftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center">
                        <div className={`text-sm font-black mb-1.5 ${app.skor > 80 ? 'text-green-600' : app.skor > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {app.skor}%
                        </div>
                        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${app.skor > 80 ? 'bg-green-500' : app.skor > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${app.skor}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`
                        px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block
                        ${app.status === 'Perlu Review' ? 'bg-blue-50 text-[#0047AB] border border-blue-100' : ''}
                        ${app.status === 'Disetujui' ? 'bg-green-50 text-green-600 border border-green-100' : ''}
                        ${app.status === 'Ditolak' ? 'bg-red-50 text-red-600 border border-red-100' : ''}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 text-gray-400 hover:text-[#0047AB] hover:bg-blue-50 rounded-xl transition-all" title="Review Detail">
                          <Eye size={20} strokeWidth={2.5} />
                        </button>
                        {app.status === 'Perlu Review' && (
                          <>
                            <button className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Setujui">
                              <CheckCircle2 size={20} strokeWidth={2.5} />
                            </button>
                            <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Tolak">
                              <XCircle size={20} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-gray-50 bg-[#F8FAFC]/50 flex justify-between items-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Menampilkan 4 dari 48 pengajuan</p>
            <div className="flex space-x-3">
              <button disabled className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-400 bg-white disabled:opacity-50">Prev</button>
              <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#0047AB] hover:text-[#0047AB] transition-all">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifikasiPage;

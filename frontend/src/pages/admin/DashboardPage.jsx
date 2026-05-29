import StatsCard from '../../components/admin/StatsCard';
import AntrianTable from '../../components/admin/AntrianTable';
import ExportButton from '../../components/admin/ExportButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, ClipboardCheck, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const data = [
  { day: 'Sen', total: 120 },
  { day: 'Sel', total: 150 },
  { day: 'Rab', total: 200 },
  { day: 'Kam', total: 180 },
  { day: 'Jum', total: 250 },
  { day: 'Sab', total: 100 },
  { day: 'Min', total: 50 },
];

const mockExportData = [
  { id: 1, nama: 'Budi Santoso', nik: '3275010101010001', tanggal: '2026-05-28', status: 'Disetujui' },
  { id: 2, nama: 'Siti Aminah', nik: '3275010101010002', tanggal: '2026-05-28', status: 'Pending' },
  { id: 3, nama: 'Agus Pratama', nik: '3275010101010003', tanggal: '2026-05-27', status: 'Disetujui' },
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#0047AB] p-2 rounded-xl">
             <LayoutDashboard className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">SI-GERCAP <span className="text-[#0047AB]">Admin</span></h1>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
            <p className="text-gray-500 font-medium mt-1">Ringkasan operasional Kelurahan hari ini.</p>
          </div>
          <ExportButton data={mockExportData} />
        </div>

        {/* Stats */}
        <StatsCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-800 mb-8">Distribusi Bansos Mingguan</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  />
                  <Bar dataKey="total" fill="#0047AB" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <button 
              onClick={() => navigate('/admin/verifikasi')}
              className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#0047AB] transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-[#0047AB] group-hover:bg-[#0047AB] group-hover:text-white transition-all duration-300">
                  <ClipboardCheck size={28} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-gray-800">Verifikasi Bansos</h3>
                  <p className="text-xs text-gray-500 font-bold">12 pengajuan perlu direview</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-[#0047AB] transition" size={20} strokeWidth={3} />
            </button>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-800 mb-8 tracking-tight">Aktivitas Terakhir</h3>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#0047AB]"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">Verifikasi NIK 327501...</p>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">2 menit yang lalu oleh Admin</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <AntrianTable />
      </main>
    </div>
  );
};

export default DashboardPage;

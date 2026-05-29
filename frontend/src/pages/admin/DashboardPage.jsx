import StatsCard from '../../components/admin/StatsCard';
import AntrianTable from '../../components/admin/AntrianTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const data = [
  { day: 'Sen', total: 120 },
  { day: 'Sel', total: 150 },
  { day: 'Rab', total: 200 },
  { day: 'Kam', total: 180 },
  { day: 'Jum', total: 250 },
  { day: 'Sab', total: 100 },
  { day: 'Min', total: 50 },
];

const DashboardPage = () => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-border px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-primary">SI-GERCAP Admin</h1>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center space-x-2 text-text hover:text-red-500 transition font-medium"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </header>

      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-text-h">Dashboard</h2>
            <p className="text-text">Ringkasan operasional Kelurahan hari ini.</p>
          </div>
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
            Export Laporan
          </button>
        </div>

        {/* Stats */}
        <StatsCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-text-h mb-6">Distribusi Bansos Mingguan</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" fill="#aa3bff" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-text-h mb-6">Aktivitas Terakhir</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-text-h">Verifikasi NIK 327501...</p>
                    <p className="text-xs text-text">2 menit yang lalu oleh Admin 1</p>
                  </div>
                </div>
              ))}
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

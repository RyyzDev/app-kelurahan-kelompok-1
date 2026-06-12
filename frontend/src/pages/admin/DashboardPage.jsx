import React from 'react';
import StatsCard from '../../components/admin/StatsCard';
import AntrianTable from '../../components/admin/AntrianTable';
import ExportButton from '../../components/admin/ExportButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipboardCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';

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
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <main className="flex-1 p-10 max-w-7xl w-full space-y-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Ringkasan Operasional Kelurahan</p>
          </div>
          <ExportButton data={mockExportData} />
        </div>

        {/* Stats */}
        <StatsCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-100">
            <h3 className="text-lg font-black text-gray-800 mb-10 tracking-tight">Distribusi Bansos Mingguan</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 11}} />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 800, padding: '16px' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="total" fill="#0047AB" radius={[12, 12, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <button 
              onClick={() => navigate('/admin/verifikasi')}
              className="w-full bg-white p-8 rounded-[40px] shadow-xl shadow-blue-900/5 border border-gray-100 flex items-center justify-between group hover:border-[#0047AB] transition-all hover:-translate-y-1"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-blue-50 p-4 rounded-[24px] text-[#0047AB] group-hover:bg-[#0047AB] group-hover:text-white transition-all duration-300 shadow-inner">
                  <ClipboardCheck size={32} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-gray-800 text-sm">Verifikasi Surat</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">12 Perlu Review</p>
                </div>
              </div>
              <ChevronRight className="text-gray-200 group-hover:text-[#0047AB] transition-colors" size={24} strokeWidth={3} />
            </button>

            <div className="bg-white p-10 rounded-[48px] shadow-xl shadow-blue-900/5 border border-gray-100">
              <h3 className="text-lg font-black text-gray-800 mb-10 tracking-tight">Log Aktivitas</h3>
              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-5 group">
                    <div className="relative shrink-0">
                       <div className="w-3 h-3 mt-1.5 rounded-full bg-[#0047AB] z-10 relative"></div>
                       {i < 4 && <div className="absolute top-5 left-1.5 w-0.5 h-10 bg-gray-50 -ml-[1px]"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 leading-tight group-hover:text-[#0047AB] transition-colors cursor-default">Verifikasi NIK 327501...</p>
                      <p className="text-[10px] text-gray-300 font-black mt-1.5 uppercase tracking-[0.2em]">2 Menit Lalu</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Antrean Hari Ini</h3>
              <button className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest hover:underline">Lihat Semua</button>
           </div>
           <AntrianTable />
        </div>
      </main>
    </AdminLayout>
  );
};

export default DashboardPage;

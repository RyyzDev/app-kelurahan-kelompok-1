import { Users, ClipboardList, Megaphone, Calendar } from 'lucide-react';

const StatsCard = ({ data }) => {
  const stats = [
    { title: 'Total Warga', value: String(data?.totalWarga ?? 0), icon: Users, color: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Perlu Review (Surat)', value: String(data?.permohonanSurat ?? 0), icon: ClipboardList, color: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Total Pengumuman', value: String(data?.totalPengumuman ?? 0), icon: Megaphone, color: 'bg-orange-50', iconColor: 'text-orange-600' },
    { title: 'Event Aktif', value: String(data?.totalEvent ?? 0), icon: Calendar, color: 'bg-green-50', iconColor: 'text-green-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {stats.map((item, index) => (
        <div key={index} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-all duration-300 group">
          <div className={`${item.color} p-5 rounded-[24px] ${item.iconColor} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
            <item.icon size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{item.title}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;

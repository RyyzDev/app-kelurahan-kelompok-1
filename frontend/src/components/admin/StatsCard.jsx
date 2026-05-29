import { Users, ClipboardList, Package, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Total Warga', value: '1,284', icon: Users, color: 'bg-blue-500' },
  { title: 'Antrean Hari Ini', value: '156', icon: ClipboardList, color: 'bg-purple-500' },
  { title: 'Sisa Stok Bansos', value: '420', icon: Package, color: 'bg-orange-500' },
  { title: 'Tingkat Distribusi', value: '85%', icon: TrendingUp, color: 'bg-green-500' },
];

const StatsCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex items-center space-x-4">
          <div className={`${item.color} p-3 rounded-xl text-white`}>
            <item.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-text font-medium">{item.title}</p>
            <p className="text-2xl font-bold text-text-h">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;

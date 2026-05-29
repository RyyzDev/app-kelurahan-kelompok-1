const mockQueue = [
  { id: 1, number: 'A-001', name: 'Budi Santoso', slot: '08:00 - 09:00', status: 'Selesai' },
  { id: 2, number: 'A-002', name: 'Siti Aminah', slot: '08:00 - 09:00', status: 'Selesai' },
  { id: 3, number: 'A-003', name: 'Agus Pratama', slot: '09:00 - 10:00', status: 'Melayani' },
  { id: 4, number: 'A-004', name: 'Dewi Lestari', slot: '09:00 - 10:00', status: 'Menunggu' },
  { id: 5, number: 'A-005', name: 'Eko Wijaya', slot: '10:00 - 11:00', status: 'Menunggu' },
];

const AntrianTable = () => {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
        <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Live Antrean</h3>
        <div className="flex items-center space-x-2">
           <span className="flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
           </span>
           <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Monitoring Aktif</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-5">No. Antrean</th>
              <th className="px-8 py-5">Nama Warga</th>
              <th className="px-8 py-5">Slot Waktu</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockQueue.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-6 font-black text-[#0047AB] text-lg tracking-tighter">{item.number}</td>
                <td className="px-8 py-6 text-gray-800 font-extrabold">{item.name}</td>
                <td className="px-8 py-6 text-gray-500 font-bold text-sm">{item.slot}</td>
                <td className="px-8 py-6">
                  <span className={`
                    px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block
                    ${item.status === 'Selesai' ? 'bg-gray-100 text-gray-500' : ''}
                    ${item.status === 'Melayani' ? 'bg-green-50 text-green-600 border border-green-100' : ''}
                    ${item.status === 'Menunggu' ? 'bg-orange-50 text-orange-600 border border-orange-100' : ''}
                  `}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[#0047AB] hover:bg-[#0047AB] hover:text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-transparent hover:shadow-md">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AntrianTable;

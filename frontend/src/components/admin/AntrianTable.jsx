const mockQueue = [
  { id: 1, number: 'A-001', name: 'Budi Santoso', slot: '08:00 - 09:00', status: 'Selesai' },
  { id: 2, number: 'A-002', name: 'Siti Aminah', slot: '08:00 - 09:00', status: 'Selesai' },
  { id: 3, number: 'A-003', name: 'Agus Pratama', slot: '09:00 - 10:00', status: 'Melayani' },
  { id: 4, number: 'A-004', name: 'Dewi Lestari', slot: '09:00 - 10:00', status: 'Menunggu' },
  { id: 5, number: 'A-005', name: 'Eko Wijaya', slot: '10:00 - 11:00', status: 'Menunggu' },
];

const AntrianTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-h">Live Antrean</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">Live Update</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary text-text text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">No. Antrean</th>
              <th className="px-6 py-4 font-semibold">Nama Warga</th>
              <th className="px-6 py-4 font-semibold">Slot Waktu</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockQueue.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/50 transition">
                <td className="px-6 py-4 font-bold text-primary">{item.number}</td>
                <td className="px-6 py-4 text-text-h font-medium">{item.name}</td>
                <td className="px-6 py-4 text-text">{item.slot}</td>
                <td className="px-6 py-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${item.status === 'Selesai' ? 'bg-gray-100 text-gray-600' : ''}
                    ${item.status === 'Melayani' ? 'bg-green-100 text-green-600' : ''}
                    ${item.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-600' : ''}
                  `}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline text-sm font-semibold">Detail</button>
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

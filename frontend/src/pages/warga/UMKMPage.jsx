import { ArrowLeft, ShoppingBag, ExternalLink, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockUMKM = [
  {
    id: 1,
    name: 'Kripik Tempe Mak Mur',
    category: 'Camilan',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=300&q=80',
    owner: 'Ibu Murni',
    wa: '628123456789'
  },
  {
    id: 2,
    name: 'Batik Tulis Sejahtera',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1582733734033-66f81a1796be?auto=format&fit=crop&w=300&q=80',
    owner: 'Bpk. Ahmad',
    wa: '628123456790'
  },
  {
    id: 3,
    name: 'Sambal Uleg Juara',
    category: 'Bumbu Dapur',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80',
    owner: 'Ibu Siti',
    wa: '628123456791'
  },
  {
    id: 4,
    name: 'Anyaman Bambu Kreatif',
    category: 'Kerajinan',
    image: 'https://images.unsplash.com/photo-1611486212330-972142704ece?auto=format&fit=crop&w=300&q=80',
    owner: 'Bpk. Jaka',
    wa: '628123456792'
  }
];

const UMKMPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/warga')} className="mr-4 p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex items-center space-x-2">
           <Store className="text-[#0047AB]" size={24} strokeWidth={2.5} />
           <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">UMKM Corner</h1>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
        <div className="bg-gradient-to-br from-green-600 to-[#34A853] rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-green-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="mb-8 md:mb-0 md:mr-10 text-center md:text-left z-10">
            <h2 className="text-4xl font-black mb-3 tracking-tight">Dukung Produk Lokal</h2>
            <p className="text-green-50 max-w-lg text-lg font-medium opacity-90 leading-relaxed">Katalog usaha mikro, kecil, dan menengah asli kelurahan kita. Beli langsung dari tetangga!</p>
          </div>
          <div className="bg-white/20 p-8 rounded-[40px] backdrop-blur-md shadow-inner border border-white/30 transform rotate-6 z-10">
            <ShoppingBag size={80} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockUMKM.map((item) => (
            <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#34A853] px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-white/20">
                     {item.category}
                   </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-extrabold text-gray-800 text-xl leading-tight mb-2 group-hover:text-[#0047AB] transition-colors">{item.name}</h3>
                <p className="text-xs text-gray-400 font-bold italic uppercase tracking-wider mb-auto">Oleh: {item.owner}</p>
                
                <a 
                  href={`https://wa.me/${item.wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-4 bg-[#34A853] text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
                >
                  <span>Hubungi Penjual</span>
                  <ExternalLink size={16} strokeWidth={3} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center">
           <p className="text-gray-500 font-bold">Ingin UMKM Anda tampil di sini? Hubungi Kantor Kelurahan.</p>
        </div>
      </main>
    </div>
  );
};

export default UMKMPage;

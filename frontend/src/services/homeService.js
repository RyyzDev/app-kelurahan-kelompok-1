const CACHE_NAME = 'sigercap-home-cache-v1';

const mockEvents = [
  {
    id: 1,
    title: 'Kerja Bakti Massal',
    date: '15 Juni 2026',
    location: 'Lapangan Utama',
    image: 'https://images.unsplash.com/photo-1559027615-cd9d7320942d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Lomba Mewarnai Anak',
    date: '20 Juni 2026',
    location: 'Aula Kelurahan',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Pasar Murah Sembako',
    date: '25 Juni 2026',
    location: 'Halaman Kantor',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop'
  }
];

const mockBansosDist = [
  {
    id: 1,
    title: 'Sembako Tahap 3',
    status: 'Sedang Berlangsung',
    date: '12 Juni 2026',
    total_warga: '250 Warga'
  },
  {
    id: 2,
    title: 'Bantuan Tunai BBM',
    status: 'Terjadwal',
    date: '18 Juni 2026',
    total_warga: '1.200 Warga'
  },
  {
    id: 3,
    title: 'BLT Dana Desa',
    status: 'Selesai',
    date: '05 Juni 2026',
    total_warga: '450 Warga'
  }
];

export const getHomeData = async () => {
  const HOME_DATA_KEY = '/api/home/data';

  try {
    // 1. Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const data = { events: mockEvents, bansos: mockBansosDist };

    // 2. Save to Cache
    if (window.caches && navigator.onLine) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(HOME_DATA_KEY, new Response(JSON.stringify(data)));
    }

    return data;
  } catch (err) {
    // 3. Fallback to Cache
    if (window.caches) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(HOME_DATA_KEY);
      if (cachedResponse) {
        return await cachedResponse.json();
      }
    }
    return { events: [], bansos: [] };
  }
};

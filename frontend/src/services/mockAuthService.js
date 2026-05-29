/**
 * Mock Authentication Service
 * Gunakan ini untuk login sementara sebelum backend selesai.
 * Sekarang mendukung login menggunakan NIK.
 */

const MOCK_USERS = [
  {
    nik: '1234567890123456',
    password: 'password123',
    user: { id: 1, name: 'Administrator', role: 'admin', nik: '1234567890123456' },
    token: 'mock-jwt-token-admin'
  },
  {
    nik: '3275010101010001',
    password: 'password123',
    user: { id: 2, name: 'Budi Warga', role: 'warga', nik: '3275010101010001' },
    token: 'mock-jwt-token-warga'
  },
  {
    nik: '3275010101010002',
    password: 'password123',
    user: { id: 3, name: 'Siti Petugas', role: 'petugas', nik: '3275010101010002' },
    token: 'mock-jwt-token-petugas'
  }
];

export const mockLogin = async (nik, password) => {
  return new Promise((resolve, reject) => {
    // Simulasi delay jaringan
    setTimeout(() => {
      const foundUser = MOCK_USERS.find(u => u.nik === nik && u.password === password);
      
      if (foundUser) {
        resolve({
          user: foundUser.user,
          token: foundUser.token
        });
      } else {
        reject({
          response: {
            data: { message: 'NIK atau password salah' }
          }
        });
      }
    }, 1000);
  });
};

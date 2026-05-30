import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/warga/HomePage';
import BuatSuratPage from '../pages/warga/BuatSuratPage';
import DaftarStatusSuratPage from '../pages/warga/DaftarStatusSuratPage';
import DetailStatusSuratPage from '../pages/warga/DetailStatusSuratPage';
import BansosPage from '../pages/warga/BansosPage';
import AspirasiPage from '../pages/warga/AspirasiPage';
import UMKMPage from '../pages/warga/UMKMPage';
import ProfilePage from '../pages/warga/ProfilePage';
import DashboardPage from '../pages/admin/DashboardPage';
import VerifikasiPage from '../pages/admin/VerifikasiPage';
import ScanPage from '../pages/petugas/ScanPage';

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="text-center p-8 bg-white rounded-[32px] shadow-xl border border-gray-100 max-w-sm">
      <h1 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-2">Akses Ditolak</h1>
      <p className="text-gray-500 font-bold text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Warga Routes */}
        <Route
          path="/warga"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga/profil"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Persuratan Routes */}
        <Route
          path="/warga/persuratan/buat"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <BuatSuratPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga/persuratan/status"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <DaftarStatusSuratPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga/persuratan/status/:id"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <DetailStatusSuratPage />
            </ProtectedRoute>
          }
        />

        {/* Bansos Routes */}
        <Route
          path="/warga/bansos/daftar"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <BansosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga/bansos/penyaluran"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 font-sans">
                 <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 text-center max-w-sm w-full">
                    <h1 className="text-2xl font-black text-gray-800">Info Penyaluran</h1>
                    <p className="text-gray-400 font-bold mt-4 italic text-sm">Halaman informasi penyaluran bansos segera hadir.</p>
                    <button onClick={() => window.history.back()} className="mt-10 w-full py-4 bg-[#0047AB] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Kembali</button>
                 </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/warga/aspirasi"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <AspirasiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga/umkm"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <UMKMPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifikasi"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VerifikasiPage />
            </ProtectedRoute>
          }
        />

        {/* Petugas Routes */}
        <Route
          path="/petugas"
          element={
            <ProtectedRoute allowedRoles={['petugas']}>
              <ScanPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from '../components/common/Preloader';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/warga/HomePage';
import BuatSuratPage from '../pages/warga/BuatSuratPage';
import DaftarStatusSuratPage from '../pages/warga/DaftarStatusSuratPage';
import DetailStatusSuratPage from '../pages/warga/DetailStatusSuratPage';
import UMKMPage from '../pages/warga/UMKMPage';
import AspirasiPage from '../pages/warga/AspirasiPage';
import MyTokoPage from '../pages/warga/MyTokoPage';
import TokoDetailPage from '../pages/warga/TokoDetailPage';
import NotificationsPage from '../pages/warga/NotificationsPage';
import TicketDetailPage from '../pages/warga/TicketDetailPage';
import VaksinasiTicketDetailPage from '../pages/warga/VaksinasiTicketDetailPage';
import OrderDetailPage from '../pages/warga/OrderDetailPage';
import ProfilePage from '../pages/warga/ProfilePage';
import DashboardPage from '../pages/admin/DashboardPage';
import VerifikasiPage from '../pages/admin/VerifikasiPage';
import AdminUMKMPage from '../pages/admin/AdminUMKMPage';
import EventsPage from '../pages/admin/EventsPage';
import VaksinasiAdminPage from '../pages/admin/VaksinasiAdminPage';
import UsersPage from '../pages/admin/UsersPage';
import ScanPage from '../pages/petugas/ScanPage';
import AdminLayout from '../components/layout/AdminLayout';

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
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Splash screen delay 5 detik
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isAppLoading ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Preloader />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
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

              {/* Vaksinasi Routes */}
              <Route
                path="/warga/vaksinasi/daftar"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                     <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 font-sans">
                       <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 text-center max-w-sm w-full">
                          <h1 className="text-2xl font-black text-gray-800">Daftar Vaksin</h1>
                          <p className="text-gray-400 font-bold mt-4 italic text-sm">Fitur pendaftaran vaksinasi segera hadir.</p>
                          <button onClick={() => window.history.back()} className="mt-10 w-full py-4 bg-[#0047AB] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Kembali</button>
                       </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Bansos Routes */}
              {/* <Route
                path="/warga/bansos/daftar"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <BansosPage />
                  </ProtectedRoute>
                }
              /> */}
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
              <Route
                path="/warga/umkm/toko"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <MyTokoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warga/umkm/toko/:id"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <TokoDetailPage />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/warga/notifikasi"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warga/tiket/:id"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <TicketDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warga/vaksinasi/tiket/:id"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <VaksinasiTicketDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warga/pesanan/:id"
                element={
                  <ProtectedRoute allowedRoles={['warga']}>
                    <OrderDetailPage />
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
              <Route
                path="/admin/umkm"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUMKMPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/vaksinasi"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <VaksinasiAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pengaduan"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <div className="flex-1 flex items-center justify-center font-sans">
                         <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Fitur Pengaduan Warga — Segera Hadir</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                     <UsersPage />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppRouter;

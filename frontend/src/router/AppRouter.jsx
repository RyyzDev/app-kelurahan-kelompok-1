import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage';
import AntrianPage from '../pages/warga/AntrianPage';
import DashboardPage from '../pages/admin/DashboardPage';

// Placeholder pages for Phase 1
const HomePage = () => <div className="p-8"><h1>Warga Home Page</h1></div>;
const UnauthorizedPage = () => <div className="p-8 text-center text-red-500"><h1>Akses Ditolak</h1></div>;

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
          path="/warga/antrian"
          element={
            <ProtectedRoute allowedRoles={['warga']}>
              <AntrianPage />
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

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

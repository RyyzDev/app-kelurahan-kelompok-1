import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'NIK/Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
      toast.success('Login berhasil!');
      const { user } = resultAction.payload;
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'petugas') navigate('/petugas');
      else navigate('/warga');
    } else {
      toast.error(resultAction.payload || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Green Header Section */}
      <div className="w-full bg-[#34A853] h-[350px] relative flex justify-center items-center overflow-hidden">
        {/* Decorative Curve Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>

        {/* Illustration Container */}
        <div className="relative z-10 w-full max-w-[280px] flex justify-center items-center">
          {/* Main Illustration (Mocked with SVGs to match the image style) */}
          <div className="relative">
            {/* Background Laptop/Screen */}
            <div className="w-[200px] h-[140px] bg-white rounded-xl shadow-2xl relative overflow-hidden border-2 border-gray-100">
               <div className="h-4 bg-gray-50 border-b border-gray-100 flex items-center px-2 space-x-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
               </div>
               {/* User Avatar in Screen */}
               <div className="flex flex-col items-center mt-4">
                 <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                    <User size={24} className="text-[#EF4444]" />
                 </div>
                 <div className="w-24 h-2 bg-gray-100 rounded-full mt-3"></div>
                 <div className="w-20 h-2 bg-gray-50 rounded-full mt-2"></div>
               </div>
            </div>

            {/* Shield Overlay */}
            <div className="absolute -left-10 bottom-2 w-16 h-20 bg-[#0047AB] rounded-b-xl rounded-t-lg shadow-lg flex flex-col items-center justify-center border-2 border-white/30">
               <Lock size={24} className="text-white" />
               <div className="w-8 h-1 bg-white/30 rounded-full mt-2"></div>
            </div>

            {/* Floating Paper Planes */}
            <div className="absolute -top-4 -right-6 animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.53L9.66 13.66L19 7L10.33 14.33L13.47 21L21 3Z"/></svg>
            </div>
            <div className="absolute top-1/2 -right-12">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" fillOpacity="0.7"><path d="M21 3L3 10.53L9.66 13.66L19 7L10.33 14.33L13.47 21L21 3Z"/></svg>
            </div>

            {/* Gear Icon */}
            <div className="absolute -left-6 top-6 animate-spin-slow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" fillOpacity="0.5" className="text-white"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>
            </div>

            {/* Checkmark Icon */}
            <div className="absolute -right-4 bottom-10 bg-orange-400 p-1 rounded-md shadow-lg border border-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            {/* Pot Plant Icon */}
            <div className="absolute -right-10 -bottom-2">
               <div className="w-8 h-10 bg-purple-200 rounded-t-full relative">
                 <div className="absolute bottom-0 w-8 h-6 bg-purple-400 rounded-t-md"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full max-w-md flex-1 bg-white px-8 pt-10 pb-12 flex flex-col">
        <h1 className="text-[34px] font-extrabold text-[#333] mb-8 tracking-tight">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* NIK/Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('identifier')}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Masukkan NIK / Alamat Email"
            />
            {errors.identifier && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.identifier.message}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Kata Sandi"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0047AB] transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.password.message}</p>}
          </div>

          {/* Lupa Kata Sandi */}
          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold text-[#4DA9FF] hover:text-[#0047AB] transition tracking-wide">
              Lupa kata sandi?
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0047AB] text-white font-extrabold rounded-2xl hover:bg-[#003580] hover:shadow-lg hover:shadow-blue-200 disabled:bg-gray-300 transition-all shadow-md shadow-blue-100 text-base uppercase tracking-widest"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-10 text-center space-y-5">
          <p className="text-sm text-gray-500 font-medium">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-[#4DA9FF] font-extrabold hover:underline">
              Daftar
            </Link>
          </p>
          <button className="text-[#4DA9FF] text-sm font-extrabold hover:underline block w-full">
            Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction } from '../store/authSlice';
import toast from 'react-hot-toast';
import { User, CreditCard, Calendar, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Password tidak cocok",
  path: ["confirm_password"],
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(resultAction)) {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } else {
      toast.error(resultAction.payload || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Green Header Section */}
      <div className="w-full bg-[#34A853] h-[300px] relative flex justify-center items-center overflow-hidden shrink-0">
        {/* Decorative Curve Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>

        {/* Illustration Container */}
        <div className="relative z-10 w-full max-w-[280px] flex justify-center items-center">
          <div className="relative">
            {/* Background Laptop/Screen */}
            <div className="w-[180px] h-[120px] bg-white rounded-xl shadow-2xl relative overflow-hidden border-2 border-gray-100">
               <div className="h-4 bg-gray-50 border-b border-gray-100 flex items-center px-2 space-x-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
               </div>
               <div className="flex flex-col items-center mt-3">
                 <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                    <User size={20} className="text-[#059669]" />
                 </div>
                 <div className="w-20 h-2 bg-gray-100 rounded-full mt-2"></div>
                 <div className="w-16 h-2 bg-gray-50 rounded-full mt-1"></div>
               </div>
            </div>

            {/* Shield Overlay */}
            <div className="absolute -left-8 bottom-1 w-14 h-18 bg-[#0047AB] rounded-b-xl rounded-t-lg shadow-lg flex flex-col items-center justify-center border-2 border-white/30">
               <CreditCard size={20} className="text-white" />
               <div className="w-6 h-1 bg-white/30 rounded-full mt-1.5"></div>
            </div>

            {/* Floating Paper Planes */}
            <div className="absolute -top-4 -right-6 animate-bounce">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.53L9.66 13.66L19 7L10.33 14.33L13.47 21L21 3Z"/></svg>
            </div>

            {/* Gear Icon */}
            <div className="absolute -left-6 top-4 animate-spin-slow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" fillOpacity="0.5" className="text-white"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Register Form Section */}
      <div className="w-full max-w-md bg-white px-8 pt-10 pb-12 flex flex-col">
        <h1 className="text-[34px] font-extrabold text-[#333] mb-2 tracking-tight">Daftar</h1>
        <p className="text-gray-500 mb-8 font-medium">Lengkapi data diri Anda</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Lengkap */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('nama_lengkap')}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Nama Lengkap (Sesuai KTP)"
            />
            {errors.nama_lengkap && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.nama_lengkap.message}</p>}
          </div>

          {/* NIK */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CreditCard size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('nik')}
              maxLength={16}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Nomor Induk Kependudukan (16 Digit)"
            />
            {errors.nik && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.nik.message}</p>}
          </div>

          {/* Tanggal Lahir */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('tanggal_lahir')}
              type="date"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
            />
            {errors.tanggal_lahir && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.tanggal_lahir.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('email')}
              type="email"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Alamat Email"
            />
            {errors.email && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.email.message}</p>}
          </div>

          {/* Password */}
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
            {errors.password && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.password.message}</p>}
          </div>

          {/* Konfirmasi Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('confirm_password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Konfirmasi Kata Sandi"
            />
            {errors.confirm_password && <p className="mt-1 ml-2 text-[11px] text-red-500 font-bold">{errors.confirm_password.message}</p>}
          </div>

          {/* Register Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0047AB] text-white font-extrabold rounded-2xl hover:bg-[#003580] hover:shadow-lg hover:shadow-blue-200 disabled:bg-gray-300 transition-all shadow-md shadow-blue-100 text-base uppercase tracking-widest"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-[#4DA9FF] font-extrabold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

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
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">SI-GERCAP</h1>
        <p className="text-center text-gray-600 mb-8">Masuk menggunakan NIK Anda</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 Digit)</label>
            <input
              {...register('nik')}
              type="text"
              maxLength={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="Contoh: 327501..."
            />
            {errors.nik && <p className="mt-1 text-sm text-red-500">{errors.nik.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 transition"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

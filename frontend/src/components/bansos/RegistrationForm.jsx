import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, CreditCard, MapPin, Calendar, FileText, Send } from 'lucide-react';

const bansosSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nama: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  tempat_lahir: z.string().min(2, 'Tempat lahir wajib diisi'),
  tgl_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  alamat: z.string().min(5, 'Alamat lengkap wajib diisi'),
  rt_rw: z.string().regex(/^\d{3}\/\d{3}$/, 'Format RT/RW harus 000/000'),
  alasan: z.string().min(10, 'Berikan alasan singkat minimal 10 karakter'),
});

const RegistrationForm = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bansosSchema),
    defaultValues: initialData,
  });

  // Update form when OCR data changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* NIK */}
        <div className="relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">NIK (Sesuai KTP)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CreditCard size={18} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('nik')}
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="16 Digit NIK"
            />
          </div>
          {errors.nik && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.nik.message}</p>}
        </div>

        {/* Nama */}
        <div className="relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('nama')}
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Sesuai KTP"
            />
          </div>
          {errors.nama && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.nama.message}</p>}
        </div>

        {/* Tempat Lahir */}
        <div className="relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">Tempat Lahir</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin size={18} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('tempat_lahir')}
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Kota/Kabupaten"
            />
          </div>
          {errors.tempat_lahir && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.tempat_lahir.message}</p>}
        </div>

        {/* Tanggal Lahir */}
        <div className="relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">Tanggal Lahir</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar size={18} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <input
              {...register('tgl_lahir')}
              type="date"
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
            />
          </div>
          {errors.tgl_lahir && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.tgl_lahir.message}</p>}
        </div>

        {/* Alamat */}
        <div className="md:col-span-2 relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">Alamat Lengkap</label>
          <textarea
            {...register('alamat')}
            rows={3}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
            placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan..."
          />
          {errors.alamat && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.alamat.message}</p>}
        </div>

        {/* RT/RW */}
        <div className="relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">RT / RW</label>
          <input
            {...register('rt_rw')}
            placeholder="000/000"
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
          />
          {errors.rt_rw && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.rt_rw.message}</p>}
        </div>

        {/* Alasan */}
        <div className="md:col-span-2 relative">
          <label className="block text-[10px] font-extrabold text-[#0047AB] uppercase tracking-[0.2em] mb-2 ml-1">Alasan Pengajuan</label>
          <div className="relative">
            <div className="absolute top-4 left-4 flex items-start pointer-events-none">
              <FileText size={18} className="text-[#0047AB]" strokeWidth={2.5} />
            </div>
            <textarea
              {...register('alasan')}
              rows={2}
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all text-gray-700 placeholder-gray-400 font-medium text-sm"
              placeholder="Jelaskan kondisi ekonomi Anda secara singkat..."
            />
          </div>
          {errors.alasan && <p className="mt-1.5 ml-2 text-[11px] text-red-500 font-bold">{errors.alasan.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-[#0047AB] text-white font-extrabold rounded-2xl hover:bg-[#003580] hover:shadow-xl hover:shadow-blue-200 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg shadow-blue-100 uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <Send size={18} strokeWidth={2.5} />
              <span>Kirim Pengajuan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;

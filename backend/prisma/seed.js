import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { nik: '1234567890123456' },
    update: { email: 'admin@sigercap.go.id' },
    create: {
      nik: '1234567890123456',
      email: 'admin@sigercap.go.id',
      nama_lengkap: 'Admin Kelurahan',
      password,
      role: 'admin',
      tanggal_lahir: new Date('1990-01-01'),
    },
  });

  const petugas = await prisma.user.upsert({
    where: { nik: '1234567890123457' },
    update: { email: 'petugas@sigercap.go.id' },
    create: {
      nik: '1234567890123457',
      email: 'petugas@sigercap.go.id',
      nama_lengkap: 'Petugas Kelurahan',
      password,
      role: 'petugas',
      tanggal_lahir: new Date('1995-05-05'),
    },
  });

  const warga = await prisma.user.upsert({
    where: { nik: '1234567890123458' },
    update: { email: 'warga@example.com' },
    create: {
      nik: '1234567890123458',
      email: 'warga@example.com',
      nama_lengkap: 'Warga Contoh',
      password,
      role: 'warga',
      tanggal_lahir: new Date('2000-10-10'),
    },
  });

  console.log({ admin, petugas, warga });

  // Seed JenisSurat (Minimal 10 data)
  const jenisSuratData = [
    {
      nama_layanan: 'Surat Keterangan Domisili',
      deskripsi: 'Menerangkan tempat tinggal penduduk.',
      persyaratan: ['KTP', 'KK', 'Surat Pengantar RT/RW'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Tidak Mampu (SKTM)',
      deskripsi: 'Untuk bantuan sosial atau keringanan biaya.',
      persyaratan: ['KTP', 'KK', 'Pengantar RT/RW', 'Surat Pernyataan'],
      estimasi_pengerjaan: 2,
    },
    {
      nama_layanan: 'Surat Keterangan Usaha (SKU)',
      deskripsi: 'Untuk legalitas usaha kecil/mikro.',
      persyaratan: ['KTP', 'KK', 'Foto Usaha', 'Pengantar RT/RW'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Belum Menikah',
      deskripsi: 'Menerangkan status perkawinan belum menikah.',
      persyaratan: ['KTP', 'KK', 'Pernyataan Bermaterai', 'Pengantar RT/RW'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Kelahiran',
      deskripsi: 'Pengantar untuk pembuatan Akta Kelahiran.',
      persyaratan: ['KK', 'Surat Keterangan Lahir RS/Bidan', 'KTP Orang Tua'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Kematian',
      deskripsi: 'Menerangkan kematian warga untuk akta kematian.',
      persyaratan: ['KTP Almarhum', 'KK', 'Surat Kematian RS/Puskesmas'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Pindah (SKPWNI)',
      deskripsi: 'Proses pindah alamat keluar domisili.',
      persyaratan: ['KTP', 'KK Asli', 'Alamat Tujuan Jelas'],
      estimasi_pengerjaan: 3,
    },
    {
      nama_layanan: 'Surat Pengantar SKCK',
      deskripsi: 'Pengantar untuk permohonan SKCK di Polsek/Polres.',
      persyaratan: ['KTP', 'KK', 'Pengantar RT/RW'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Penghasilan',
      deskripsi: 'Menerangkan jumlah penghasilan orang tua/warga.',
      persyaratan: ['KTP', 'KK', 'Surat Pernyataan Penghasilan'],
      estimasi_pengerjaan: 1,
    },
    {
      nama_layanan: 'Surat Keterangan Ahli Waris',
      deskripsi: 'Menerangkan daftar ahli waris yang sah.',
      persyaratan: ['KTP Ahli Waris', 'Surat Kematian', 'Buku Nikah Ortu', 'KK'],
      estimasi_pengerjaan: 5,
    },
    {
      nama_layanan: 'Surat Keterangan Beda Nama',
      deskripsi: 'Menerangkan bahwa dua nama berbeda adalah orang yang sama.',
      persyaratan: ['KTP', 'KK', 'Dokumen Pembanding (Ijazah/Paspor)'],
      estimasi_pengerjaan: 2,
    },
  ];

  for (const item of jenisSuratData) {
    await prisma.jenisSurat.upsert({
      where: { nama_layanan: item.nama_layanan },
      update: {
        deskripsi: item.deskripsi,
        persyaratan: item.persyaratan,
        estimasi_pengerjaan: item.estimasi_pengerjaan
      },
      create: item,
    });
  }

  console.log('JenisSurat seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

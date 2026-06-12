-- CreateEnum
CREATE TYPE "FormatSurat" AS ENUM ('digital', 'cap_basah');

-- CreateEnum
CREATE TYPE "StatusPermohonan" AS ENUM ('verifikasi', 'penandatanganan', 'siap_diambil', 'siap_didownload', 'selesai', 'ditolak');

-- CreateTable
CREATE TABLE "permohonan_surat" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jenis_surat_id" TEXT NOT NULL,
    "format_surat" "FormatSurat" NOT NULL DEFAULT 'digital',
    "alasan_permohonan" TEXT NOT NULL,
    "status" "StatusPermohonan" NOT NULL DEFAULT 'verifikasi',
    "catatan_admin" TEXT,
    "file_url" TEXT,
    "nomor_surat" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permohonan_surat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "permohonan_surat" ADD CONSTRAINT "permohonan_surat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permohonan_surat" ADD CONSTRAINT "permohonan_surat_jenis_surat_id_fkey" FOREIGN KEY ("jenis_surat_id") REFERENCES "jenis_surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

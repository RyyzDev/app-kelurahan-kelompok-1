-- CreateEnum
CREATE TYPE "Role" AS ENUM ('warga', 'admin', 'petugas');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3),
    "phone" TEXT,
    "alamat" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'warga',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

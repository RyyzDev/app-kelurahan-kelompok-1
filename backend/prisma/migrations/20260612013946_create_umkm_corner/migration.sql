-- CreateEnum
CREATE TYPE "StatusProduk" AS ENUM ('pending', 'disetujui', 'ditolak');

-- CreateTable
CREATE TABLE "toko" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_toko" TEXT NOT NULL,
    "deskripsi" TEXT,
    "alamat_toko" TEXT,
    "phone_toko" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "toko_id" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" DECIMAL(12,2) NOT NULL,
    "kategori" TEXT,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "foto_url" TEXT,
    "status" "StatusProduk" NOT NULL DEFAULT 'pending',
    "catatan_admin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "toko_user_id_key" ON "toko"("user_id");

-- AddForeignKey
ALTER TABLE "toko" ADD CONSTRAINT "toko_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_toko_id_fkey" FOREIGN KEY ("toko_id") REFERENCES "toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

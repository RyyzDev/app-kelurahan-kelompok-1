-- CreateTable
CREATE TABLE "jenis_surat" (
    "id" TEXT NOT NULL,
    "nama_layanan" TEXT NOT NULL,
    "deskripsi" TEXT,
    "persyaratan" TEXT[],
    "estimasi_pengerjaan" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_surat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jenis_surat_nama_layanan_key" ON "jenis_surat"("nama_layanan");

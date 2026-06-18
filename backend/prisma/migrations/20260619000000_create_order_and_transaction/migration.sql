-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('pending', 'berhasil', 'gagal', 'kadaluarsa', 'dibatalkan');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "status_pembayaran" "StatusPembayaran" NOT NULL DEFAULT 'pending',
    "snap_token" TEXT,
    "snap_redirect_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "kuantitas" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `total` on the `Cart` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `CartItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `price` on the `Menu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "total";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "price" SET DATA TYPE INTEGER;

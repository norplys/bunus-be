-- AlterTable
ALTER TABLE "Verify" ALTER COLUMN "expiredAt" DROP NOT NULL,
ALTER COLUMN "verifyToken" DROP NOT NULL;

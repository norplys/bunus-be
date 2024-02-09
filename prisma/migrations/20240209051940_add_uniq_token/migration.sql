/*
  Warnings:

  - A unique constraint covering the columns `[verifyToken]` on the table `Verify` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verify_verifyToken_key" ON "Verify"("verifyToken");

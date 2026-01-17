/*
  Warnings:

  - You are about to drop the column `type` on the `Talent` table. All the data in the column will be lost.
  - Added the required column `talent` to the `Talent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Talent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Talent" DROP COLUMN "type",
ADD COLUMN     "talent" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Talent_userId_idx" ON "Talent"("userId");

-- AddForeignKey
ALTER TABLE "Talent" ADD CONSTRAINT "Talent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

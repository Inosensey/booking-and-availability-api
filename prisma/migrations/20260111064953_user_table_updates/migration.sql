/*
  Warnings:

  - You are about to drop the column `typeId` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_typeId_fkey";

-- DropIndex
DROP INDEX "User_typeId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "typeId",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

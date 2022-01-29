/*
  Warnings:

  - Added the required column `iv` to the `Password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restorationKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "iv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restorationKey" TEXT NOT NULL;

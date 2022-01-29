/*
  Warnings:

  - Changed the type of `iv` on the `Password` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "iv",
ADD COLUMN     "iv" BYTEA NOT NULL;

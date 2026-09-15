/*
  Warnings:

  - The values [VERIFY_PHONE] on the enum `Purpose` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `channel` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `recipient` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifiedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerifiedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Purpose_new" AS ENUM ('REGISTER', 'LOGIN', 'RESET_PASSWORD', 'CHANGE_PASSWORD', 'VERIFY_EMAIL');
ALTER TABLE "Otp" ALTER COLUMN "purpose" TYPE "Purpose_new" USING ("purpose"::text::"Purpose_new");
ALTER TYPE "Purpose" RENAME TO "Purpose_old";
ALTER TYPE "Purpose_new" RENAME TO "Purpose";
DROP TYPE "public"."Purpose_old";
COMMIT;

-- DropIndex
DROP INDEX "Otp_recipient_key";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "channel",
DROP COLUMN "recipient",
ADD COLUMN     "email" VARCHAR(254) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifiedAt",
DROP COLUMN "phoneVerifiedAt",
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ALTER COLUMN "email" SET NOT NULL;

-- DropEnum
DROP TYPE "OtpChannel";

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

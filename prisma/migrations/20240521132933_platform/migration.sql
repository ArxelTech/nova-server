/*
  Warnings:

  - Changed the type of `platform` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PLATFORM" AS ENUM ('YOUTUBE', 'NETFLIX', 'DISNEY_PLUS', 'HULU', 'PRIME_VIDEO');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "platform",
ADD COLUMN     "platform" "PLATFORM" NOT NULL;

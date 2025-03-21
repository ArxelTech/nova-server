-- CreateEnum
CREATE TYPE "OTP_TYPE" AS ENUM ('VERIFICATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "OTP_CODE" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OTP_TYPE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_CODE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTP_CODE_id_key" ON "OTP_CODE"("id");

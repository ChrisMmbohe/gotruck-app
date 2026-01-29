/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amountMinor` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountMinor` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountMinor` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "amount",
ADD COLUMN     "amountMinor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
ADD COLUMN     "amountMinor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "amountMinor" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CurrencyConversionRate" (
    "id" TEXT NOT NULL,
    "from" "Currency" NOT NULL,
    "to" "Currency" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyConversionRate_pkey" PRIMARY KEY ("id")
);

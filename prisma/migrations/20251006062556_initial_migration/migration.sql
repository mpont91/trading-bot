/*
  Warnings:

  - You are about to drop the column `bearish_conviction` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `bearish_momentum` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `bullish_direction` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `bullish_momentum` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `death_cross` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `favorable_entry_price` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `golden_cross` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `not_overextended` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `strong_trend` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `trend_up` on the `StrategyReport` table. All the data in the column will be lost.
  - You are about to drop the column `trend_weakening` on the `StrategyReport` table. All the data in the column will be lost.
  - Added the required column `conditions` to the `StrategyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `StrategyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StrategyReport" DROP COLUMN "bearish_conviction",
DROP COLUMN "bearish_momentum",
DROP COLUMN "bullish_direction",
DROP COLUMN "bullish_momentum",
DROP COLUMN "death_cross",
DROP COLUMN "favorable_entry_price",
DROP COLUMN "golden_cross",
DROP COLUMN "not_overextended",
DROP COLUMN "strong_trend",
DROP COLUMN "trend_up",
DROP COLUMN "trend_weakening",
ADD COLUMN     "conditions" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

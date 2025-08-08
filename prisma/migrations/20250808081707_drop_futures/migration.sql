/*
  Warnings:

  - You are about to drop the `EquityFutures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderFutures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StrategyFutures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeFutures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrailingFutures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EquityFutures";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrderFutures";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StrategyFutures";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TradeFutures";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrailingFutures";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StrategyFutures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "side" TEXT NOT NULL,
    "sl" DECIMAL,
    "tp" DECIMAL,
    "leverage" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
ALTER TABLE "Strategy" RENAME TO "StrategySpot";
ALTER TABLE "StrategySpot" DROP COLUMN "leverage";

-- RedefineIndex
DROP INDEX "Strategy_side_idx";
CREATE INDEX "StrategySpot_side_idx" ON "StrategySpot"("side");

-- RedefineIndex
DROP INDEX "Strategy_symbol_idx";
CREATE INDEX "StrategySpot_symbol_idx" ON "StrategySpot"("symbol");

-- RedefineIndex
DROP INDEX "Strategy_symbol_side_idx";
CREATE INDEX "StrategySpot_symbol_side_idx" ON "StrategySpot"("symbol", "side");


-- CreateIndex
CREATE INDEX "StrategyFutures_symbol_side_idx" ON "StrategyFutures"("symbol", "side");

-- CreateIndex
CREATE INDEX "StrategyFutures_symbol_idx" ON "StrategyFutures"("symbol");

-- CreateIndex
CREATE INDEX "StrategyFutures_side_idx" ON "StrategyFutures"("side");

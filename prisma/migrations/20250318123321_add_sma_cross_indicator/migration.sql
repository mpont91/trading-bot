-- CreateTable
CREATE TABLE "IndicatorSMACross" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period_long" INTEGER NOT NULL,
    "period_short" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "sma_long" DECIMAL NOT NULL,
    "sma_short" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

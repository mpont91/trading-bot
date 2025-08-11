-- CreateTable
CREATE TABLE "Equity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CommissionEquity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "fees" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "entry_order_id" TEXT NOT NULL,
    "entry_price" DECIMAL NOT NULL,
    "entry_at" DATETIME NOT NULL,
    "exit_order_id" TEXT NOT NULL,
    "exit_price" DECIMAL NOT NULL,
    "exit_at" DATETIME NOT NULL,
    "fees" DECIMAL NOT NULL,
    "pnl" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "IndicatorSMA" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "sma" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IndicatorRSI" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "rsi" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IndicatorATR" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "atr" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IndicatorADX" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "adx" DECIMAL NOT NULL,
    "pdi" DECIMAL NOT NULL,
    "mdi" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IndicatorBB" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "upper" DECIMAL NOT NULL,
    "middle" DECIMAL NOT NULL,
    "lower" DECIMAL NOT NULL,
    "pb" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

-- CreateTable
CREATE TABLE "Strategy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "side" TEXT NOT NULL,
    "sl" DECIMAL,
    "tp" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Trailing" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "side" TEXT NOT NULL,
    "tp" DECIMAL,
    "sl" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Order_symbol_side_idx" ON "Order"("symbol", "side");

-- CreateIndex
CREATE INDEX "Order_symbol_idx" ON "Order"("symbol");

-- CreateIndex
CREATE INDEX "Order_side_idx" ON "Order"("side");

-- CreateIndex
CREATE INDEX "Trade_symbol_side_idx" ON "Trade"("symbol", "side");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "Trade_side_idx" ON "Trade"("side");

-- CreateIndex
CREATE INDEX "Strategy_symbol_side_idx" ON "Strategy"("symbol", "side");

-- CreateIndex
CREATE INDEX "Strategy_symbol_idx" ON "Strategy"("symbol");

-- CreateIndex
CREATE INDEX "Strategy_side_idx" ON "Strategy"("side");

-- CreateIndex
CREATE INDEX "Trailing_side_idx" ON "Trailing"("side");

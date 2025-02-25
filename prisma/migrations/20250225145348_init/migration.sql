-- CreateTable
CREATE TABLE "EquitySpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EquityFutures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CommissionEquitySpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OrderSpot" (
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
CREATE TABLE "OrderFutures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "contract_size" DECIMAL NOT NULL,
    "leverage" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "amount_leveraged" DECIMAL NOT NULL,
    "fees" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TradeSpot" (
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
CREATE TABLE "TradeFutures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "contract_size" DECIMAL NOT NULL,
    "leverage" INTEGER NOT NULL,
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
CREATE TABLE "Strategy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "side" TEXT NOT NULL,
    "sl" DECIMAL,
    "tp" DECIMAL,
    "leverage" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TrailingSpot" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "side" TEXT NOT NULL,
    "tp" DECIMAL,
    "sl" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TrailingFutures" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "side" TEXT NOT NULL,
    "tp" DECIMAL,
    "sl" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "OrderSpot_symbol_side_idx" ON "OrderSpot"("symbol", "side");

-- CreateIndex
CREATE INDEX "OrderSpot_symbol_idx" ON "OrderSpot"("symbol");

-- CreateIndex
CREATE INDEX "OrderSpot_side_idx" ON "OrderSpot"("side");

-- CreateIndex
CREATE INDEX "OrderFutures_symbol_side_idx" ON "OrderFutures"("symbol", "side");

-- CreateIndex
CREATE INDEX "OrderFutures_symbol_idx" ON "OrderFutures"("symbol");

-- CreateIndex
CREATE INDEX "OrderFutures_side_idx" ON "OrderFutures"("side");

-- CreateIndex
CREATE INDEX "TradeSpot_symbol_side_idx" ON "TradeSpot"("symbol", "side");

-- CreateIndex
CREATE INDEX "TradeSpot_symbol_idx" ON "TradeSpot"("symbol");

-- CreateIndex
CREATE INDEX "TradeSpot_side_idx" ON "TradeSpot"("side");

-- CreateIndex
CREATE INDEX "TradeFutures_symbol_side_idx" ON "TradeFutures"("symbol", "side");

-- CreateIndex
CREATE INDEX "TradeFutures_symbol_idx" ON "TradeFutures"("symbol");

-- CreateIndex
CREATE INDEX "TradeFutures_side_idx" ON "TradeFutures"("side");

-- CreateIndex
CREATE INDEX "Strategy_symbol_side_idx" ON "Strategy"("symbol", "side");

-- CreateIndex
CREATE INDEX "Strategy_symbol_idx" ON "Strategy"("symbol");

-- CreateIndex
CREATE INDEX "Strategy_side_idx" ON "Strategy"("side");

-- CreateIndex
CREATE INDEX "TrailingSpot_side_idx" ON "TrailingSpot"("side");

-- CreateIndex
CREATE INDEX "TrailingFutures_side_idx" ON "TrailingFutures"("side");

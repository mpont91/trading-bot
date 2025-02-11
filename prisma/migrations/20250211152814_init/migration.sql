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
CREATE TABLE "Indicator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "value" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
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
CREATE INDEX "Indicator_symbol_name_period_idx" ON "Indicator"("symbol", "name", "period");

-- CreateIndex
CREATE INDEX "Indicator_symbol_idx" ON "Indicator"("symbol");

-- CreateIndex
CREATE INDEX "Indicator_name_idx" ON "Indicator"("name");

-- CreateIndex
CREATE INDEX "Indicator_period_idx" ON "Indicator"("period");

-- CreateIndex
CREATE INDEX "Strategy_symbol_side_idx" ON "Strategy"("symbol", "side");

-- CreateIndex
CREATE INDEX "Strategy_symbol_idx" ON "Strategy"("symbol");

-- CreateIndex
CREATE INDEX "Strategy_side_idx" ON "Strategy"("side");

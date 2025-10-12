-- CreateEnum
CREATE TYPE "Side" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "Signal" AS ENUM ('BUY', 'SELL', 'HOLD');

-- CreateTable
CREATE TABLE "Equity" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionEquity" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionEquity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "fees" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "entry_order_id" INTEGER NOT NULL,
    "entry_price" DECIMAL(65,30) NOT NULL,
    "entry_at" TIMESTAMP(3) NOT NULL,
    "exit_order_id" INTEGER NOT NULL,
    "exit_price" DECIMAL(65,30) NOT NULL,
    "exit_at" TIMESTAMP(3) NOT NULL,
    "fees" DECIMAL(65,30) NOT NULL,
    "pnl" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "symbol" TEXT NOT NULL,
    "entry_order_id" INTEGER NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "entry_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Trailing" (
    "symbol" TEXT NOT NULL,
    "tp" DECIMAL(65,30) NOT NULL,
    "sl" DECIMAL(65,30) NOT NULL,
    "ts" DECIMAL(65,30) NOT NULL,
    "tp_price" DECIMAL(65,30) NOT NULL,
    "sl_price" DECIMAL(65,30) NOT NULL,
    "ts_price" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trailing_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "StrategyAction" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "signal" "Signal" NOT NULL,
    "sl" DECIMAL(65,30),
    "tp" DECIMAL(65,30),
    "ts" DECIMAL(65,30),
    "tp_price" DECIMAL(65,30),
    "sl_price" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyReport" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "conditions" JSONB NOT NULL,
    "sl" DECIMAL(65,30),
    "tp" DECIMAL(65,30),
    "ts" DECIMAL(65,30),
    "tp_price" DECIMAL(65,30),
    "sl_price" DECIMAL(65,30),
    "should_buy" BOOLEAN NOT NULL,
    "should_sell" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_symbol_side_idx" ON "Order"("symbol", "side");

-- CreateIndex
CREATE INDEX "Order_symbol_idx" ON "Order"("symbol");

-- CreateIndex
CREATE INDEX "Order_side_idx" ON "Order"("side");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "StrategyAction_symbol_signal_idx" ON "StrategyAction"("symbol", "signal");

-- CreateIndex
CREATE INDEX "StrategyAction_symbol_idx" ON "StrategyAction"("symbol");

-- CreateIndex
CREATE INDEX "StrategyAction_signal_idx" ON "StrategyAction"("signal");

-- CreateIndex
CREATE INDEX "StrategyReport_symbol_idx" ON "StrategyReport"("symbol");

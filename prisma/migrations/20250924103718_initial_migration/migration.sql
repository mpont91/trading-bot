-- CreateEnum
CREATE TYPE "public"."Side" AS ENUM ('long', 'short');

-- CreateEnum
CREATE TYPE "public"."Signal" AS ENUM ('buy', 'sell', 'hold');

-- CreateTable
CREATE TABLE "public"."Equity" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommissionEquity" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionEquity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "public"."Side" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "fees" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trade" (
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
CREATE TABLE "public"."IndicatorSMA" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "sma" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorSMA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndicatorRSI" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "rsi" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorRSI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndicatorATR" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "atr" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorATR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndicatorADX" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "adx" DECIMAL(65,30) NOT NULL,
    "pdi" DECIMAL(65,30) NOT NULL,
    "mdi" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorADX_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndicatorBB" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "upper" DECIMAL(65,30) NOT NULL,
    "middle" DECIMAL(65,30) NOT NULL,
    "lower" DECIMAL(65,30) NOT NULL,
    "pb" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorBB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndicatorSMACross" (
    "id" SERIAL NOT NULL,
    "period_long" INTEGER NOT NULL,
    "period_short" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "sma_long" DECIMAL(65,30) NOT NULL,
    "sma_short" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorSMACross_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Strategy" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "signal" "public"."Signal" NOT NULL,
    "sl" DECIMAL(65,30),
    "tp" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Position" (
    "symbol" TEXT NOT NULL,
    "entry_order_id" INTEGER NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "entry_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "public"."Trailing" (
    "symbol" TEXT NOT NULL,
    "tp" DECIMAL(65,30) NOT NULL,
    "sl" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trailing_pkey" PRIMARY KEY ("symbol")
);

-- CreateIndex
CREATE INDEX "Order_symbol_side_idx" ON "public"."Order"("symbol", "side");

-- CreateIndex
CREATE INDEX "Order_symbol_idx" ON "public"."Order"("symbol");

-- CreateIndex
CREATE INDEX "Order_side_idx" ON "public"."Order"("side");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "public"."Trade"("symbol");

-- CreateIndex
CREATE INDEX "Strategy_symbol_signal_idx" ON "public"."Strategy"("symbol", "signal");

-- CreateIndex
CREATE INDEX "Strategy_symbol_idx" ON "public"."Strategy"("symbol");

-- CreateIndex
CREATE INDEX "Strategy_signal_idx" ON "public"."Strategy"("signal");

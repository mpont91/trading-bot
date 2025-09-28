-- CreateTable
CREATE TABLE "public"."Risk" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "trend_up" BOOLEAN NOT NULL,
    "golden_cross" BOOLEAN NOT NULL,
    "strong_trend" BOOLEAN NOT NULL,
    "bullish_direction" BOOLEAN NOT NULL,
    "bullish_momentum" BOOLEAN NOT NULL,
    "not_overextended" BOOLEAN NOT NULL,
    "death_cross" BOOLEAN NOT NULL,
    "bearish_momentum" BOOLEAN NOT NULL,
    "trend_weakening" BOOLEAN NOT NULL,
    "valid_stops" BOOLEAN,
    "risk_reward" BOOLEAN,
    "sl" DECIMAL(65,30),
    "tp" DECIMAL(65,30),
    "ts" DECIMAL(65,30),
    "tp_price" DECIMAL(65,30),
    "sl_price" DECIMAL(65,30),
    "should_buy" BOOLEAN NOT NULL,
    "should_sell" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

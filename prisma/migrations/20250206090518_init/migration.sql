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
    "leverage" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
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

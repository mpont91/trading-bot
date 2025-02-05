-- CreateTable
CREATE TABLE "SpotEquity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpotCommissionEquity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpotOrder" (
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
CREATE TABLE "SpotTrade" (
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
CREATE TABLE "FuturesEquity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FuturesOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "leverage" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "fees" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FuturesTrade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "leverage" DECIMAL NOT NULL,
    "entry_order_id" TEXT NOT NULL,
    "entry_price" DECIMAL NOT NULL,
    "entry_at" DATETIME NOT NULL,
    "exit_order_id" TEXT NOT NULL,
    "exit_price" DECIMAL NOT NULL,
    "exit_at" DATETIME NOT NULL,
    "fees" DECIMAL NOT NULL,
    "pnl" DECIMAL NOT NULL
);

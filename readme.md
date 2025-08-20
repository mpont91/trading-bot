# Trading Bot

## Overview

This project is a fully automated trading bot that follows a hexagonal architecture. It is
designed to trade cryptocurrency pairs on Binance with a Swing Trading strategy on spot mode.
The bot continuously monitors the market and executes buy/sell orders based on predefined
strategies.

## Codebase structure

The codebase is organized into three main layers: Infrastructure, Application, and Domain.
Each layer has a specific role in the architecture, ensuring a clean separation of
concerns and promoting maintainability.

### Infrastructure layer

The Infrastructure layer is responsible for managing external dependencies and providing
concrete implementations for the interfaces defined in the Application layer. Each
component in this layer has a minimal and well-defined set of responsibilities, ensuring a
clean and maintainable architecture.

### Application layer

The Application layer acts as the entry point of the trading bot. It is responsible for
initializing and orchestrating the interaction between the Domain and Infrastructure
layers. The core of the Application layer is the launcher.ts file, which sets up the necessary
parts and manages the overall flow of the application.

### Domain layer

The Domain layer encapsulates the core business logic and rules of the trading bot. It is
the heart of the application, where all trading strategies, position management, and
market analysis are implemented. This layer operates independently of the Infrastructure
layer and interacts with it through defined interfaces. It is responsible for making
decisions based on business rules, without a concern for the specifics of external systems.

## Key concepts

### Strategy

A short-term trading strategy that aims to make small profits on minor price changes.
The goal is to make around 2–3% profit/loss foreach position.
More than that would be long-term, and less than that makes it impossible to profit
because of the commissions.
Instead of immediately closing the position when it reaches the Take-Profit (TP) level,
a trader might decide to let the winner run. This means they keep the trade open to see
if the price continues to move in their favor beyond the initial target.

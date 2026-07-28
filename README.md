# Nebula ERP

Nebula ERP is a modular, self-hosted ERP platform designed for businesses to manage operations including inventory, CRM, accounting, sales, and future business workflows.

## Project Vision

Nebula ERP is built around a flexible foundation for evolving business operations, with a focus on:

- Modular architecture
- Enterprise scalability
- Flexible business rules
- Automation
- Data-driven operations

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Architecture

- Turborepo
- pnpm workspace

## Current Modules

### CRM

**Status:** Foundation completed

### Accounting

**Status:** Foundation completed

### Inventory

**Status:** Active development

- Product Master
- Warehouse Management
- Stock Movement Engine
- Stock Ledger
- Unit Management
- Custom Unit Conversion
- Chained Unit Conversion

## Inventory Architecture

```text
Product Master
        |
        v
Stock Movement
        |
        v
Stock Ledger
        |
        v
Inventory Intelligence
```

Inventory transactions are designed to support:

- Purchase receiving
- Sales deduction
- POS transactions
- Transfers
- Adjustments

## Development Setup

Install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

## Repository Structure

```text
apps/web    Frontend application
packages    Shared workspace packages
```

## Development Philosophy

Nebula ERP aims to provide ERP functionality with flexible architecture instead of fixed business rules. The platform is designed to let business processes and future workflows evolve without requiring a rigid, one-size-fits-all model.

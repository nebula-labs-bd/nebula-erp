# ERP Module Integration Layer

This directory contains the **integration contracts** that connect ERP modules
through shared core entities.

## Architecture Rules

### 1. Core owns shared entities
- `src/core/entities/` defines all shared entities (Contact, Product, User, etc.)
- Modules reference core entities by ID — never duplicate them

### 2. Modules own their business logic
- CRM owns customer lifecycle
- Inventory owns stock movements
- Sales owns order-to-cash flow
- Service Desk owns service requests
- Finance owns accounting
- **Integrations do not contain business logic**

### 3. Integrations connect modules
- Provide **read-only access** to other modules' data
- Define **lightweight reference shapes** for cross-module linking
- Coordinate **cross-module workflows** without owning them

### 4. No module imports another module's internal files
```typescript
// ❌ BAD - POS importing Sales internal service
import { createSalesOrder } from "../../sales/services/sales.service";

// ✅ GOOD - POS using integration contract
import { mapPOSTransactionToSales } from "integrations/sales";
```

### 5. Future backend services replace integration implementations
- Current implementation uses `apiClient` directly
- When backend microservices exist, swap the implementation
- Module consumers remain unchanged (same imports from `integrations`)

## Directory Structure

```
integrations/
├── customer/          # Customer registry & mappers
│   ├── customer.registry.ts    # Single customer access point
│   └── customer.mapper.ts      # Module-specific customer shapes
├── product/           # Product registry & mappers
│   ├── product.registry.ts     # Single product access point
│   └── product.mapper.ts       # Module-specific product shapes
├── sales/             # Sales integration (POS → Sales → Payment → Delivery)
│   └── sales.integration.ts
├── inventory/         # Inventory integration (stock availability)
│   └── inventory.integration.ts
├── service/           # Service Desk integration (Service → CRM/Inventory/Sales)
│   └── service.integration.ts
├── finance/           # Finance integration (payment/doc references)
│   └── finance.integration.ts
└── index.ts           # Barrel export
```

## Usage

```typescript
// Any module imports from integrations
import { 
  CustomerRegistry, 
  ProductRegistry, 
  SalesIntegration,
  InventoryIntegration,
  ServiceIntegration,
  FinanceIntegration 
} from "integrations";

// Or specific sub-paths
import { getCustomer, searchCustomers } from "integrations/customer";
import { getProduct, searchProducts } from "integrations/product";
import { getStockAvailability } from "integrations/inventory";
```

## Integration Patterns

### Registry Pattern (Customer, Product)
- Single access point for entity data
- `getX(id)` — fetch by ID
- `searchX(query)` — search for selectors
- `createXReference(entity)` — lightweight cross-module reference
- `mapXToModule(entity)` — module-specific shape

### Integration Pattern (Sales, Inventory, Service, Finance)
- Cross-module workflow coordination
- Read-only data access
- Reference creation for linking
- No business logic mutations

## Adding New Integrations

1. Create subdirectory under `integrations/`
2. Export registry/integration functions
3. Add to `integrations/index.ts`
4. Document in this README
5. Update dependent modules to use integration imports

## Validation

Run TypeScript build to verify no cross-module internal imports:
```bash
pnpm --filter web exec tsc -b --force
pnpm --filter web build
```
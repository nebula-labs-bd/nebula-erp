# Nebula ERP — Core (`core`)

Central place for shared, enterprise-wide frontend contracts. **No backend.
No database. No API calls.** This module only formalises the entities that
every feature module agrees to use so the application behaves as one
connected ERP rather than isolated silos.

## The ERP relationship

```
Company
  └── Users (User + Employee)
        └── Contacts (Customer / Vendor / Business)
              └── Products
                    └── Documents (Sales / Purchase / Service)
                          └── Finance (ledger, payments)
```

- A **Customer** created in POS / Sales / Service Desk / CRM is the **same**
  `Contact` record (type `customer`). No module owns a private copy.
- A **Product** created in Inventory is the same record consumed by POS,
  Sales, Purchase and Service Parts.
- A **Document** (sales order, purchase, service ticket) descends from a
  shared `BaseDocument` so workflows, search and accounting see one shape.
- **Stock** is always a `(productId, warehouseId)` pair shared by every
  module that moves goods.

## Structure

```
core/
├── entities/        # Company, User, Employee, Contact, Product,
│                    #   Inventory, Document
├── types/           # Cross-module references (POS → Sales → Payment)
├── constants/       # Centralised enums (RecordStatus, DocumentStatus)
├── utils/           # (future) shared helpers / mappers
├── index.ts         # Single public entry point
└── README.md
```

Import everything through the barrel — the `core` path alias resolves to
`src/core/index.ts`:

```ts
import { Contact, DocumentStatus, SalesDocument } from "core";
```

## Architecture rules

1. **Modules consume core entities.** Feature code imports shared shapes from
   `core`, never redefines them.
2. **Modules do not duplicate shared data.** Reference a `Contact`/`Product`/
   `Employee`/`Company` by id; denormalise only a display label when needed.
3. **Backend will later replace mock services.** The type shapes already
   mirror the planned API contract, so swapping in real data is a drop-in
   change.
4. **Database schema will follow these contracts.** The interfaces here are
   the intended source of truth for future persistence modelling.

## Notes

- `RecordStatus` (`active | inactive | archived`) and `DocumentStatus`
  (`draft | pending | confirmed | completed | cancelled`) are the single
  canonical enums for all modules — do not introduce parallel literals.
- The `core/types/references.types.ts` interfaces (`POSTransactionReference`,
  `SalesOrderReference`, `PaymentReference`) describe how documents chain
  together without any module importing another's full shape.

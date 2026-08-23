/**
 * `core` — Nebula ERP shared frontend contracts.
 *
 * Single entry point for every cross-module entity, constant and
 * reference type. Future modules MUST import from here, never from
 * another feature module, so shared data (company, contacts, products,
 * documents) is never duplicated.
 *
 *   import { Contact, DocumentStatus } from "core";
 */

/* Entities */
export * from "./entities/company.types";
export * from "./entities/user.types";
export * from "./entities/contact.types";
export * from "./entities/product.types";
export * from "./entities/inventory.types";
export * from "./entities/document.types";

/* Constants */
export * from "./constants/status";

/* Cross-module references */
export * from "./types/references.types";

/* Shared event types */
export * from "./types/events.types";

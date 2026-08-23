/**
 * Service Desk Integration — connects Service Desk with CRM, Inventory, and Sales.
 *
 * Provides contracts for cross-module service workflows:
 * - Service Request → Customer (CRM)
 * - Service Request → Required Parts (Inventory check)
 * - Service Request → Sales/Invoice (later)
 * - Service Desk never creates customers or products — only references them
 */

import { apiClient } from "../../api/client";
import type { ProductReference } from "../product/product.registry";
import type { ContactReference } from "../customer/customer.registry";
import type { StockAvailability } from "../inventory/inventory.integration";

/** Lightweight service request reference for cross-module linking. */
export interface ServiceRequestReference {
  serviceRequestId: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  status: "new" | "assigned" | "scheduled" | "in_progress" | "waiting_customer" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  createdDate: string;
  assignedEmployeeId?: string;
}

/** Part request from service to inventory. */
export interface ServicePartRequest {
  serviceRequestId: string;
  productId: string;
  quantity: number;
  warehouseId: string;
  status: "requested" | "allocated" | "picked" | "delivered" | "cancelled";
  requestedDate: string;
  note?: string;
}

/** Service document reference for cross-module linking. */
export interface ServiceDocumentReference {
  documentId: string;
  documentNumber: string;
  serviceRequestId: string;
  type: "service-report" | "work-order" | "invoice";
  status: "draft" | "pending" | "confirmed" | "completed" | "cancelled";
  total?: number;
  date: string;
}

/**
 * Create a service contact reference from the shared Contact registry.
 * Used by Service Desk to link a service request to a contact.
 */
export interface ServiceContactReference {
  contactId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function createServiceContactReference(
  contact: ContactReference
): ServiceContactReference {
  return {
    contactId: contact.contactId,
    name: contact.name,
  };
}

/**
 * Request inventory parts for a service request.
 * Checks availability and creates a part request.
 * Inventory remains the owner of stock logic.
 */
export async function requestInventoryPart(
  serviceRequestId: string,
  productId: string,
  quantity: number,
  warehouseId: string,
  note?: string
): Promise<{
  success: boolean;
  partRequest?: ServicePartRequest;
  availability?: StockAvailability;
  error?: string;
}> {
  // Check availability first
  const availabilityResponse = await apiClient.get<StockAvailability>(
    `/inventory/stock/${productId}/${warehouseId}`
  );

  const availability = availabilityResponse.data;

  if (!availability || availability.available < quantity) {
    return {
      success: false,
      availability: availability ?? undefined,
      error: `Insufficient stock. Available: ${availability?.available ?? 0}, Requested: ${quantity}`,
    };
  }

  // Create part request (this would call a service desk API endpoint)
  const partRequest: ServicePartRequest = {
    serviceRequestId,
    productId,
    quantity,
    warehouseId,
    status: "requested",
    requestedDate: new Date().toISOString(),
    note,
  };

  return {
    success: true,
    partRequest,
    availability,
  };
}

/**
 * Create a lightweight service document reference for cross-module linking.
 * Used by Sales (invoice creation), Finance (journal), Reports.
 */
export function createServiceDocumentReference(
  documentId: string,
  documentNumber: string,
  serviceRequestId: string,
  type: ServiceDocumentReference["type"],
  status: ServiceDocumentReference["status"],
  date: string,
  total?: number
): ServiceDocumentReference {
  return {
    documentId,
    documentNumber,
    serviceRequestId,
    type,
    status,
    total,
    date,
  };
}

/**
 * Get service request reference by ID.
 * Used by CRM (customer view), Sales (invoice from service), Finance.
 */
export async function getServiceRequestReference(
  serviceRequestId: string
): Promise<ServiceRequestReference | null> {
  const response = await apiClient.get<ServiceRequestReference>(
    `/service-desk/requests/${serviceRequestId}`
  );
  return response.data ?? null;
}

/**
 * Flow: Service Request → Customer → Required Parts → Inventory Check → Sales/Invoice
 * 
 * This function coordinates the cross-module flow for a service request.
 * It's a convenience function that wires together the integration points.
 */
export interface ServiceFlowContext {
  serviceRequest: ServiceRequestReference;
  contact: ServiceContactReference;
  parts: Array<{
    product: ProductReference;
    quantity: number;
    warehouseId: string;
    availability: StockAvailability;
  }>;
  canProceedToSales: boolean;
}

export async function buildServiceFlowContext(
  serviceRequestId: string
): Promise<ServiceFlowContext | null> {
  const serviceRequest = await getServiceRequestReference(serviceRequestId);
  if (!serviceRequest) return null;

  // In a real implementation, this would fetch the service request details
  // including associated parts and contact
  // For now, we return the minimal context structure
  return {
    serviceRequest,
    contact: {
      contactId: serviceRequest.customerId,
      name: serviceRequest.customerName,
    },
    parts: [],
    canProceedToSales: serviceRequest.status === "completed",
  };
}
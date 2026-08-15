import type {
  AllocationDocumentType,
  OutstandingDocument,
} from "../types/payment.types";

export interface FifoAllocationResult {
  documentId: string;
  documentType: AllocationDocumentType;
  documentNumber: string;
  allocatedAmount: number;
}

/**
 * FIFO automatic allocation engine.
 *
 * Given a payment amount and a list of outstanding documents, allocate the
 * payment against the OLDEST documents first (sorted by date, then by
 * document number).
 *
 * Rules enforced:
 *   - Oldest documents first (ascending date).
 *   - Never allocate more than the remaining payment amount.
 *   - Never allocate more than a document's outstanding due balance.
 */
export function allocatePaymentFIFO(
  paymentAmount: number,
  documents: OutstandingDocument[],
): FifoAllocationResult[] {
  const ordered = [...documents]
    .filter((doc) => doc.due > 0)
    .sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.documentNumber.localeCompare(b.documentNumber);
    });

  let remaining = paymentAmount;
  const allocations: FifoAllocationResult[] = [];

  for (const doc of ordered) {
    if (remaining <= 0) break;

    const allocated = Math.min(doc.due, remaining);

    if (allocated > 0) {
      allocations.push({
        documentId: doc.documentId,
        documentType: doc.documentType,
        documentNumber: doc.documentNumber,
        allocatedAmount: allocated,
      });

      remaining -= allocated;
    }
  }

  return allocations;
}
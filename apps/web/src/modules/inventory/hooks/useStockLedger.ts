import {
  useQuery,
} from "@tanstack/react-query";

import {
  getStockLedger,
} from "../services/inventory.service";


export function useStockLedger() {
  return useQuery({
    queryKey: [
      "inventory",
      "ledger",
    ],

    queryFn: getStockLedger,
  });
}
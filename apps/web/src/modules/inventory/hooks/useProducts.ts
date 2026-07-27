import {
  useQuery,
} from "@tanstack/react-query";

import {
  productsQuery,
} from "../queries/inventory.queries";


export function useProducts() {

  return useQuery({

    ...productsQuery,

    select:
      (response) =>
        response.data,

  });

}
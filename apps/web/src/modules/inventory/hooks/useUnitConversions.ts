import {
  useQuery,
} from "@tanstack/react-query";

import {
  getUnitConversions,
} from "../services/inventory.service";


export function useUnitConversions() {

  return useQuery({

    queryKey: [
      "inventory",
      "unit-conversions",
    ],

    queryFn:
      async () => {

        const response =
          await getUnitConversions();

        return response.data;

      },

  });

}
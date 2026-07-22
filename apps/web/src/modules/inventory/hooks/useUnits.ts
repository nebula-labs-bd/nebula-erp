import {
  useQuery,
} from "@tanstack/react-query";

import {
  getUnits,
} from "../services/inventory.service";

import {
  unitKeys,
} from "../queries/unit.keys";


export function useUnits() {

  return useQuery({

    queryKey:
      unitKeys.lists(),

    queryFn:
      async () => {

        const response =
          await getUnits();

        return response.data;

      },

  });

}
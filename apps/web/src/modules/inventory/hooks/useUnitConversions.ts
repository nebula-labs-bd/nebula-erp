import {
  useQuery,
} from "@tanstack/react-query";

import {
  getUnitConversions,
} from "../services/inventory.service";

import {
  unitConversionKeys,
} from "../queries/unitConversion.keys";


export function useUnitConversions() {

  return useQuery({

    queryKey:
      unitConversionKeys.lists(),

    queryFn:
      getUnitConversions,

  });

}
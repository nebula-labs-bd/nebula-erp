import type {
  UnitConversion,
} from "../types/unit.types";



export function findConversion(
  conversions: UnitConversion[],
  fromUnitId: string,
  toUnitId: string,
) {

  return conversions.find(
    (conversion) =>
      conversion.fromUnitId === fromUnitId &&
      conversion.toUnitId === toUnitId,
  );

}



export function convertQuantity(
  quantity: number,
  conversion: UnitConversion,
) {

  return quantity * conversion.multiplier;

}



export function convertFromBaseUnit(
  quantity: number,
  conversion: UnitConversion,
) {

  return quantity / conversion.multiplier;

}



/**
 * Recursive conversion support
 *
 * Example:
 *
 * Carton → Box → Piece
 *
 */
export function convertBetweenUnits(
  quantity: number,
  fromUnitId: string,
  toUnitId: string,
  conversions: UnitConversion[],
): number | null {


  if (fromUnitId === toUnitId) {
    return quantity;
  }


  const direct =
    findConversion(
      conversions,
      fromUnitId,
      toUnitId,
    );


  if (direct) {

    return (
      quantity *
      direct.multiplier
    );

  }



  const next =
    conversions.find(
      (conversion) =>
        conversion.fromUnitId === fromUnitId,
    );



  if (!next) {
    return null;
  }



  const converted =
    convertBetweenUnits(
      quantity *
      next.multiplier,

      next.toUnitId,

      toUnitId,

      conversions,
    );



  return converted;

}
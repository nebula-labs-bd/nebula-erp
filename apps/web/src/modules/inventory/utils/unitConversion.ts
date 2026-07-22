import type {
  UnitConversion,
} from "../types/unit.types";



/**
 * Convert a quantity from one unit to another
 *
 * Example:
 * 5 Rolls → Meter
 *
 * Conversion:
 * 1 Roll = 305 Meter
 *
 * Result:
 * 1525 Meter
 */
export function convertQuantity(
  quantity: number,
  conversion: UnitConversion,
) {

  return quantity * conversion.multiplier;

}



/**
 * Convert base unit quantity back to another unit
 *
 * Example:
 *
 * 610 Meter → Roll
 *
 * 1 Roll = 305 Meter
 *
 * Result:
 * 2 Rolls
 */
export function convertFromBaseUnit(
  quantity: number,
  conversion: UnitConversion,
) {

  return quantity / conversion.multiplier;

}



/**
 * Find conversion rule
 */
export function findConversion(
  conversions: UnitConversion[],
  fromUnitId: string,
  toUnitId: string,
) {

  return conversions.find(

    conversion =>

      conversion.fromUnitId === fromUnitId &&

      conversion.toUnitId === toUnitId,

  );

}
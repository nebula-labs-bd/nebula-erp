export type UnitStatus =
  | "active"
  | "inactive";


export interface UnitConversion {
  id: string;

  fromUnitId: string;

  toUnitId: string;

  multiplier: number;
}


export interface Unit {
  id: string;

  name: string;

  shortName: string;

  status: UnitStatus;


  // Base unit example:
  // Meter

  isBaseUnit: boolean;


  // Conversion rules

  conversions: UnitConversion[];


  createdAt: string;

  updatedAt: string;
}



export interface CreateUnitInput {

  name: string;

  shortName: string;

  isBaseUnit: boolean;


  conversions?: UnitConversion[];
}



export interface UpdateUnitInput
  extends Partial<CreateUnitInput> {

  id: string;

}
export const unitConversionKeys = {

  all: [
    "unit-conversions",
  ] as const,


  lists: () =>
    [
      ...unitConversionKeys.all,
      "list",
    ] as const,

};
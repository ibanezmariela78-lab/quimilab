export type MassUnit = "kg" | "g" | "mg" | "µg";

const gramsByUnit: Record<MassUnit, number> = {
  kg: 1000,
  g: 1,
  mg: 0.001,
  µg: 0.000001,
};

export function massToGrams(value: number, unit: MassUnit): number {
  return value * gramsByUnit[unit];
}

export function gramsToMass(valueGrams: number): {
  grams: number;
  milligrams: number;
  micrograms: number;
} {
  return {
    grams: valueGrams,
    milligrams: valueGrams * 1000,
    micrograms: valueGrams * 1000000,
  };
}

export function formatMass(value: number, unit: MassUnit): string {
  const decimals = unit === "kg" || unit === "g" ? 6 : 3;
  return `${value
    .toFixed(decimals)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",")} ${unit}`;
}

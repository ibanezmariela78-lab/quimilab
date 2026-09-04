export type ConversionResult = {
  value: number;
  calculation: string;
};

export function parsePositiveNumber(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!normalized || !/^\d+(?:\.\d+)?$/u.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function gramsToMoles(
  grams: number,
  molarMass: number,
): ConversionResult {
  const value = grams / molarMass;
  return {
    value,
    calculation: `${formatConversionNumber(grams)} / ${formatConversionNumber(molarMass)} = ${formatConversionNumber(value)}`,
  };
}

export function molesToGrams(
  moles: number,
  molarMass: number,
): ConversionResult {
  const value = moles * molarMass;
  return {
    value,
    calculation: `${formatConversionNumber(moles)} × ${formatConversionNumber(molarMass)} = ${formatConversionNumber(value)}`,
  };
}

function formatConversionNumber(value: number): string {
  return value
    .toFixed(3)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

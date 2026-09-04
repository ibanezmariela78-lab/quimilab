import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation } from "@/chemistry/types";

export type PercentageMode = "m/m" | "m/v" | "v/v";
export type PercentageMassUnit = "g" | "kg";
export type PercentageVolumeUnit = "mL" | "L";

export type PercentageResult = {
  mode: PercentageMode;
  component: string;
  percentage: number;
  finalAmount: number;
  finalUnit: PercentageMassUnit | PercentageVolumeUnit;
  finalAmountBase: number;
  componentAmountBase: number;
  remainingAmountBase?: number;
  molarMass?: MolarMassCalculation;
};

export type PercentageError = { error: string };

export function calculateMassMassPercentage(
  componentInput: string,
  percentageInput: string,
  finalMassInput: string,
  unit: PercentageMassUnit,
): PercentageResult | PercentageError {
  const component = componentInput.trim();
  if (!component) return { error: "Escribí la sustancia o componente." };
  const percentage = parsePercentage(percentageInput);
  if (percentage === null)
    return { error: "Ingresá un porcentaje entre 0 y 100." };
  const finalMass = parsePositiveNumber(finalMassInput);
  if (finalMass === null)
    return { error: "Ingresá una masa final mayor que cero." };
  const finalMassGrams = unit === "kg" ? finalMass * 1000 : finalMass;
  const componentMassGrams = (percentage * finalMassGrams) / 100;

  return {
    mode: "m/m",
    component,
    percentage,
    finalAmount: finalMass,
    finalUnit: unit,
    finalAmountBase: finalMassGrams,
    componentAmountBase: componentMassGrams,
    remainingAmountBase: finalMassGrams - componentMassGrams,
  };
}

export function calculateMassVolumePercentage(
  componentInput: string,
  percentageInput: string,
  finalVolumeInput: string,
  unit: PercentageVolumeUnit,
): PercentageResult | PercentageError {
  const component = componentInput.trim();
  if (!component) return { error: "Escribí la fórmula o sustancia." };
  const percentage = parsePercentage(percentageInput);
  if (percentage === null)
    return { error: "Ingresá un porcentaje entre 0 y 100." };
  const finalVolume = parsePositiveNumber(finalVolumeInput);
  if (finalVolume === null)
    return { error: "Ingresá un volumen final mayor que cero." };
  const finalVolumeMl = unit === "L" ? finalVolume * 1000 : finalVolume;
  const componentMassGrams = (percentage * finalVolumeMl) / 100;
  const molarMass = calculateMolarMass(component);

  return {
    mode: "m/v",
    component,
    percentage,
    finalAmount: finalVolume,
    finalUnit: unit,
    finalAmountBase: finalVolumeMl,
    componentAmountBase: componentMassGrams,
    molarMass: molarMass.error ? undefined : molarMass,
  };
}

export function calculateVolumeVolumePercentage(
  componentInput: string,
  percentageInput: string,
  finalVolumeInput: string,
  unit: PercentageVolumeUnit,
): PercentageResult | PercentageError {
  const component = componentInput.trim();
  if (!component) return { error: "Escribí el nombre del componente líquido." };
  const percentage = parsePercentage(percentageInput);
  if (percentage === null)
    return { error: "Ingresá un porcentaje entre 0 y 100." };
  const finalVolume = parsePositiveNumber(finalVolumeInput);
  if (finalVolume === null)
    return { error: "Ingresá un volumen final mayor que cero." };
  const finalVolumeMl = unit === "L" ? finalVolume * 1000 : finalVolume;

  return {
    mode: "v/v",
    component,
    percentage,
    finalAmount: finalVolume,
    finalUnit: unit,
    finalAmountBase: finalVolumeMl,
    componentAmountBase: (percentage * finalVolumeMl) / 100,
  };
}

function parsePercentage(input: string): number | null {
  const value = parsePositiveNumber(input);
  return value !== null && value <= 100 ? value : null;
}

import { getSpecialSafetyMessage } from "@/chemistry/equivalence";
import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation } from "@/chemistry/types";

export type FormalityVolumeUnit = "mL" | "L";

export type FormalityPreparationResult = {
  formula: string;
  formality: number;
  volume: number;
  volumeUnit: FormalityVolumeUnit;
  volumeLiters: number;
  formulaMoles: number;
  gramsNeeded: number;
  molarMass: MolarMassCalculation;
  safetyWarning?: string;
};

export type FormalityPreparationError = {
  error: string;
  molarMass?: MolarMassCalculation;
};

export function calculateFormalityPreparation(
  formulaInput: string,
  formalityInput: string,
  volumeInput: string,
  volumeUnit: FormalityVolumeUnit,
): FormalityPreparationResult | FormalityPreparationError {
  const formula = formulaInput.trim();
  if (!formula) return { error: "Escribí una fórmula química." };

  const molarMass = calculateMolarMass(formula);
  if (molarMass.error) return { error: molarMass.error, molarMass };
  if (molarMass.warnings.length > 0 || molarMass.molarMass === null) {
    return { error: "No se puede calcular porque falta un peso atómico estándar.", molarMass };
  }

  const formality = parsePositiveNumber(formalityInput);
  if (formality === null) return { error: "Ingresá una formalidad mayor que cero." };
  const volume = parsePositiveNumber(volumeInput);
  if (volume === null) return { error: "Ingresá un volumen final mayor que cero." };

  const volumeLiters = volumeUnit === "mL" ? volume / 1000 : volume;
  const formulaMoles = formality * volumeLiters;
  const gramsNeeded = formulaMoles * molarMass.molarMass;

  return {
    formula,
    formality,
    volume,
    volumeUnit,
    volumeLiters,
    formulaMoles,
    gramsNeeded,
    molarMass,
    safetyWarning: getSpecialSafetyMessage(formula, molarMass.substanceInfo),
  };
}

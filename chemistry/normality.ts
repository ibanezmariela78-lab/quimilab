import { parsePositiveNumber } from "@/chemistry/conversions";
import {
    getAcidBaseEquivalence,
    getSpecialSafetyMessage,
} from "@/chemistry/equivalence";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation } from "@/chemistry/types";

export type NormalityVolumeUnit = "mL" | "L";

export type NormalityPreparationResult = {
  formula: string;
  normality: number;
  volume: number;
  volumeUnit: NormalityVolumeUnit;
  volumeLiters: number;
  molarity: number;
  equivalenceFactor: number;
  equivalentWeight: number;
  gramsNeeded: number;
  molarMass: MolarMassCalculation;
  equivalenceExplanation: string;
  safetyWarning?: string;
};

export type NormalityPreparationError = {
  error: string;
  molarMass?: MolarMassCalculation;
};

export function calculateNormalityPreparation(
  formulaInput: string,
  normalityInput: string,
  volumeInput: string,
  volumeUnit: NormalityVolumeUnit,
): NormalityPreparationResult | NormalityPreparationError {
  const formula = formulaInput.trim();
  if (!formula) return { error: "Escribí una fórmula química." };

  const molarMass = calculateMolarMass(formula);
  if (molarMass.error) return { error: molarMass.error, molarMass };
  if (molarMass.warnings.length > 0 || molarMass.molarMass === null) {
    return {
      error: "No se puede calcular porque falta un peso atómico estándar.",
      molarMass,
    };
  }

  const equivalence = getAcidBaseEquivalence(formula);
  if (!equivalence) {
    return {
      error:
        "QuimiLab necesita conocer la reacción considerada para determinar el número de equivalentes.",
    };
  }

  const normality = parsePositiveNumber(normalityInput);
  if (normality === null)
    return { error: "Ingresá una normalidad mayor que cero." };
  const volume = parsePositiveNumber(volumeInput);
  if (volume === null)
    return { error: "Ingresá un volumen final mayor que cero." };

  const volumeLiters = volumeUnit === "mL" ? volume / 1000 : volume;
  const molarity = normality / equivalence.factor;
  const equivalentWeight = molarMass.molarMass / equivalence.factor;
  const gramsNeeded = normality * volumeLiters * equivalentWeight;

  return {
    formula,
    normality,
    volume,
    volumeUnit,
    volumeLiters,
    molarity,
    equivalenceFactor: equivalence.factor,
    equivalentWeight,
    gramsNeeded,
    molarMass,
    equivalenceExplanation: equivalence.explanation,
    safetyWarning: getSpecialSafetyMessage(formula, molarMass.substanceInfo),
  };
}

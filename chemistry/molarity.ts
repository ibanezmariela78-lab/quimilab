import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation } from "@/chemistry/types";

export type VolumeUnit = "mL" | "L";

export type MolarityPreparationResult = {
  formula: string;
  molarity: number;
  volume: number;
  volumeUnit: VolumeUnit;
  volumeLiters: number;
  molesNeeded: number;
  gramsNeeded: number;
  molarMass: MolarMassCalculation;
  safetyWarning?: string;
};

export type MolarityPreparationError = {
  error: string;
  molarMass?: MolarMassCalculation;
};

export function calculateMolarityPreparation(
  formulaInput: string,
  molarityInput: string,
  volumeInput: string,
  volumeUnit: VolumeUnit,
): MolarityPreparationResult | MolarityPreparationError {
  const formula = formulaInput.trim();
  if (!formula) {
    return { error: "Escribí una fórmula química." };
  }

  const molarMass = calculateMolarMass(formula);
  if (molarMass.error) {
    return { error: molarMass.error, molarMass };
  }
  if (molarMass.warnings.length > 0 || molarMass.molarMass === null) {
    return {
      error:
        "No se puede calcular la preparación porque falta un peso atómico estándar.",
      molarMass,
    };
  }

  const molarity = parsePositiveNumber(molarityInput);
  if (molarity === null) {
    return { error: "Ingresá una molaridad mayor que cero." };
  }

  const volume = parsePositiveNumber(volumeInput);
  if (volume === null) {
    return { error: "Ingresá un volumen mayor que cero." };
  }

  const volumeLiters = volumeUnit === "mL" ? volume / 1000 : volume;
  const molesNeeded = molarity * volumeLiters;
  const gramsNeeded = molesNeeded * molarMass.molarMass;

  return {
    formula,
    molarity,
    volume,
    volumeUnit,
    volumeLiters,
    molesNeeded,
    gramsNeeded,
    molarMass,
    safetyWarning:
      formula.replace(/\s+/gu, "") === "H2SO4"
        ? "Este resultado supone H2SO4 puro. En el laboratorio suele utilizarse una solución concentrada; no uses este procedimiento genérico para manipularla."
        : undefined,
  };
}

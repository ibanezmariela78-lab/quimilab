import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation } from "@/chemistry/types";

export type SolventMassUnit = "g" | "kg";

export type MolalityPreparationResult = {
  formula: string;
  molality: number;
  solventMass: number;
  solventMassUnit: SolventMassUnit;
  solventMassKg: number;
  molesNeeded: number;
  gramsNeeded: number;
  molarMass: MolarMassCalculation;
};

export type MolalityPreparationError = {
  error: string;
  molarMass?: MolarMassCalculation;
};

export function calculateMolalityPreparation(
  formulaInput: string,
  molalityInput: string,
  solventMassInput: string,
  solventMassUnit: SolventMassUnit,
): MolalityPreparationResult | MolalityPreparationError {
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
      error: "No se puede calcular porque falta un peso atómico estándar.",
      molarMass,
    };
  }

  const molality = parsePositiveNumber(molalityInput);
  if (molality === null) {
    return { error: "Ingresá una molalidad mayor que cero." };
  }

  const solventMass = parsePositiveNumber(solventMassInput);
  if (solventMass === null) {
    return { error: "Ingresá una masa de solvente mayor que cero." };
  }

  const solventMassKg =
    solventMassUnit === "g" ? solventMass / 1000 : solventMass;
  const molesNeeded = molality * solventMassKg;
  const gramsNeeded = molesNeeded * molarMass.molarMass;

  return {
    formula,
    molality,
    solventMass,
    solventMassUnit,
    solventMassKg,
    molesNeeded,
    gramsNeeded,
    molarMass,
  };
}

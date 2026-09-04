import { parsePositiveNumber } from "@/chemistry/conversions";
import { getAcidBaseEquivalence } from "@/chemistry/equivalence";
import { calculateMolarMass } from "@/chemistry/molarMass";
import type { MolarMassCalculation, SubstanceInfo } from "@/chemistry/types";

export type CommercialConcentrationType = "molarity" | "normality";
export type CommercialVolumeUnit = "mL" | "L";

export type CommercialResult = {
  formula: string;
  percentage: number;
  density: number;
  concentrationType: CommercialConcentrationType;
  finalConcentration: number;
  finalVolume: number;
  volumeUnit: CommercialVolumeUnit;
  molarMass: MolarMassCalculation;
  commercialMolarity: number;
  commercialConcentration: number;
  equivalenceFactor?: number;
  finalVolumeLiters: number;
  stockVolumeLiters: number;
  stockVolume: number;
  safetyClassification?: SubstanceInfo["safetyClassification"];
  safetyWarning?: string;
};

export type CommercialError = { error: string };

export function calculateCommercialMolarity(
  formulaInput: string,
  percentageInput: string,
  densityInput: string,
):
  | {
      molarity: number;
      molarMass: MolarMassCalculation;
      percentage: number;
      density: number;
    }
  | CommercialError {
  const formula = formulaInput.trim();
  if (!formula) return { error: "Escribí una fórmula química." };
  const percentage = parsePercentage(percentageInput);
  if (percentage === null)
    return { error: "Ingresá un porcentaje entre 0 y 100." };
  const density = parsePositiveNumber(densityInput);
  if (density === null)
    return { error: "Ingresá una densidad mayor que cero." };
  const molarMass = calculateMolarMass(formula);
  if (molarMass.error || molarMass.molarMass === null)
    return {
      error:
        "La fórmula debe ser válida para calcular la concentración comercial.",
    };
  const molarity = (density * 10 * percentage) / molarMass.molarMass;
  return { molarity, molarMass, percentage, density };
}

export function calculateCommercialDilution(
  formulaInput: string,
  percentageInput: string,
  densityInput: string,
  concentrationType: CommercialConcentrationType,
  finalConcentrationInput: string,
  finalVolumeInput: string,
  volumeUnit: CommercialVolumeUnit,
): CommercialResult | CommercialError {
  const commercial = calculateCommercialMolarity(
    formulaInput,
    percentageInput,
    densityInput,
  );
  if ("error" in commercial) return commercial;
  const finalConcentration = parsePositiveNumber(finalConcentrationInput);
  if (finalConcentration === null)
    return { error: "Ingresá una concentración final mayor que cero." };
  const finalVolume = parsePositiveNumber(finalVolumeInput);
  if (finalVolume === null)
    return { error: "Ingresá un volumen final mayor que cero." };

  let commercialConcentration = commercial.molarity;
  let equivalenceFactor: number | undefined;
  if (concentrationType === "normality") {
    const equivalence = getAcidBaseEquivalence(formulaInput);
    if (!equivalence)
      return {
        error:
          "QuimiLab necesita conocer la reacción considerada para determinar el número de equivalentes.",
      };
    equivalenceFactor = equivalence.factor;
    commercialConcentration *= equivalenceFactor;
  }
  if (finalConcentration >= commercialConcentration) {
    return {
      error:
        "La concentración deseada no puede obtenerse mediante una dilución directa de este reactivo.",
    };
  }

  const finalVolumeLiters =
    volumeUnit === "mL" ? finalVolume / 1000 : finalVolume;
  const stockVolumeLiters =
    (finalConcentration * finalVolumeLiters) / commercialConcentration;
  const safetyClassification =
    commercial.molarMass.substanceInfo?.safetyClassification;
  const safetyWarning =
    safetyClassification === "requiresSupervision" ||
    safetyClassification === "highPrecaution"
      ? "Esta preparación requiere supervisión docente, equipamiento adecuado y cumplimiento de las normas de seguridad del laboratorio."
      : undefined;
  return {
    formula: formulaInput.trim(),
    percentage: commercial.percentage,
    density: commercial.density,
    concentrationType,
    finalConcentration,
    finalVolume,
    volumeUnit,
    molarMass: commercial.molarMass,
    commercialMolarity: commercial.molarity,
    commercialConcentration,
    equivalenceFactor,
    finalVolumeLiters,
    stockVolumeLiters,
    stockVolume:
      volumeUnit === "mL" ? stockVolumeLiters * 1000 : stockVolumeLiters,
    safetyClassification,
    safetyWarning,
  };
}

function parsePercentage(input: string): number | null {
  const value = parsePositiveNumber(input);
  return value !== null && value <= 100 ? value : null;
}

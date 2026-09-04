import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";

export type DilutionConcentrationType = "molarity" | "normality";
export type DilutionVolumeUnit = "mL" | "L";

export type DilutionResult = {
  substance: string;
  substanceName?: string;
  concentrationType: DilutionConcentrationType;
  initialConcentration: number;
  finalConcentration: number;
  finalVolume: number;
  volumeUnit: DilutionVolumeUnit;
  finalVolumeLiters: number;
  stockVolumeLiters: number;
  stockVolume: number;
  stockVolumeMilliliters: number;
  stockConcentration: number;
  safetyWarning?: string;
};

export type DilutionError = { error: string };

export function calculateDilution(
  substanceInput: string,
  concentrationType: DilutionConcentrationType,
  initialConcentrationInput: string,
  finalConcentrationInput: string,
  finalVolumeInput: string,
  volumeUnit: DilutionVolumeUnit,
): DilutionResult | DilutionError {
  const substance = substanceInput.trim();
  if (!substance)
    return { error: "Escribí la fórmula o nombre de la sustancia." };

  const initialConcentration = parsePositiveNumber(initialConcentrationInput);
  if (initialConcentration === null)
    return { error: "Ingresá una concentración inicial mayor que cero." };
  const finalConcentration = parsePositiveNumber(finalConcentrationInput);
  if (finalConcentration === null)
    return { error: "Ingresá una concentración final mayor que cero." };
  if (finalConcentration >= initialConcentration) {
    return {
      error:
        "Una dilución requiere que la solución inicial sea más concentrada que la solución final.",
    };
  }

  const finalVolume = parsePositiveNumber(finalVolumeInput);
  if (finalVolume === null)
    return { error: "Ingresá un volumen final mayor que cero." };

  const finalVolumeLiters =
    volumeUnit === "mL" ? finalVolume / 1000 : finalVolume;
  const stockVolumeLiters =
    (finalConcentration * finalVolumeLiters) / initialConcentration;
  const molarMass = calculateMolarMass(substance);
  const normalizedSubstance = substance.replace(/\s+/gu, "");
  const safetyWarning = ["HCl", "H2SO4", "HNO3", "NaOH"].includes(
    normalizedSubstance,
  )
    ? "Esta preparación requiere supervisión docente y el uso de medidas de seguridad adecuadas."
    : undefined;

  return {
    substance,
    substanceName: molarMass.substanceName,
    concentrationType,
    initialConcentration,
    finalConcentration,
    finalVolume,
    volumeUnit,
    finalVolumeLiters,
    stockVolumeLiters,
    stockVolume:
      volumeUnit === "mL" ? stockVolumeLiters * 1000 : stockVolumeLiters,
    stockVolumeMilliliters: stockVolumeLiters * 1000,
    stockConcentration: initialConcentration,
    safetyWarning,
  };
}

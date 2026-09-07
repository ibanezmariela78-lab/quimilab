import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import { findExactSubstance } from "@/chemistry/substances";

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

export type DilutionError = {
  error: string;
};

export function calculateDilution(
  substanceInput: string,
  concentrationType: DilutionConcentrationType,
  initialConcentrationInput: string,
  finalConcentrationInput: string,
  finalVolumeInput: string,
  volumeUnit: DilutionVolumeUnit,
): DilutionResult | DilutionError {
  const substance = substanceInput.trim();

  if (!substance) {
    return {
      error: "Escribí la fórmula o nombre de la sustancia.",
    };
  }

  const initialConcentration = parsePositiveNumber(initialConcentrationInput);

  if (initialConcentration === null) {
    return {
      error: "Ingresá una concentración inicial mayor que cero.",
    };
  }

  const finalConcentration = parsePositiveNumber(finalConcentrationInput);

  if (finalConcentration === null) {
    return {
      error: "Ingresá una concentración final mayor que cero.",
    };
  }

  if (finalConcentration >= initialConcentration) {
    return {
      error:
        "Una dilución requiere que la solución inicial sea más concentrada que la solución final.",
    };
  }

  const finalVolume = parsePositiveNumber(finalVolumeInput);

  if (finalVolume === null) {
    return {
      error: "Ingresá un volumen final mayor que cero.",
    };
  }

  const finalVolumeLiters =
    volumeUnit === "mL" ? finalVolume / 1000 : finalVolume;

  const stockVolumeLiters =
    (finalConcentration * finalVolumeLiters) / initialConcentration;

  const stockVolume =
    volumeUnit === "mL" ? stockVolumeLiters * 1000 : stockVolumeLiters;

  const stockVolumeMilliliters = stockVolumeLiters * 1000;

  const registeredSubstance = findExactSubstance(substance);

  const molarMass = calculateMolarMass(substance);

  const substanceName = registeredSubstance?.name ?? molarMass.substanceName;

  let safetyWarning: string | undefined;

  if (registeredSubstance?.safetyClassification === "highPrecaution") {
    safetyWarning =
      "Esta sustancia requiere precaución alta. La dilución debe realizarse únicamente con supervisión docente, elementos de protección adecuados y evaluación previa de los riesgos.";
  } else if (
    registeredSubstance?.safetyClassification === "requiresSupervision"
  ) {
    safetyWarning =
      "Esta preparación requiere supervisión docente y el uso de las medidas de seguridad correspondientes.";
  }

  return {
    substance: registeredSubstance?.formula ?? substance,

    substanceName,

    concentrationType,

    initialConcentration,

    finalConcentration,

    finalVolume,

    volumeUnit,

    finalVolumeLiters,

    stockVolumeLiters,

    stockVolume,

    stockVolumeMilliliters,

    stockConcentration: initialConcentration,

    safetyWarning,
  };
}

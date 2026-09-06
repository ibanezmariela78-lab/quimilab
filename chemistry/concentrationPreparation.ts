import {
  calculateMolarityPreparation,
  type MolarityPreparationResult,
  type VolumeUnit,
} from "./molarity";

import {
  calculateMolalityPreparation,
  type MolalityPreparationResult,
  type SolventMassUnit,
} from "./molality";

import {
  calculateNormalityPreparation,
  type NormalityPreparationResult,
  type NormalityVolumeUnit,
} from "./normality";

export type ConcentrationMethod = "molarity" | "molality" | "normality";

export type MolarityPreparationInput = {
  method: "molarity";
  formula: string;
  concentration: string;
  volume: string;
  volumeUnit: VolumeUnit;
};

export type MolalityPreparationInput = {
  method: "molality";
  formula: string;
  concentration: string;
  solventMass: string;
  solventMassUnit: SolventMassUnit;
};

export type NormalityPreparationInput = {
  method: "normality";
  formula: string;
  concentration: string;
  volume: string;
  volumeUnit: NormalityVolumeUnit;
};

export type ConcentrationPreparationInput =
  | MolarityPreparationInput
  | MolalityPreparationInput
  | NormalityPreparationInput;

export type ConcentrationPreparationSuccess =
  | {
      method: "molarity";
      result: MolarityPreparationResult;
      title: string;
      concentrationLabel: string;
      basisLabel: string;
      preparationNote: string;
    }
  | {
      method: "molality";
      result: MolalityPreparationResult;
      title: string;
      concentrationLabel: string;
      basisLabel: string;
      preparationNote: string;
    }
  | {
      method: "normality";
      result: NormalityPreparationResult;
      title: string;
      concentrationLabel: string;
      basisLabel: string;
      preparationNote: string;
    };

export type ConcentrationPreparationError = {
  method: ConcentrationMethod;
  error: string;
};

export type ConcentrationPreparationResponse =
  | ConcentrationPreparationSuccess
  | ConcentrationPreparationError;

export function calculateConcentrationPreparation(
  input: ConcentrationPreparationInput,
): ConcentrationPreparationResponse {
  if (input.method === "molarity") {
    const calculation = calculateMolarityPreparation(
      input.formula,
      input.concentration,
      input.volume,
      input.volumeUnit,
    );

    if ("error" in calculation) {
      return {
        method: "molarity",
        error: calculation.error,
      };
    }

    return {
      method: "molarity",
      result: calculation,
      title: "Preparación por molaridad",
      concentrationLabel: "Molaridad",
      basisLabel: "Volumen final de solución",
      preparationNote:
        "La molaridad se expresa en moles de soluto por litro de solución. El volumen indicado corresponde al volumen final de la solución, no al volumen inicial de solvente.",
    };
  }

  if (input.method === "molality") {
    const calculation = calculateMolalityPreparation(
      input.formula,
      input.concentration,
      input.solventMass,
      input.solventMassUnit,
    );

    if ("error" in calculation) {
      return {
        method: "molality",
        error: calculation.error,
      };
    }

    return {
      method: "molality",
      result: calculation,
      title: "Preparación por molalidad",
      concentrationLabel: "Molalidad",
      basisLabel: "Masa de solvente",
      preparationNote:
        "La molalidad se expresa en moles de soluto por kilogramo de solvente. No depende del volumen final de la solución y no debe prepararse completando hasta una marca de aforo.",
    };
  }

  const calculation = calculateNormalityPreparation(
    input.formula,
    input.concentration,
    input.volume,
    input.volumeUnit,
  );

  if ("error" in calculation) {
    return {
      method: "normality",
      error: calculation.error,
    };
  }

  return {
    method: "normality",
    result: calculation,
    title: "Preparación por normalidad",
    concentrationLabel: "Normalidad",
    basisLabel: "Equivalentes por litro de solución",
    preparationNote:
      "La normalidad depende del número de equivalentes involucrados en la reacción considerada. QuimiLab solo realiza el cálculo cuando dispone de un factor de equivalencia definido para ese contexto.",
  };
}

export function getConcentrationMethodLabel(
  method: ConcentrationMethod,
): string {
  switch (method) {
    case "molarity":
      return "Molaridad";

    case "molality":
      return "Molalidad";

    case "normality":
      return "Normalidad";
  }
}

export function getConcentrationUnit(method: ConcentrationMethod): string {
  switch (method) {
    case "molarity":
      return "mol/L";

    case "molality":
      return "mol/kg";

    case "normality":
      return "eq/L";
  }
}

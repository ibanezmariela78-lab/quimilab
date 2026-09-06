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

import {
  calculateMassMassPercentage,
  calculateMassVolumePercentage,
  calculateVolumeVolumePercentage,
  type PercentageMassUnit,
  type PercentageResult,
  type PercentageVolumeUnit,
} from "./percentages";

export type ConcentrationMethod =
  | "molarity"
  | "molality"
  | "normality"
  | "massMassPercentage"
  | "massVolumePercentage"
  | "volumeVolumePercentage";

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

export type MassMassPercentageInput = {
  method: "massMassPercentage";
  component: string;
  concentration: string;
  finalMass: string;
  massUnit: PercentageMassUnit;
};

export type MassVolumePercentageInput = {
  method: "massVolumePercentage";
  component: string;
  concentration: string;
  finalVolume: string;
  volumeUnit: PercentageVolumeUnit;
};

export type VolumeVolumePercentageInput = {
  method: "volumeVolumePercentage";
  component: string;
  concentration: string;
  finalVolume: string;
  volumeUnit: PercentageVolumeUnit;
};

export type ConcentrationPreparationInput =
  | MolarityPreparationInput
  | MolalityPreparationInput
  | NormalityPreparationInput
  | MassMassPercentageInput
  | MassVolumePercentageInput
  | VolumeVolumePercentageInput;

export type MolarityPreparationSuccess = {
  method: "molarity";
  result: MolarityPreparationResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type MolalityPreparationSuccess = {
  method: "molality";
  result: MolalityPreparationResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type NormalityPreparationSuccess = {
  method: "normality";
  result: NormalityPreparationResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type MassMassPercentageSuccess = {
  method: "massMassPercentage";
  result: PercentageResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type MassVolumePercentageSuccess = {
  method: "massVolumePercentage";
  result: PercentageResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type VolumeVolumePercentageSuccess = {
  method: "volumeVolumePercentage";
  result: PercentageResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type ConcentrationPreparationSuccess =
  | MolarityPreparationSuccess
  | MolalityPreparationSuccess
  | NormalityPreparationSuccess
  | MassMassPercentageSuccess
  | MassVolumePercentageSuccess
  | VolumeVolumePercentageSuccess;

export type ConcentrationPreparationError<
  TMethod extends ConcentrationMethod = ConcentrationMethod,
> = {
  method: TMethod;
  error: string;
};

export type ConcentrationPreparationResponse =
  | ConcentrationPreparationSuccess
  | ConcentrationPreparationError;

export function calculateConcentrationPreparation(
  input: MolarityPreparationInput,
): MolarityPreparationSuccess | ConcentrationPreparationError<"molarity">;

export function calculateConcentrationPreparation(
  input: MolalityPreparationInput,
): MolalityPreparationSuccess | ConcentrationPreparationError<"molality">;

export function calculateConcentrationPreparation(
  input: NormalityPreparationInput,
): NormalityPreparationSuccess | ConcentrationPreparationError<"normality">;

export function calculateConcentrationPreparation(
  input: MassMassPercentageInput,
):
  | MassMassPercentageSuccess
  | ConcentrationPreparationError<"massMassPercentage">;

export function calculateConcentrationPreparation(
  input: MassVolumePercentageInput,
):
  | MassVolumePercentageSuccess
  | ConcentrationPreparationError<"massVolumePercentage">;

export function calculateConcentrationPreparation(
  input: VolumeVolumePercentageInput,
):
  | VolumeVolumePercentageSuccess
  | ConcentrationPreparationError<"volumeVolumePercentage">;

export function calculateConcentrationPreparation(
  input: ConcentrationPreparationInput,
): ConcentrationPreparationResponse {
  switch (input.method) {
    case "molarity": {
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

    case "molality": {
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

    case "normality": {
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

    case "massMassPercentage": {
      const calculation = calculateMassMassPercentage(
        input.component,
        input.concentration,
        input.finalMass,
        input.massUnit,
      );

      if ("error" in calculation) {
        return {
          method: "massMassPercentage",
          error: calculation.error,
        };
      }

      return {
        method: "massMassPercentage",
        result: calculation,
        title: "Preparación por porcentaje m/m",
        concentrationLabel: "% m/m",
        basisLabel: "Masa final de la mezcla",
        preparationNote:
          "El porcentaje masa en masa expresa gramos de componente por cada 100 g de mezcla final. La masa final incluye tanto el componente como el resto de la preparación.",
      };
    }

    case "massVolumePercentage": {
      const calculation = calculateMassVolumePercentage(
        input.component,
        input.concentration,
        input.finalVolume,
        input.volumeUnit,
      );

      if ("error" in calculation) {
        return {
          method: "massVolumePercentage",
          error: calculation.error,
        };
      }

      return {
        method: "massVolumePercentage",
        result: calculation,
        title: "Preparación por porcentaje m/v",
        concentrationLabel: "% m/v",
        basisLabel: "Volumen final de solución",
        preparationNote:
          "El porcentaje masa en volumen expresa gramos de soluto por cada 100 mL de solución final. El volumen indicado corresponde al volumen final de la solución.",
      };
    }

    case "volumeVolumePercentage": {
      const calculation = calculateVolumeVolumePercentage(
        input.component,
        input.concentration,
        input.finalVolume,
        input.volumeUnit,
      );

      if ("error" in calculation) {
        return {
          method: "volumeVolumePercentage",
          error: calculation.error,
        };
      }

      return {
        method: "volumeVolumePercentage",
        result: calculation,
        title: "Preparación por porcentaje v/v",
        concentrationLabel: "% v/v",
        basisLabel: "Volumen final de mezcla",
        preparationNote:
          "El porcentaje volumen en volumen expresa mililitros de un componente líquido por cada 100 mL de mezcla final. No debe suponerse que los volúmenes individuales sean perfectamente aditivos.",
      };
    }
  }
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

    case "massMassPercentage":
      return "% m/m";

    case "massVolumePercentage":
      return "% m/v";

    case "volumeVolumePercentage":
      return "% v/v";
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

    case "massMassPercentage":
    case "massVolumePercentage":
    case "volumeVolumePercentage":
      return "%";
  }
}

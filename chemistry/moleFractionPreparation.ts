import {
    calculateMoleFractions,
    type MoleFractionComponentInput,
    type MoleFractionResult,
} from "./moleFraction";

export type MoleFractionPreparationSuccess = {
  method: "moleFraction";
  result: MoleFractionResult;
  title: string;
  concentrationLabel: string;
  basisLabel: string;
  preparationNote: string;
};

export type MoleFractionPreparationError = {
  method: "moleFraction";
  error: string;
};

export type MoleFractionPreparationResponse =
  | MoleFractionPreparationSuccess
  | MoleFractionPreparationError;

export function calculateMoleFractionPreparation(
  components: MoleFractionComponentInput[],
): MoleFractionPreparationResponse {
  const calculation = calculateMoleFractions(components);

  if ("error" in calculation) {
    return {
      method: "moleFraction",
      error: calculation.error,
    };
  }

  return {
    method: "moleFraction",
    result: calculation,
    title: "Composición por fracción molar",
    concentrationLabel: "Fracción molar",
    basisLabel: "Moles del componente respecto de los moles totales",
    preparationNote:
      "La fracción molar es una magnitud sin unidades. Se calcula dividiendo los moles de cada componente por la cantidad total de moles de la mezcla.",
  };
}

import type { SubstanceInfo } from "./types";

export type PreparationType =
  | "solidLiquidSolution"
  | "solidSolidMixture"
  | "liquidDilution"
  | "viscousPreparation";

export type AutomaticPreparationResult = {
  type: PreparationType | null;
  title: string;
  explanation: string;
  detectedAutomatically: boolean;
  needsMoreData: boolean;
};

type InferPreparationInput = {
  substance: SubstanceInfo | null | undefined;
  isDilution?: boolean;
  secondComponentState?:
    | "solid"
    | "liquid"
    | "viscousLiquid"
    | "semisolid"
    | "gas"
    | null;
};

export function inferPreparationType(
  input: InferPreparationInput,
): AutomaticPreparationResult {
  const {
    substance,
    isDilution = false,
    secondComponentState = "liquid",
  } = input;

  if (!substance) {
    return {
      type: null,
      title: "Preparación no identificada",
      explanation:
        "QuimiLab necesita identificar la sustancia antes de determinar automáticamente el tipo de preparación.",
      detectedAutomatically: false,
      needsMoreData: true,
    };
  }

  if (isDilution) {
    return {
      type: "liquidDilution",
      title: "Dilución",
      explanation:
        "Se indicó que la preparación parte de una solución madre para obtener una solución menos concentrada.",
      detectedAutomatically: true,
      needsMoreData: false,
    };
  }

  if (
    substance.physicalState === "viscousLiquid" ||
    substance.physicalState === "semisolid"
  ) {
    return {
      type: "viscousPreparation",
      title: "Sustancia viscosa o semisólida",
      explanation:
        "QuimiLab detectó que la sustancia presenta un estado físico que requiere considerar masa, viscosidad o densidad.",
      detectedAutomatically: true,
      needsMoreData: false,
    };
  }

  if (substance.physicalState === "solid" && secondComponentState === "solid") {
    return {
      type: "solidSolidMixture",
      title: "Sólido + sólido",
      explanation:
        "QuimiLab detectó que ambos componentes son sólidos, por lo que corresponde una preparación y homogeneización de sólidos.",
      detectedAutomatically: true,
      needsMoreData: false,
    };
  }

  if (
    substance.physicalState === "solid" &&
    secondComponentState === "liquid"
  ) {
    return {
      type: "solidLiquidSolution",
      title: "Sólido + líquido",
      explanation:
        "QuimiLab detectó un componente sólido y un componente líquido. La solubilidad determinará si la preparación final es una solución, suspensión o dispersión.",
      detectedAutomatically: true,
      needsMoreData: false,
    };
  }

  if (
    substance.physicalState === "liquid" &&
    secondComponentState === "liquid"
  ) {
    return {
      type: null,
      title: "Líquido + líquido",
      explanation:
        "QuimiLab detectó dos componentes líquidos. Para decidir el procedimiento necesita saber si se trata de una dilución, una mezcla homogénea o una mezcla de líquidos inmiscibles.",
      detectedAutomatically: true,
      needsMoreData: true,
    };
  }

  return {
    type: null,
    title: "Preparación pendiente de clasificación",
    explanation:
      "QuimiLab reconoce el estado físico de la sustancia, pero necesita más información sobre el segundo componente o el objetivo de la preparación.",
    detectedAutomatically: false,
    needsMoreData: true,
  };
}

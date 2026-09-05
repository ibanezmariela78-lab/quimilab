import type { PairInteraction } from "./substancePairInteractions";
import type { SubstanceInfo } from "./types";

export type PreparationType =
  | "solidLiquidSolution"
  | "solidSolidMixture"
  | "liquidDilution"
  | "viscousPreparation"
  | "liquidLiquidMixture";

export type AutomaticPreparationResult = {
  type: PreparationType | null;
  title: string;
  explanation: string;
  detectedAutomatically: boolean;
  needsMoreData: boolean;
  component1State?: SubstanceInfo["physicalState"];
  component2State?: SubstanceInfo["physicalState"];
};

type InferPreparationInput = {
  substance: SubstanceInfo | null | undefined;

  secondSubstance?: SubstanceInfo | null;

  isDilution?: boolean;

  pairInteraction?: PairInteraction | null;

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
    secondSubstance = null,
    isDilution = false,
    pairInteraction = null,
    secondComponentState = null,
  } = input;

  if (!substance) {
    return {
      type: null,
      title: "Preparación no identificada",
      explanation:
        "QuimiLab necesita identificar al menos la primera sustancia antes de determinar automáticamente el tipo de preparación.",
      detectedAutomatically: false,
      needsMoreData: true,
    };
  }

  const component1State = substance.physicalState ?? null;

  const component2State =
    secondSubstance?.physicalState ?? secondComponentState ?? null;

  if (isDilution) {
    return {
      type: "liquidDilution",
      title: "Dilución",
      explanation:
        "El objetivo indicado es obtener una solución menos concentrada a partir de una solución madre.",
      detectedAutomatically: true,
      needsMoreData: false,
      component1State,
      component2State,
    };
  }

  if (!component1State) {
    return {
      type: null,
      title: "Estado físico no disponible",
      explanation:
        "QuimiLab reconoce la primera sustancia, pero todavía no posee información suficiente sobre su estado físico.",
      detectedAutomatically: false,
      needsMoreData: true,
      component1State,
      component2State,
    };
  }

  if (!component2State) {
    return {
      type: null,
      title: "Falta identificar el segundo componente",
      explanation:
        "QuimiLab ya conoce la primera sustancia, pero necesita identificar el segundo componente para decidir automáticamente qué tipo de preparación corresponde.",
      detectedAutomatically: false,
      needsMoreData: true,
      component1State,
      component2State,
    };
  }

  if (
    component1State === "viscousLiquid" ||
    component1State === "semisolid" ||
    component2State === "viscousLiquid" ||
    component2State === "semisolid"
  ) {
    return {
      type: "viscousPreparation",
      title: "Preparación con sustancia viscosa o semisólida",
      explanation:
        "QuimiLab detectó que al menos uno de los componentes es viscoso o semisólido. La preparación debe considerar masa, viscosidad, densidad y dificultad de transferencia.",
      detectedAutomatically: true,
      needsMoreData: false,
      component1State,
      component2State,
    };
  }

  if (component1State === "solid" && component2State === "solid") {
    return {
      type: "solidSolidMixture",
      title: "Sólido + sólido",
      explanation:
        "QuimiLab detectó que ambos componentes son sólidos. Corresponde evaluar una preparación por pesada, mezcla y homogeneización.",
      detectedAutomatically: true,
      needsMoreData: false,
      component1State,
      component2State,
    };
  }

  if (
    (component1State === "solid" && component2State === "liquid") ||
    (component1State === "liquid" && component2State === "solid")
  ) {
    return {
      type: "solidLiquidSolution",
      title: "Sólido + líquido",
      explanation:
        "QuimiLab detectó un componente sólido y otro líquido. El comportamiento entre ambos determinará si la preparación final es una solución, suspensión o dispersión.",
      detectedAutomatically: true,
      needsMoreData: false,
      component1State,
      component2State,
    };
  }

  if (component1State === "liquid" && component2State === "liquid") {
    if (pairInteraction === "miscible") {
      return {
        type: "liquidLiquidMixture",
        title: "Líquido + líquido",
        explanation:
          "QuimiLab detectó dos líquidos y encontró información que indica que son miscibles entre sí.",
        detectedAutomatically: true,
        needsMoreData: false,
        component1State,
        component2State,
      };
    }

    if (pairInteraction === "immiscible") {
      return {
        type: "liquidLiquidMixture",
        title: "Líquido + líquido",
        explanation:
          "QuimiLab detectó dos líquidos y encontró información que indica que son inmiscibles entre sí.",
        detectedAutomatically: true,
        needsMoreData: false,
        component1State,
        component2State,
      };
    }

    if (pairInteraction === "reactive") {
      return {
        type: "liquidLiquidMixture",
        title: "Líquido + líquido con posible reacción",
        explanation:
          "QuimiLab detectó que la interacción entre estos líquidos no debe tratarse como una simple mezcla.",
        detectedAutomatically: true,
        needsMoreData: true,
        component1State,
        component2State,
      };
    }

    return {
      type: "liquidLiquidMixture",
      title: "Líquido + líquido",
      explanation:
        "QuimiLab detectó dos líquidos, pero todavía no posee información suficiente sobre su miscibilidad.",
      detectedAutomatically: true,
      needsMoreData: true,
      component1State,
      component2State,
    };
  }

  if (component1State === "gas" || component2State === "gas") {
    return {
      type: null,
      title: "Preparación con componente gaseoso",
      explanation:
        "QuimiLab detectó un componente gaseoso. Este tipo de preparación requiere un módulo específico antes de generar un procedimiento de laboratorio.",
      detectedAutomatically: true,
      needsMoreData: true,
      component1State,
      component2State,
    };
  }

  return {
    type: null,
    title: "Preparación pendiente de clasificación",
    explanation:
      "QuimiLab reconoce los estados físicos de los componentes, pero todavía necesita más información para generar un procedimiento adecuado.",
    detectedAutomatically: false,
    needsMoreData: true,
    component1State,
    component2State,
  };
}

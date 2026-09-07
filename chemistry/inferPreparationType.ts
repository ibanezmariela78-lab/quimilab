import type { PairInteraction } from "./substancePairInteractions";
import type { SubstanceInfo } from "./types";

export type PreparationType =
  | "solidLiquidSolution"
  | "solidSolidMixture"
  | "liquidDilution"
  | "viscousPreparation"
  | "liquidLiquidMixture";

export type ViscousPreparationKind =
  | "viscousLiquid"
  | "semisolid"
  | "mixedViscousSemisolid";

export type AutomaticPreparationResult = {
  type: PreparationType | null;
  title: string;
  explanation: string;
  detectedAutomatically: boolean;
  needsMoreData: boolean;

  component1State?: SubstanceInfo["physicalState"];

  component2State?: SubstanceInfo["physicalState"];

  viscousKind?: ViscousPreparationKind;
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

  const component1IsViscous = component1State === "viscousLiquid";

  const component2IsViscous = component2State === "viscousLiquid";

  const component1IsSemisolid = component1State === "semisolid";

  const component2IsSemisolid = component2State === "semisolid";

  const hasViscousLiquid = component1IsViscous || component2IsViscous;

  const hasSemisolid = component1IsSemisolid || component2IsSemisolid;

  if (hasViscousLiquid || hasSemisolid) {
    if (hasViscousLiquid && hasSemisolid) {
      return {
        type: "viscousPreparation",

        viscousKind: "mixedViscousSemisolid",

        title: "Preparación viscosa + semisólida",

        explanation:
          "QuimiLab detectó un líquido viscoso y un componente semisólido. La preparación requiere considerar la dificultad de transferencia, la homogeneización, la posible necesidad de trabajar por masa y el comportamiento físico final de la mezcla.",

        detectedAutomatically: true,

        needsMoreData: false,

        component1State,

        component2State,
      };
    }

    if (hasSemisolid) {
      return {
        type: "viscousPreparation",

        viscousKind: "semisolid",

        title: "Preparación con componente semisólido",

        explanation:
          "QuimiLab detectó al menos un componente semisólido. La preparación debe considerar pesada, incorporación gradual, homogeneización y el comportamiento físico final. No debe suponerse automáticamente que se forma una solución.",

        detectedAutomatically: true,

        needsMoreData: false,

        component1State,

        component2State,
      };
    }

    return {
      type: "viscousPreparation",

      viscousKind: "viscousLiquid",

      title: "Preparación con líquido viscoso",

      explanation:
        "QuimiLab detectó al menos un líquido viscoso. La viscosidad puede dificultar una medición volumétrica precisa, por lo que puede ser preferible trabajar por masa cuando el método de la experiencia y los datos disponibles lo permitan.",

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

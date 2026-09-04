import { PreparationType } from "./labPreparation";

export type ComponentState = "solid" | "liquid" | "viscousLiquid" | "semisolid";

export type PreparationInferenceInput = {
  component1State: ComponentState;
  component2State: ComponentState;
  isDilution?: boolean;
};

export type PreparationInferenceResult = {
  type: PreparationType | null;
  title: string;
  explanation: string;
};

export function inferPreparationType(
  input: PreparationInferenceInput,
): PreparationInferenceResult {
  const { component1State, component2State, isDilution = false } = input;

  if (isDilution) {
    return {
      type: "liquidDilution",
      title: "Dilución",
      explanation:
        "QuimiLab detectó que se parte de una solución madre para obtener una solución de menor concentración.",
    };
  }

  if (component1State === "solid" && component2State === "solid") {
    return {
      type: "solidSolidMixture",
      title: "Mezcla sólido + sólido",
      explanation:
        "Los dos componentes son sólidos, por lo que la preparación requiere pesada y homogeneización.",
    };
  }

  if (
    (component1State === "solid" && component2State === "liquid") ||
    (component1State === "liquid" && component2State === "solid")
  ) {
    return {
      type: "solidLiquidSolution",
      title: "Preparación sólido + líquido",
      explanation:
        "QuimiLab detectó un componente sólido y otro líquido. El procedimiento dependerá además de la solubilidad del sólido.",
    };
  }

  if (
    component1State === "viscousLiquid" ||
    component2State === "viscousLiquid" ||
    component1State === "semisolid" ||
    component2State === "semisolid"
  ) {
    return {
      type: "viscousPreparation",
      title: "Preparación con sustancia viscosa o semisólida",
      explanation:
        "La presencia de una sustancia viscosa o semisólida requiere considerar cuidadosamente masa, volumen y densidad.",
    };
  }

  return {
    type: null,
    title: "Preparación todavía no clasificada",
    explanation:
      "QuimiLab necesita más información sobre las sustancias y el objetivo de la experiencia para seleccionar un procedimiento adecuado.",
  };
}

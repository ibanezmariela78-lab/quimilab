import { InteractionBehavior } from "./classifyMixture";

export type SubstanceWaterInteraction = {
  formula: string;
  interaction: InteractionBehavior;
  description: string;
  thermalBehavior?: "exothermic" | "endothermic" | "neutral" | "unknown";
  warning?: string;
};

export const substanceWaterInteractions: SubstanceWaterInteraction[] = [
  {
    formula: "NaCl",
    interaction: "soluble",
    description:
      "El cloruro de sodio es soluble en agua y puede formar una solución homogénea dentro de su rango de solubilidad.",
    thermalBehavior: "unknown",
  },
  {
    formula: "CaCl2",
    interaction: "soluble",
    description: "El cloruro de calcio es muy soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución en agua puede liberar calor y aumentar la temperatura de la preparación.",
  },
  {
    formula: "NaOH",
    interaction: "soluble",
    description: "El hidróxido de sodio es soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución puede liberar una cantidad importante de calor y requiere supervisión docente.",
  },
  {
    formula: "KOH",
    interaction: "soluble",
    description: "El hidróxido de potasio es soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución puede liberar calor y requiere supervisión docente.",
  },
  {
    formula: "KNO3",
    interaction: "soluble",
    description:
      "El nitrato de potasio es soluble en agua y su solubilidad aumenta notablemente con la temperatura.",
    thermalBehavior: "endothermic",
  },
  {
    formula: "NH4Cl",
    interaction: "soluble",
    description: "El cloruro de amonio es soluble en agua.",
    thermalBehavior: "endothermic",
  },
  {
    formula: "NaHCO3",
    interaction: "soluble",
    description: "El bicarbonato de sodio presenta solubilidad en agua.",
    thermalBehavior: "unknown",
  },
  {
    formula: "Na2CO3",
    interaction: "soluble",
    description: "El carbonato de sodio es soluble en agua.",
    thermalBehavior: "unknown",
  },
  {
    formula: "CuSO4",
    interaction: "soluble",
    description:
      "El sulfato de cobre es soluble en agua y puede producir una solución coloreada.",
    thermalBehavior: "unknown",
    warning:
      "Debe manipularse siguiendo las normas de seguridad del laboratorio.",
  },
  {
    formula: "CuSO4·5H2O",
    interaction: "soluble",
    description: "El sulfato de cobre pentahidratado es soluble en agua.",
    thermalBehavior: "unknown",
    warning:
      "Debe manipularse siguiendo las normas de seguridad del laboratorio.",
  },
  {
    formula: "MgSO4",
    interaction: "soluble",
    description: "El sulfato de magnesio es soluble en agua.",
    thermalBehavior: "unknown",
  },
  {
    formula: "MgSO4·7H2O",
    interaction: "soluble",
    description: "El sulfato de magnesio heptahidratado es soluble en agua.",
    thermalBehavior: "unknown",
  },
  {
    formula: "C2H5OH",
    interaction: "miscible",
    description:
      "El etanol es miscible con agua y puede formar una mezcla líquida homogénea.",
    thermalBehavior: "unknown",
  },
];

export function getInteractionWithWater(
  formula: string,
): SubstanceWaterInteraction | null {
  const normalizedFormula = normalizeFormula(formula);

  return (
    substanceWaterInteractions.find(
      (item) => normalizeFormula(item.formula) === normalizedFormula,
    ) ?? null
  );
}

function normalizeFormula(formula: string): string {
  return formula.trim().replace(/\s+/g, "").replace(/\./g, "·");
}

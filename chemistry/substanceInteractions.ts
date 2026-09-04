import { InteractionBehavior } from "./classifyMixture";

export type ThermalBehavior =
  | "exothermic"
  | "endothermic"
  | "neutral"
  | "unknown";

export type SubstanceWaterInteraction = {
  formula: string;
  aliases?: string[];
  interaction: InteractionBehavior;
  description: string;
  thermalBehavior?: ThermalBehavior;
  warning?: string;
};

export const substanceWaterInteractions: SubstanceWaterInteraction[] = [
  {
    formula: "NaCl",
    aliases: ["Cloruro de sodio"],
    interaction: "soluble",
    description:
      "El cloruro de sodio es soluble en agua y puede formar una solución homogénea dentro de su rango de solubilidad.",
    thermalBehavior: "unknown",
  },

  {
    formula: "CaCl2",
    aliases: ["Cloruro de calcio"],
    interaction: "soluble",
    description: "El cloruro de calcio es muy soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución en agua puede liberar calor y aumentar la temperatura de la preparación.",
  },

  {
    formula: "NaOH",
    aliases: ["Hidróxido de sodio"],
    interaction: "soluble",
    description: "El hidróxido de sodio es soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución puede liberar una cantidad importante de calor y requiere supervisión docente.",
  },

  {
    formula: "KOH",
    aliases: ["Hidróxido de potasio"],
    interaction: "soluble",
    description: "El hidróxido de potasio es soluble en agua.",
    thermalBehavior: "exothermic",
    warning:
      "Su disolución puede liberar calor y requiere supervisión docente.",
  },

  {
    formula: "KNO3",
    aliases: ["Nitrato de potasio"],
    interaction: "soluble",
    description:
      "El nitrato de potasio es soluble en agua y su solubilidad aumenta notablemente con la temperatura.",
    thermalBehavior: "endothermic",
  },

  {
    formula: "NH4Cl",
    aliases: ["Cloruro de amonio"],
    interaction: "soluble",
    description: "El cloruro de amonio es soluble en agua.",
    thermalBehavior: "endothermic",
  },

  {
    formula: "NaHCO3",
    aliases: ["Bicarbonato de sodio"],
    interaction: "soluble",
    description: "El bicarbonato de sodio presenta solubilidad en agua.",
    thermalBehavior: "unknown",
  },

  {
    formula: "Na2CO3",
    aliases: ["Carbonato de sodio"],
    interaction: "soluble",
    description: "El carbonato de sodio es soluble en agua.",
    thermalBehavior: "unknown",
  },

  {
    formula: "CuSO4",
    aliases: ["Sulfato de cobre"],
    interaction: "soluble",
    description:
      "El sulfato de cobre es soluble en agua y puede producir una solución coloreada.",
    thermalBehavior: "unknown",
    warning:
      "Debe manipularse siguiendo las normas de seguridad del laboratorio.",
  },

  {
    formula: "CuSO4·5H2O",
    aliases: ["CuSO4.5H2O", "Sulfato de cobre pentahidratado"],
    interaction: "soluble",
    description: "El sulfato de cobre pentahidratado es soluble en agua.",
    thermalBehavior: "unknown",
    warning:
      "Debe manipularse siguiendo las normas de seguridad del laboratorio.",
  },

  {
    formula: "MgSO4",
    aliases: ["Sulfato de magnesio"],
    interaction: "soluble",
    description: "El sulfato de magnesio es soluble en agua.",
    thermalBehavior: "unknown",
  },

  {
    formula: "MgSO4·7H2O",
    aliases: ["MgSO4.7H2O", "Sulfato de magnesio heptahidratado"],
    interaction: "soluble",
    description: "El sulfato de magnesio heptahidratado es soluble en agua.",
    thermalBehavior: "unknown",
  },

  {
    formula: "C2H5OH",
    aliases: ["Etanol", "Alcohol etílico"],
    interaction: "miscible",
    description:
      "El etanol es miscible con agua y puede formar una mezcla líquida homogénea.",
    thermalBehavior: "unknown",
  },

  {
    formula: "Mg3Si4O10(OH)2",
    aliases: ["Talco"],
    interaction: "insoluble",
    description:
      "El talco es prácticamente insoluble en agua. Al mezclarse con agua no forma una solución verdadera.",
    thermalBehavior: "unknown",
    warning:
      "Las partículas permanecen dispersas y pueden sedimentar con el tiempo.",
  },
];

export function getInteractionWithWater(
  formulaOrName: string,
): SubstanceWaterInteraction | null {
  const searchValue = normalizeFormula(formulaOrName).toLowerCase();

  return (
    substanceWaterInteractions.find((item) => {
      const formulaMatches =
        normalizeFormula(item.formula).toLowerCase() === searchValue;

      const aliasMatches =
        item.aliases?.some(
          (alias) => normalizeFormula(alias).toLowerCase() === searchValue,
        ) ?? false;

      return formulaMatches || aliasMatches;
    }) ?? null
  );
}

function normalizeFormula(value: string): string {
  return value.trim().replace(/\s+/g, "").replace(/\./g, "·");
}

import type { SubstanceInfo } from "@/chemistry/types";

const commonSubstances: Record<string, SubstanceInfo> = {
  H2O: {
    name: "Agua",
    physicalState: "liquid",
    waterSolubility: {
      classification: "miscible",
      description: "Es el solvente de referencia para esta ficha.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "approximatelyNeutral",
    preparationTypes: ["solution", "unknown"],
    safetyClassification: "educational",
  },

  HCl: {
    name: "Ácido clorhídrico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  NaCl: {
    name: "Cloruro de sodio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    preparationTypes: ["solution", "solidMixture"],
    safetyClassification: "educational",
  },

  CaCl2: {
    name: "Cloruro de calcio",
    observations: [
      "La disolución del cloruro de calcio en agua es exotérmica y puede producir un aumento de temperatura.",
    ],
    temperatureBehavior: "La disolución en agua es exotérmica.",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "exothermic",
    preparationTypes: ["solution"],
    safetyClassification: "requiresSupervision",
  },

  H2SO4: {
    name: "Ácido sulfúrico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  HNO3: {
    name: "Ácido nítrico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  NaOH: {
    name: "Hidróxido de sodio",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "exothermic",
    observations: [
      "La disolución en agua libera una cantidad importante de calor.",
    ],
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },

  KOH: {
    name: "Hidróxido de potasio",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "exothermic",
    observations: [
      "La disolución en agua puede liberar una cantidad importante de calor.",
    ],
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },

  "Ca(OH)2": {
    name: "Hidróxido de calcio",
    physicalState: "solid",
    waterSolubility: {
      classification: "slightlySoluble",
      description:
        "Presenta solubilidad limitada en agua. Según la cantidad utilizada puede quedar sólido sin disolver.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["suspension", "solution"],
  },

  CuSO4: {
    name: "Sulfato de cobre(II)",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },

  "CuSO4·5H2O": {
    name: "Sulfato de cobre(II) pentahidratado",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },

  NaHCO3: {
    name: "Bicarbonato de sodio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Presenta solubilidad en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "educational",
    preparationTypes: ["solution", "solidMixture"],
  },

  Na2CO3: {
    name: "Carbonato de sodio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution", "solidMixture"],
  },

  KNO3: {
    name: "Nitrato de potasio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description:
        "Soluble en agua. Su solubilidad aumenta notablemente al aumentar la temperatura.",
      temperatureDependence:
        "La solubilidad aumenta notablemente con la temperatura.",
    },
    dissolutionBehavior: "endothermic",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },

  KMnO4: {
    name: "Permanganato de potasio",
    physicalState: "solid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution"],
  },

  MgSO4: {
    name: "Sulfato de magnesio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "educational",
    preparationTypes: ["solution"],
  },

  "MgSO4·7H2O": {
    name: "Sulfato de magnesio heptahidratado",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "educational",
    preparationTypes: ["solution"],
  },

  "Al2(SO4)3": {
    name: "Sulfato de aluminio",
    physicalState: "solid",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },

  NH4Cl: {
    name: "Cloruro de amonio",
    physicalState: "solid",
    waterSolubility: {
      classification: "soluble",
      description: "Soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "endothermic",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },

  C2H5OH: {
    name: "Etanol",
    physicalState: "liquid",
    waterSolubility: {
      classification: "miscible",
      description: "Miscible con agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution"],
  },

  "Mg3Si4O10(OH)2": {
    name: "Talco",
    physicalState: "solid",
    waterSolubility: {
      classification: "practicallyInsoluble",
      description:
        "El talco es prácticamente insoluble en agua. Al mezclarse con agua no forma una solución verdadera.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    observations: [
      "Las partículas pueden permanecer dispersas y sedimentar con el tiempo.",
    ],
    preparationTypes: ["suspension"],
    safetyClassification: "educational",
  },
};

export type SubstanceRecord = SubstanceInfo & {
  formula: string;
};

export function getSubstanceRecords(): SubstanceRecord[] {
  return Object.entries(commonSubstances).map(([formula, info]) => ({
    formula,
    ...info,
  }));
}

export function findSubstanceRecords(query: string): SubstanceRecord[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return getSubstanceRecords();
  }

  return getSubstanceRecords().filter((substance) => {
    const formula = normalizeSearchValue(substance.formula);

    const name = normalizeSearchValue(substance.name);

    return formula.includes(normalizedQuery) || name.includes(normalizedQuery);
  });
}

export function findExactSubstance(query: string): SubstanceRecord | undefined {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return undefined;
  }

  return getSubstanceRecords().find((substance) => {
    const formula = normalizeSearchValue(substance.formula);

    const name = normalizeSearchValue(substance.name);

    return formula === normalizedQuery || name === normalizedQuery;
  });
}

export function getSubstanceName(formula: string): string | undefined {
  return getSubstanceInfo(formula)?.name;
}

export function getSubstanceInfo(formula: string): SubstanceInfo | undefined {
  const normalizedFormula = formula
    .trim()
    .replace(/\s+/gu, "")
    .replace(/\./g, "·");

  return commonSubstances[normalizedFormula];
}

function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, "")
    .replace(/\./g, "·")
    .toLocaleLowerCase();
}

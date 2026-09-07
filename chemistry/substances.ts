import type { SubstanceInfo } from "@/chemistry/types";

const commonSubstances: Record<string, SubstanceInfo> = {
  H2O: {
    name: "Agua",
    aliases: ["Agua destilada"],
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
    name: "�cido clorh�drico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  NaCl: {
    name: "Cloruro de sodio",
    aliases: ["Sal com�n"],
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
      "La disoluci�n del cloruro de calcio en agua es exot�rmica y puede producir un aumento de temperatura.",
    ],
    temperatureBehavior: "La disoluci�n en agua es exot�rmica.",
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
    name: "�cido sulf�rico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  HNO3: {
    name: "�cido n�trico",
    physicalState: "liquid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "unknown"],
  },

  NaOH: {
    name: "Hidr�xido de sodio",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "exothermic",
    observations: [
      "La disoluci�n en agua libera una cantidad importante de calor.",
    ],
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },

  KOH: {
    name: "Hidr�xido de potasio",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "exothermic",
    observations: [
      "La disoluci�n en agua puede liberar una cantidad importante de calor.",
    ],
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },

  "Ca(OH)2": {
    name: "Hidr�xido de calcio",
    physicalState: "solid",
    waterSolubility: {
      classification: "slightlySoluble",
      description:
        "Presenta solubilidad limitada en agua. Seg�n la cantidad utilizada puede quedar s�lido sin disolver.",
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

  "CuSO4�5H2O": {
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
    aliases: ["Bicarbonato"],
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

  "MgSO4�7H2O": {
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
    aliases: ["Alcohol et�lico"],
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

  C6H14: {
    name: "Hexano",
    physicalState: "liquid",
    waterSolubility: {
      classification: "immiscible",
      description:
        "El hexano es pr�cticamente inmiscible con agua y forma una fase l�quida separada.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    observations: [
      "El hexano es un l�quido inflamable y debe manipularse �nicamente bajo condiciones de laboratorio adecuadas.",
    ],
    preparationTypes: ["unknown"],
    safetyClassification: "highPrecaution",
  },

  C3H8O3: {
    name: "Glicerol",
    aliases: ["Glicerina"],
    physicalState: "viscousLiquid",
    waterSolubility: {
      classification: "miscible",
      description: "El glicerol es miscible con agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    observations: [
      "Es un l�quido viscoso. Su viscosidad puede dificultar la medici�n volum�trica y la transferencia completa entre recipientes.",
    ],
    preparationTypes: ["solution", "unknown"],
    safetyClassification: "educational",
  },

  KCl: {
    name: "Cloruro de potasio",
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

  C12H22O11: {
    name: "Sacarosa",
    aliases: ["Azucar", "Azucar comun"],
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

  C6H12O6: {
    name: "Glucosa",
    aliases: ["Dextrosa"],
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

  "CO(NH2)2": {
    name: "Urea",
    physicalState: "solid",
    waterSolubility: {
      classification: "verySoluble",
      description: "Muy soluble en agua.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    preparationTypes: ["solution", "solidMixture"],
    safetyClassification: "educational",
  },

  CH3COONa: {
    name: "Acetato de sodio",
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

  CaCO3: {
    name: "Carbonato de calcio",
    aliases: ["Carbonato calcico"],
    physicalState: "solid",
    waterSolubility: {
      classification: "practicallyInsoluble",
      description:
        "Es prácticamente insoluble en agua y puede permanecer como sólido disperso.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    preparationTypes: ["suspension", "solidMixture"],
    safetyClassification: "educational",
  },
  PETROLATUM: {
    name: "Petrolato (vaselina)",
    aliases: ["Petrolato", "Vaselina"],
    physicalState: "semisolid",
    waterSolubility: {
      classification: "practicallyInsoluble",
      description:
        "El petrolato es pr�cticamente insoluble en agua y no forma una soluci�n acuosa verdadera.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    observations: [
      "El petrolato es una mezcla semis�lida de hidrocarburos y no posee una f�rmula molecular �nica.",
      "Su consistencia semis�lida hace que normalmente se manipule y dosifique por masa.",
    ],
    preparationTypes: ["unknown"],
    safetyClassification: "educational",
  },

  "Mg3Si4O10(OH)2": {
    name: "Talco",
    physicalState: "solid",
    waterSolubility: {
      classification: "practicallyInsoluble",
      description:
        "El talco es pr�cticamente insoluble en agua. Al mezclarse con agua no forma una soluci�n verdadera.",
      temperatureDependence: null,
    },
    dissolutionBehavior: "unknown",
    observations: [
      "Las part�culas pueden permanecer dispersas y sedimentar con el tiempo.",
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
    const searchableValues = [
      substance.formula,
      substance.name,
      ...(substance.aliases ?? []),
    ].map(normalizeSearchValue);

    return searchableValues.some((value) => value.includes(normalizedQuery));
  });
}

export function findExactSubstance(query: string): SubstanceRecord | undefined {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return undefined;
  }

  return getSubstanceRecords().find((substance) => {
    const searchableValues = [
      substance.formula,
      substance.name,
      ...(substance.aliases ?? []),
    ].map(normalizeSearchValue);

    return searchableValues.some((value) => value === normalizedQuery);
  });
}

export function getSubstanceName(formula: string): string | undefined {
  return getSubstanceInfo(formula)?.name;
}

export function getSubstanceInfo(formula: string): SubstanceInfo | undefined {
  const normalizedValue = normalizeSearchValue(formula);

  if (!normalizedValue) {
    return undefined;
  }

  const directEntry = Object.entries(commonSubstances).find(
    ([key]) => normalizeSearchValue(key) === normalizedValue
  );

  if (directEntry) {
    return directEntry[1];
  }

  return Object.values(commonSubstances).find((info) => {
    const searchableValues = [
      info.name,
      ...(info.aliases ?? []),
    ].map(normalizeSearchValue);

    return searchableValues.some((value) => value === normalizedValue);
  });
}

function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, "")
    .replace(/\./g, "·")
    .toLocaleLowerCase();
}

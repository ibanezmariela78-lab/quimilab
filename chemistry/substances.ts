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
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },
  KOH: {
    name: "Hidróxido de potasio",
    physicalState: "solid",
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "solidMixture"],
  },
  "Ca(OH)2": {
    name: "Hidróxido de calcio",
    physicalState: "solid",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["suspension", "solution"],
  },
  CuSO4: {
    name: "Sulfato de cobre(II)",
    physicalState: "solid",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },
  "CuSO4·5H2O": {
    name: "Sulfato de cobre(II) pentahidratado",
    physicalState: "solid",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution"],
  },
  NaHCO3: {
    name: "Bicarbonato de sodio",
    physicalState: "solid",
    safetyClassification: "educational",
    preparationTypes: ["solution", "solidMixture"],
  },
  Na2CO3: {
    name: "Carbonato de sodio",
    physicalState: "solid",
    safetyClassification: "requiresSupervision",
    preparationTypes: ["solution", "solidMixture"],
  },
  KNO3: {
    name: "Nitrato de potasio",
    physicalState: "solid",
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
    safetyClassification: "educational",
    preparationTypes: ["solution"],
  },
  "MgSO4·7H2O": {
    name: "Sulfato de magnesio heptahidratado",
    physicalState: "solid",
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
    safetyClassification: "highPrecaution",
    preparationTypes: ["solution", "emulsion"],
  },
};

export type SubstanceRecord = SubstanceInfo & { formula: string };

export function getSubstanceRecords(): SubstanceRecord[] {
  return Object.entries(commonSubstances).map(([formula, info]) => ({
    formula,
    ...info,
  }));
}

export function findSubstanceRecords(query: string): SubstanceRecord[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return getSubstanceRecords();
  return getSubstanceRecords().filter((substance) =>
    [substance.formula, substance.name].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function getSubstanceName(formula: string): string | undefined {
  return getSubstanceInfo(formula)?.name;
}

export function getSubstanceInfo(formula: string): SubstanceInfo | undefined {
  return commonSubstances[formula.replace(/\s+/gu, "")];
}

import type { SubstanceInfo } from "@/chemistry/types";

export const physicalStateLabels: Record<
  NonNullable<SubstanceInfo["physicalState"]>,
  string
> = {
  solid: "Sólido",
  liquid: "Líquido",
  viscousLiquid: "Líquido viscoso",
  semisolid: "Semisólido",
  gas: "Gas",
};

export const preparationTypeLabels: Record<
  NonNullable<SubstanceInfo["preparationTypes"]>[number],
  string
> = {
  solution: "Solución",
  suspension: "Suspensión",
  emulsion: "Emulsión",
  solidMixture: "Mezcla sólida",
  dispersion: "Dispersión",
  unknown: "Desconocido / Sin información disponible",
};

export const dissolutionBehaviorLabels: Record<
  NonNullable<SubstanceInfo["dissolutionBehavior"]>,
  string
> = {
  exothermic: "Exotérmica",
  endothermic: "Endotérmica",
  approximatelyNeutral: "Aproximadamente neutra",
  unknown: "Sin información disponible",
};

export const safetyLevelLabels: Record<
  NonNullable<SubstanceInfo["safetyClassification"]>,
  string
> = {
  educational: "Uso educativo con supervisión habitual",
  requiresSupervision: "Requiere supervisión docente",
  highPrecaution: "Requiere precauciones especiales",
};

export const solubilityLabels = {
  soluble: "Soluble",
  verySoluble: "Muy soluble",
  slightlySoluble: "Poco soluble",
  practicallyInsoluble: "Prácticamente insoluble",
  miscible: "Miscible",
  immiscible: "Inmiscible",
} as const;

export function formatPreparationTypes(
  types: SubstanceInfo["preparationTypes"],
): string | null {
  return types?.map((type) => preparationTypeLabels[type]).join(", ") ?? null;
}

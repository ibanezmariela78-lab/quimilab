import type { SubstanceInfo } from "@/chemistry/types";

const commonSubstances: Record<string, SubstanceInfo> = {
  HCl: { name: "Ácido clorhídrico", safetyClassification: "highPrecaution" },
  NaCl: { name: "Cloruro de sodio" },
  CaCl2: {
    name: "Cloruro de calcio",
    observations: [
      "La disolución del cloruro de calcio en agua es exotérmica y puede producir un aumento de temperatura.",
    ],
    temperatureBehavior: "La disolución en agua es exotérmica.",
  },
  H2SO4: { name: "Ácido sulfúrico", safetyClassification: "highPrecaution" },
  HNO3: { name: "Ácido nítrico", safetyClassification: "highPrecaution" },
  NaOH: { name: "Hidróxido de sodio", safetyClassification: "highPrecaution" },
  "Ca(OH)2": { name: "Hidróxido de calcio" },
  "Al2(SO4)3": { name: "Sulfato de aluminio" },
};

export function getSubstanceName(formula: string): string | undefined {
  return getSubstanceInfo(formula)?.name;
}

export function getSubstanceInfo(formula: string): SubstanceInfo | undefined {
  return commonSubstances[formula.replace(/\s+/gu, "")];
}

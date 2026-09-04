export type ElementComposition = Record<string, number>;

export type ParsedFormula = {
  originalFormula: string;
  composition: ElementComposition;
};

export type ElementContribution = {
  symbol: string;
  name: string;
  spanishName: string;
  count: number;
  atomicWeight: number;
  contribution: number;
};

export type MolarMassCalculation = {
  formula: string;
  substanceName?: string;
  substanceInfo?: SubstanceInfo;
  composition: ElementComposition;
  elements: ElementContribution[];
  molarMass: number | null;
  warnings: string[];
  error?: string;
};

export type SubstanceInfo = {
  name: string;
  physicalState?: "solid" | "liquid" | "viscousLiquid" | "semisolid";
  preparationType?:
    | "solution"
    | "suspension"
    | "emulsion"
    | "solidMixture"
    | "semisolid";
  observations?: string[];
  solubility?: string;
  temperatureBehavior?: string;
  risks?: string[];
  solutionCharacteristics?: string;
  requiresTeacherSupervision?: boolean;
};

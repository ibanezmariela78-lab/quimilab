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
  aliases?: string[];
  densityGPerMl?: number | null;
  densityTemperatureC?: number | null;
  densityNote?: string | null;
  safetyClassification?:
    | "educational"
    | "requiresSupervision"
    | "highPrecaution";
  physicalState?:
    | "solid"
    | "liquid"
    | "viscousLiquid"
    | "semisolid"
    | "gas"
    | null;
  preparationType?:
    | "solution"
    | "suspension"
    | "emulsion"
    | "solidMixture"
    | "semisolid";
  observations?: string[];
  waterSolubility?: {
    classification:
      | "soluble"
      | "verySoluble"
      | "slightlySoluble"
      | "practicallyInsoluble"
      | "miscible"
      | "immiscible"
      | null;
    description: string | null;
    temperatureDependence: string | null;
  } | null;
  dissolutionBehavior?:
    | "exothermic"
    | "endothermic"
    | "approximatelyNeutral"
    | "unknown"
    | null;
  meltingPointC?: number | null;
  boilingPointC?: number | null;
  thermalWarning?: string | null;
  preparationTypes?: (
    | "solution"
    | "suspension"
    | "emulsion"
    | "solidMixture"
    | "dispersion"
    | "unknown"
  )[];
  solubility?: string;
  temperatureBehavior?: string;
  risks?: string[];
  solutionCharacteristics?: string;
  requiresTeacherSupervision?: boolean;
};

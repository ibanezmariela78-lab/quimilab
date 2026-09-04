export type ComponentPhysicalState =
  | "solid"
  | "liquid"
  | "viscousLiquid"
  | "semisolid";

export type InteractionBehavior =
  | "soluble"
  | "partiallySoluble"
  | "insoluble"
  | "miscible"
  | "immiscible"
  | "unknown";

export type MixtureType =
  | "solution"
  | "suspension"
  | "solidMixture"
  | "heterogeneousLiquidMixture"
  | "dispersion"
  | "unknown";

export type MixtureClassificationInput = {
  component1State: ComponentPhysicalState;
  component2State: ComponentPhysicalState;
  interaction: InteractionBehavior;
};

export type MixtureClassificationResult = {
  type: MixtureType;
  label: string;
  explanation: string;
  canUseSolutionProcedure: boolean;
  needsMoreData: boolean;
  warnings: string[];
};

export function classifyMixture(
  input: MixtureClassificationInput,
): MixtureClassificationResult {
  const { component1State, component2State, interaction } = input;

  // SÓLIDO + SÓLIDO
  if (component1State === "solid" && component2State === "solid") {
    return {
      type: "solidMixture",
      label: "Mezcla sólida",
      explanation:
        "Los componentes son sólidos. La preparación requiere pesada y homogeneización, no una disolución.",
      canUseSolutionProcedure: false,
      needsMoreData: false,
      warnings: [],
    };
  }

  // SÓLIDO + LÍQUIDO
  const isSolidLiquid =
    (component1State === "solid" && component2State === "liquid") ||
    (component1State === "liquid" && component2State === "solid");

  if (isSolidLiquid) {
    if (interaction === "soluble") {
      return {
        type: "solution",
        label: "Solución",
        explanation:
          "El sólido es soluble en el líquido, por lo que puede formarse una mezcla homogénea.",
        canUseSolutionProcedure: true,
        needsMoreData: false,
        warnings: [],
      };
    }

    if (interaction === "partiallySoluble") {
      return {
        type: "dispersion",
        label: "Dispersión",
        explanation:
          "La sustancia presenta solubilidad limitada. Puede quedar material sin disolver.",
        canUseSolutionProcedure: false,
        needsMoreData: false,
        warnings: ["No debe suponerse que todo el sólido se disolverá."],
      };
    }

    if (interaction === "insoluble") {
      return {
        type: "suspension",
        label: "Suspensión",
        explanation:
          "El sólido es prácticamente insoluble en el líquido. Las partículas permanecen dispersas y pueden sedimentar con el tiempo.",
        canUseSolutionProcedure: false,
        needsMoreData: false,
        warnings: [
          "Esta preparación no debe describirse como una solución homogénea.",
        ],
      };
    }

    return {
      type: "unknown",
      label: "Tipo de preparación no determinado",
      explanation:
        "QuimiLab necesita conocer la solubilidad del sólido en el líquido utilizado.",
      canUseSolutionProcedure: false,
      needsMoreData: true,
      warnings: [
        "No se debe asumir que un sólido se disuelve solamente porque se mezcla con un líquido.",
      ],
    };
  }

  // LÍQUIDO + LÍQUIDO
  const isLiquidLiquid =
    (component1State === "liquid" || component1State === "viscousLiquid") &&
    (component2State === "liquid" || component2State === "viscousLiquid");

  if (isLiquidLiquid) {
    if (interaction === "miscible") {
      return {
        type: "solution",
        label: "Solución líquida homogénea",
        explanation:
          "Los dos líquidos son miscibles y pueden formar una sola fase homogénea.",
        canUseSolutionProcedure: true,
        needsMoreData: false,
        warnings: [],
      };
    }

    if (interaction === "immiscible") {
      return {
        type: "heterogeneousLiquidMixture",
        label: "Mezcla líquida heterogénea",
        explanation:
          "Los líquidos son inmiscibles y tienden a formar fases separadas.",
        canUseSolutionProcedure: false,
        needsMoreData: false,
        warnings: [
          "No debe llamarse automáticamente emulsión. Una emulsión requiere que un líquido se encuentre disperso en el otro.",
        ],
      };
    }

    return {
      type: "unknown",
      label: "Tipo de preparación no determinado",
      explanation:
        "QuimiLab necesita conocer si los líquidos son miscibles entre sí.",
      canUseSolutionProcedure: false,
      needsMoreData: true,
      warnings: [],
    };
  }

  // SEMISÓLIDOS Y CASOS ESPECIALES
  if (component1State === "semisolid" || component2State === "semisolid") {
    return {
      type: "dispersion",
      label: "Preparación semisólida o dispersión",
      explanation:
        "La presencia de un componente semisólido requiere considerar sus propiedades específicas antes de definir el procedimiento.",
      canUseSolutionProcedure: false,
      needsMoreData: true,
      warnings: [
        "Puede ser necesario conocer densidad, viscosidad, solubilidad u otras propiedades.",
      ],
    };
  }

  return {
    type: "unknown",
    label: "Preparación no clasificada",
    explanation:
      "Todavía no hay información suficiente para determinar el tipo de mezcla.",
    canUseSolutionProcedure: false,
    needsMoreData: true,
    warnings: [],
  };
}

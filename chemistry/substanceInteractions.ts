import type { InteractionBehavior } from "./classifyMixture";
import { findExactSubstance } from "./substances";
import type { SubstanceInfo } from "./types";

export type ThermalBehavior =
  | "exothermic"
  | "endothermic"
  | "neutral"
  | "unknown";

export type SubstanceWaterInteraction = {
  formula: string;
  name: string;
  interaction: InteractionBehavior;
  description: string;
  thermalBehavior: ThermalBehavior;
  warning?: string;
};

export function getInteractionWithWater(
  formulaOrName: string,
): SubstanceWaterInteraction | null {
  const substance = findExactSubstance(formulaOrName);

  if (!substance) {
    return null;
  }

  return {
    formula: substance.formula,
    name: substance.name,
    interaction: mapSolubilityToInteraction(substance),
    description: getInteractionDescription(substance),
    thermalBehavior: mapThermalBehavior(substance.dissolutionBehavior),
    warning: getWarning(substance),
  };
}

function mapSolubilityToInteraction(
  substance: SubstanceInfo,
): InteractionBehavior {
  const classification = substance.waterSolubility?.classification;

  switch (classification) {
    case "verySoluble":
    case "soluble":
      return "soluble";

    case "slightlySoluble":
      return "partiallySoluble";

    case "practicallyInsoluble":
      return "insoluble";

    case "miscible":
      return "miscible";

    case "immiscible":
      return "immiscible";

    default:
      return "unknown";
  }
}

function mapThermalBehavior(
  behavior: SubstanceInfo["dissolutionBehavior"],
): ThermalBehavior {
  switch (behavior) {
    case "exothermic":
      return "exothermic";

    case "endothermic":
      return "endothermic";

    case "approximatelyNeutral":
      return "neutral";

    default:
      return "unknown";
  }
}

function getInteractionDescription(substance: SubstanceInfo): string {
  const description = substance.waterSolubility?.description;

  if (description) {
    return `${substance.name}: ${description}`;
  }

  return (
    `QuimiLab reconoce ${substance.name}, pero todavía ` +
    "no posee información suficiente sobre su comportamiento en agua."
  );
}

function getWarning(substance: SubstanceInfo): string | undefined {
  if (substance.thermalWarning) {
    return substance.thermalWarning;
  }

  if (substance.observations && substance.observations.length > 0) {
    return substance.observations.join(" ");
  }

  if (substance.risks && substance.risks.length > 0) {
    return substance.risks.join(" ");
  }

  return undefined;
}

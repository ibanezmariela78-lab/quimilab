import { FormulaParseError, parseFormula } from "@/chemistry/parseFormula";
import { getSubstanceInfo } from "@/chemistry/substances";
import type {
    ElementContribution,
    MolarMassCalculation,
} from "@/chemistry/types";
import { elementsBySymbol } from "@/data/elements";

export function calculateMolarMass(formula: string): MolarMassCalculation {
  try {
    const parsedFormula = parseFormula(formula);
    const warnings: string[] = [];
    const contributions: ElementContribution[] = [];

    for (const [symbol, count] of Object.entries(parsedFormula.composition)) {
      const element = elementsBySymbol.get(symbol);
      if (
        !element ||
        !element.hasStandardAtomicWeight ||
        element.atomicWeight === null
      ) {
        warnings.push(
          `${symbol} no posee un peso atómico estándar definido en la tabla utilizada.`,
        );
        continue;
      }

      contributions.push({
        symbol,
        name: element.name,
        spanishName: element.spanishName,
        count,
        atomicWeight: element.atomicWeight,
        contribution: count * element.atomicWeight,
      });
    }

    if (warnings.length > 0) {
      return {
        formula: parsedFormula.originalFormula,
        substanceName: getSubstanceInfo(parsedFormula.originalFormula)?.name,
        substanceInfo: getSubstanceInfo(parsedFormula.originalFormula),
        composition: parsedFormula.composition,
        elements: contributions,
        molarMass: null,
        warnings,
      };
    }

    return {
      formula: parsedFormula.originalFormula,
      substanceName: getSubstanceInfo(parsedFormula.originalFormula)?.name,
      substanceInfo: getSubstanceInfo(parsedFormula.originalFormula),
      composition: parsedFormula.composition,
      elements: contributions,
      molarMass: contributions.reduce(
        (total, item) => total + item.contribution,
        0,
      ),
      warnings,
    };
  } catch (error) {
    return {
      formula,
      composition: {},
      elements: [],
      molarMass: null,
      warnings: [],
      error:
        error instanceof FormulaParseError
          ? error.message
          : "No pudimos reconocer esta fórmula química. Revisá los símbolos y subíndices.",
    };
  }
}

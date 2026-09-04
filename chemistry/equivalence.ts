import type { SubstanceInfo } from "@/chemistry/types";

export type ReactionType = "acid-base";

export type AcidBaseEquivalence = {
  formula: string;
  reactionType: ReactionType;
  factor: number;
  explanation: string;
};

const acidBaseEquivalences: Record<string, AcidBaseEquivalence> = {
  HCl: {
    formula: "HCl",
    reactionType: "acid-base",
    factor: 1,
    explanation: "En una reacción ácido-base, HCl aporta un H+ por mol.",
  },
  HNO3: {
    formula: "HNO3",
    reactionType: "acid-base",
    factor: 1,
    explanation: "En una reacción ácido-base, HNO3 aporta un H+ por mol.",
  },
  H2SO4: {
    formula: "H2SO4",
    reactionType: "acid-base",
    factor: 2,
    explanation:
      "En una neutralización completa, H2SO4 puede aportar dos H+ por mol.",
  },
  NaOH: {
    formula: "NaOH",
    reactionType: "acid-base",
    factor: 1,
    explanation: "En una reacción ácido-base, NaOH aporta un OH- por mol.",
  },
  "Ca(OH)2": {
    formula: "Ca(OH)2",
    reactionType: "acid-base",
    factor: 2,
    explanation:
      "En una reacción ácido-base, Ca(OH)2 puede aportar dos OH- por mol.",
  },
  "Al(OH)3": {
    formula: "Al(OH)3",
    reactionType: "acid-base",
    factor: 3,
    explanation:
      "En una reacción ácido-base, Al(OH)3 puede aportar tres OH- por mol.",
  },
};

export function getAcidBaseEquivalence(
  formula: string,
): AcidBaseEquivalence | undefined {
  return acidBaseEquivalences[formula.replace(/\s+/gu, "")];
}

export function getSpecialSafetyMessage(
  formula: string,
  substanceInfo?: SubstanceInfo,
): string | undefined {
  const normalizedFormula = formula.replace(/\s+/gu, "");
  if (normalizedFormula === "HCl" || normalizedFormula === "H2SO4") {
    return "El cálculo teórico supone sustancia pura. En el laboratorio este reactivo suele encontrarse como solución comercial concentrada. Para preparar la solución real deben conocerse su concentración y densidad, y utilizar el módulo de diluciones/preparación desde reactivo comercial.";
  }
  return substanceInfo?.requiresTeacherSupervision
    ? "Esta sustancia requiere supervisión docente y condiciones de trabajo definidas por el laboratorio."
    : undefined;
}

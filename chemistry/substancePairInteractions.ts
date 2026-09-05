export type PairInteraction =
  | "miscible"
  | "immiscible"
  | "reactive"
  | "unknown";

export type SubstancePairInteraction = {
  component1: string;
  component2: string;
  interaction: PairInteraction;
  resultLabel: string;
  description: string;
  warning?: string;
};

const substancePairInteractions: SubstancePairInteraction[] = [
  {
    component1: "H2O",
    component2: "C2H5OH",
    interaction: "miscible",
    resultLabel: "Mezcla líquida homogénea",
    description:
      "El agua y el etanol son miscibles entre sí. Al mezclarse forman una sola fase líquida homogénea.",
    warning:
      "El etanol es inflamable y requiere las precauciones correspondientes durante su manipulación.",
  },
];

export function getSubstancePairInteraction(
  component1: string,
  component2: string,
): SubstancePairInteraction | null {
  const first = normalize(component1);
  const second = normalize(component2);

  const result = substancePairInteractions.find((item) => {
    const item1 = normalize(item.component1);
    const item2 = normalize(item.component2);

    return (
      (item1 === first && item2 === second) ||
      (item1 === second && item2 === first)
    );
  });

  return result ?? null;
}

function normalize(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, "")
    .replace(/\./g, "·")
    .toLocaleLowerCase();
}

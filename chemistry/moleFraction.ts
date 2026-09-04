import { parsePositiveNumber } from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";

export type MoleAmountUnit = "mol" | "g";

export type MoleFractionComponentInput = {
  identifier: string;
  amount: string;
  unit: MoleAmountUnit;
};

export type MoleFractionComponent = {
  identifier: string;
  amount: number;
  unit: MoleAmountUnit;
  moles: number;
  molesCalculation?: string;
  name?: string;
};

export type MoleFractionResult = {
  components: MoleFractionComponent[];
  totalMoles: number;
  fractions: number[];
};

export type MoleFractionError = { error: string };

export function calculateMoleFractions(
  inputs: MoleFractionComponentInput[],
): MoleFractionResult | MoleFractionError {
  if (inputs.length < 2) return { error: "Ingresá al menos dos componentes." };

  const components: MoleFractionComponent[] = [];
  for (const input of inputs) {
    const identifier = input.identifier.trim();
    if (!identifier)
      return { error: "Completá la fórmula o nombre de cada componente." };

    const amount = parsePositiveNumber(input.amount);
    if (amount === null)
      return { error: "Ingresá cantidades mayores que cero." };

    if (input.unit === "mol") {
      components.push({ identifier, amount, unit: input.unit, moles: amount });
      continue;
    }

    const molarMass = calculateMolarMass(identifier);
    if (molarMass.error || molarMass.molarMass === null) {
      return {
        error: `Necesitamos una fórmula reconocida para convertir gramos de ${identifier} a moles.`,
      };
    }
    components.push({
      identifier,
      amount,
      unit: input.unit,
      moles: amount / molarMass.molarMass,
      molesCalculation: `${format(amount)} / ${format(molarMass.molarMass)} = ${format(amount / molarMass.molarMass)} mol`,
      name: molarMass.substanceName,
    });
  }

  const totalMoles = components.reduce(
    (total, component) => total + component.moles,
    0,
  );
  return {
    components,
    totalMoles,
    fractions: components.map((component) => component.moles / totalMoles),
  };
}

function format(value: number): string {
  return value
    .toFixed(4)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

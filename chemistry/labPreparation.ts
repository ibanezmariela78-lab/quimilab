export type PreparationType =
  | "solidLiquidSolution"
  | "solidSolidMixture"
  | "liquidDilution"
  | "viscousPreparation";

export type SafetyLevel = "educational" | "supervision" | "highPrecaution";

export type PreparationInput = {
  type: PreparationType;
  finalAmount?: number;
  finalUnit?: "mL" | "L" | "g" | "kg";
  safetyLevel?: SafetyLevel;
};

export type PreparationPlan = {
  title: string;
  description: string;
  equipmentIds: string[];
  steps: string[];
  warnings: string[];
  canShowAutonomousProcedure: boolean;
};

export function createLabPreparationPlan(
  input: PreparationInput,
): PreparationPlan {
  const safetyLevel = input.safetyLevel ?? "educational";

  if (safetyLevel === "highPrecaution") {
    return {
      title: "Preparación con precauciones especiales",
      description:
        "El cálculo puede consultarse, pero esta preparación requiere condiciones especiales de laboratorio.",
      equipmentIds: [],
      steps: [],
      warnings: [
        "Esta preparación no debe realizarse de forma autónoma por estudiantes.",
        "Requiere supervisión docente, elementos de protección y evaluación previa de riesgos.",
      ],
      canShowAutonomousProcedure: false,
    };
  }

  switch (input.type) {
    case "solidLiquidSolution":
      return createSolidLiquidSolution(input);

    case "solidSolidMixture":
      return createSolidSolidMixture(input);

    case "liquidDilution":
      return createLiquidDilution(input);

    case "viscousPreparation":
      return createViscousPreparation(input);

    default:
      return {
        title: "Preparación no reconocida",
        description:
          "QuimiLab todavía no posee un procedimiento definido para este tipo de preparación.",
        equipmentIds: [],
        steps: [],
        warnings: [],
        canShowAutonomousProcedure: false,
      };
  }
}

function createSolidLiquidSolution(input: PreparationInput): PreparationPlan {
  const volumetricFlaskText =
    input.finalAmount && (input.finalUnit === "mL" || input.finalUnit === "L")
      ? `matraz aforado correspondiente al volumen final de ${formatAmount(
          input.finalAmount,
          input.finalUnit,
        )}`
      : "matraz aforado correspondiente al volumen final";

  return {
    title: "Preparación de un sólido en un líquido",
    description:
      "Procedimiento general para preparar una solución a partir de un soluto sólido y un solvente líquido.",
    equipmentIds: [
      "balance",
      "spatula",
      "weighing-container",
      "beaker",
      "glass-rod",
      "funnel",
      "volumetric-flask",
      "wash-bottle",
    ],
    steps: [
      "Reuní todos los materiales necesarios antes de comenzar.",
      "Colocá el recipiente para pesada sobre la balanza.",
      "Tará la balanza.",
      "Pesá la cantidad de soluto calculada por QuimiLab.",
      "Colocá en un vaso de precipitados una cantidad de solvente menor al volumen final de la preparación.",
      "Agregá cuidadosamente el soluto al vaso de precipitados.",
      "Mezclá con una varilla de vidrio hasta lograr la disolución, siempre que la sustancia sea soluble en ese solvente.",
      `Transferí la preparación al ${volumetricFlaskText}.`,
      "Enjuagá el vaso de precipitados con pequeñas cantidades de solvente y agregá esos lavados al matraz.",
      "Agregá solvente hasta acercarte a la marca de volumen final.",
      "Ajustá cuidadosamente el menisco hasta la marca.",
      "Tapá y homogeneizá la preparación.",
      "Rotulá el recipiente indicando sustancia, concentración y fecha.",
    ],
    warnings:
      input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : [],
    canShowAutonomousProcedure: true,
  };
}

function createSolidSolidMixture(input: PreparationInput): PreparationPlan {
  return {
    title: "Preparación de una mezcla sólido–sólido",
    description:
      "Procedimiento general para pesar y homogeneizar dos o más componentes sólidos.",
    equipmentIds: ["balance", "spatula", "weighing-container", "mortar-pestle"],
    steps: [
      "Reuní los materiales necesarios.",
      "Colocá un recipiente para pesada sobre la balanza.",
      "Tará la balanza.",
      "Pesá por separado cada componente sólido según las cantidades calculadas.",
      "Transferí los sólidos a un recipiente limpio y seco.",
      "Si corresponde, utilizá mortero y pilón para reducir el tamaño de partícula y favorecer la homogeneización.",
      "Mezclá los componentes hasta obtener una distribución lo más uniforme posible.",
      "Transferí la mezcla al recipiente final.",
      "Rotulá la preparación indicando componentes, proporciones y fecha.",
    ],
    warnings:
      input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : [],
    canShowAutonomousProcedure: true,
  };
}

function createLiquidDilution(input: PreparationInput): PreparationPlan {
  const finalVolumeText =
    input.finalAmount && (input.finalUnit === "mL" || input.finalUnit === "L")
      ? formatAmount(input.finalAmount, input.finalUnit)
      : "el volumen final indicado";

  return {
    title: "Dilución de una solución",
    description:
      "Procedimiento general para preparar una solución menos concentrada a partir de una solución madre.",
    equipmentIds: [
      "volumetric-pipette",
      "pipette-filler",
      "volumetric-flask",
      "wash-bottle",
    ],
    steps: [
      "Reuní el material volumétrico necesario.",
      "Medí el volumen de solución madre calculado por QuimiLab utilizando material volumétrico adecuado.",
      "Utilizá propipeta cuando la transferencia se realice con pipeta.",
      "Transferí la solución madre al matraz aforado.",
      "Agregá solvente hasta acercarte al volumen final.",
      `Ajustá cuidadosamente el volumen hasta alcanzar ${finalVolumeText}.`,
      "Tapá y homogeneizá la solución.",
      "Rotulá la preparación indicando sustancia, concentración y fecha.",
    ],
    warnings: [
      "El volumen final no debe interpretarse como la cantidad de solvente que hay que agregar.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function createViscousPreparation(input: PreparationInput): PreparationPlan {
  return {
    title: "Preparación con sustancias viscosas",
    description:
      "Procedimiento general para trabajar con líquidos viscosos o materiales semisólidos.",
    equipmentIds: [
      "balance",
      "weighing-container",
      "spatula",
      "beaker",
      "glass-rod",
    ],
    steps: [
      "Reuní los materiales necesarios.",
      "Verificá si la preparación debe realizarse por masa o por volumen.",
      "Cuando la viscosidad dificulte una medición volumétrica precisa, utilizá masa si el método de la experiencia lo permite.",
      "Pesá o medí cada componente según el cálculo realizado.",
      "Transferí los componentes a un recipiente adecuado.",
      "Mezclá lentamente hasta lograr la homogeneidad posible para esa preparación.",
      "Observá si quedan fases separadas o material sin incorporar.",
      "Transferí al recipiente final y rotulá la preparación.",
    ],
    warnings: [
      "No debe suponerse que el volumen y la masa son equivalentes.",
      "Para convertir masa y volumen se necesita conocer la densidad de la sustancia.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function formatAmount(value: number, unit: "mL" | "L" | "g" | "kg"): string {
  return `${value} ${unit}`;
}

import type { MixtureType } from "./classifyMixture";

export type PreparationType =
  | "solidLiquidSolution"
  | "solidSolidMixture"
  | "liquidDilution"
  | "viscousPreparation"
  | "liquidLiquidMixture";

export type SafetyLevel = "educational" | "supervision" | "highPrecaution";

export type LiquidLiquidBehavior = "miscible" | "immiscible" | "unknown";

export type PreparationInput = {
  type: PreparationType;
  finalAmount?: number;
  finalUnit?: "mL" | "L" | "g" | "kg";
  safetyLevel?: SafetyLevel;
  mixtureType?: MixtureType;
  liquidLiquidBehavior?: LiquidLiquidBehavior;
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
        "QuimiLab puede analizar teóricamente la preparación, pero no mostrará un procedimiento autónomo porque al menos una de las sustancias requiere precauciones especiales.",
      equipmentIds: [],
      steps: [],
      warnings: [
        "Esta preparación no debe realizarse de forma autónoma por estudiantes.",
        "Requiere supervisión docente, elementos de protección adecuados y evaluación previa de riesgos.",
      ],
      canShowAutonomousProcedure: false,
    };
  }

  switch (input.type) {
    case "solidLiquidSolution":
      return createSolidLiquidPreparation(input);

    case "solidSolidMixture":
      return createSolidSolidMixture(input);

    case "liquidDilution":
      return createLiquidDilution(input);

    case "viscousPreparation":
      return createViscousPreparation(input);

    case "liquidLiquidMixture":
      return createLiquidLiquidPreparation(input);

    default:
      return createUnknownPreparation();
  }
}

function createSolidLiquidPreparation(
  input: PreparationInput,
): PreparationPlan {
  switch (input.mixtureType) {
    case "suspension":
      return createSolidLiquidSuspension(input);

    case "dispersion":
      return createSolidLiquidDispersion(input);

    case "unknown":
      return createUnknownSolidLiquidPreparation();

    case "solution":
    case undefined:
      return createSolidLiquidSolution(input);

    default:
      return createUnknownSolidLiquidPreparation();
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
    title: "Preparación de una solución sólido + líquido",
    description:
      "El soluto es soluble en el líquido, por lo que puede utilizarse un procedimiento de disolución y ajuste del volumen final.",
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
      "Mezclá con una varilla de vidrio hasta lograr la disolución, siempre que las condiciones de la experiencia lo permitan.",
      `Transferí la solución al ${volumetricFlaskText}.`,
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

function createSolidLiquidSuspension(input: PreparationInput): PreparationPlan {
  const amountText =
    input.finalAmount && input.finalUnit
      ? formatAmount(input.finalAmount, input.finalUnit)
      : null;

  return {
    title: "Preparación de una suspensión",
    description:
      "El sólido es prácticamente insoluble en el líquido. Las partículas quedan dispersas y pueden sedimentar con el tiempo.",
    equipmentIds: [
      "balance",
      "spatula",
      "weighing-container",
      "beaker",
      "glass-rod",
      "graduated-cylinder",
    ],
    steps: [
      "Reuní los materiales necesarios antes de comenzar.",
      "Colocá el recipiente para pesada sobre la balanza.",
      "Tará la balanza.",
      "Pesá la cantidad de sólido indicada por el cálculo o por la experiencia.",
      "Medí la cantidad de líquido requerida utilizando material adecuado.",
      "Colocá una parte del líquido en un vaso de precipitados.",
      "Agregá gradualmente el sólido mientras mezclás con una varilla de vidrio.",
      "Continuá mezclando hasta distribuir las partículas de la forma más uniforme posible.",
      "Observá el aspecto de la preparación y verificá si aparecen partículas visibles o sedimentación.",
      amountText
        ? `Prepará la cantidad indicada de ${amountText} siguiendo el método específico de la experiencia.`
        : "Ajustá las cantidades según el método específico de la experiencia.",
      "Transferí la suspensión al recipiente final adecuado.",
      "Homogeneizá nuevamente antes de observar, utilizar o tomar una muestra.",
      "Rotulá el recipiente indicando los componentes, concentración o proporción y fecha.",
    ],
    warnings: [
      "Esta preparación es una suspensión, no una solución homogénea.",
      "No debe indicarse “mezclar hasta disolver”, porque el sólido es prácticamente insoluble.",
      "Las partículas pueden sedimentar y puede ser necesario homogeneizar antes de utilizar la preparación.",
      "No se utiliza un matraz aforado como regla general para preparar suspensiones.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function createSolidLiquidDispersion(input: PreparationInput): PreparationPlan {
  return {
    title: "Preparación de una dispersión",
    description:
      "La sustancia presenta solubilidad limitada o comportamiento de dispersión. Puede quedar material sin disolver.",
    equipmentIds: [
      "balance",
      "spatula",
      "weighing-container",
      "beaker",
      "glass-rod",
      "graduated-cylinder",
    ],
    steps: [
      "Reuní los materiales necesarios.",
      "Pesá o medí los componentes según las cantidades indicadas.",
      "Colocá el líquido en un recipiente adecuado.",
      "Agregá gradualmente el componente sólido mientras mezclás.",
      "Homogeneizá la preparación.",
      "Observá si queda material sin disolver o si aparecen partículas dispersas.",
      "Transferí al recipiente final correspondiente.",
      "Rotulá la preparación.",
    ],
    warnings: [
      "No debe suponerse que todo el sólido se disolverá.",
      "La preparación puede requerir agitación antes de utilizarse.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function createUnknownSolidLiquidPreparation(): PreparationPlan {
  return {
    title: "Preparación pendiente de clasificación",
    description:
      "QuimiLab necesita información sobre la solubilidad de la sustancia antes de decidir si corresponde una solución, suspensión u otro tipo de preparación.",
    equipmentIds: [],
    steps: [],
    warnings: [
      "No se generará un procedimiento hasta conocer el comportamiento de la sustancia en el líquido.",
      "No debe suponerse que un sólido se disuelve solamente porque se mezcla con un líquido.",
    ],
    canShowAutonomousProcedure: false,
  };
}

function createSolidSolidMixture(input: PreparationInput): PreparationPlan {
  return {
    title: "Preparación de una mezcla sólido + sólido",
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

function createLiquidLiquidPreparation(
  input: PreparationInput,
): PreparationPlan {
  switch (input.liquidLiquidBehavior) {
    case "miscible":
      return createMiscibleLiquidMixture(input);

    case "immiscible":
      return createImmiscibleLiquidMixture(input);

    default:
      return createUnknownLiquidMixture();
  }
}

function createMiscibleLiquidMixture(input: PreparationInput): PreparationPlan {
  return {
    title: "Preparación de una mezcla líquida homogénea",
    description:
      "Los líquidos son miscibles entre sí y pueden formar una sola fase líquida homogénea.",
    equipmentIds: ["graduated-cylinder", "beaker", "glass-rod"],
    steps: [
      "Reuní los materiales necesarios.",
      "Medí cada componente líquido utilizando material adecuado para la precisión requerida.",
      "Transferí los componentes a un vaso de precipitados limpio.",
      "Mezclá suavemente con una varilla de vidrio hasta obtener una distribución uniforme.",
      "Observá la preparación y verificá que se mantenga una única fase líquida.",
      "Transferí la mezcla al recipiente final adecuado.",
      "Rotulá indicando componentes, proporciones y fecha.",
    ],
    warnings: [
      "Que dos líquidos sean miscibles no significa que sus volúmenes deban considerarse perfectamente aditivos.",
      "Si se necesita un volumen final exacto, deberá utilizarse el procedimiento volumétrico específico correspondiente.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function createImmiscibleLiquidMixture(
  input: PreparationInput,
): PreparationPlan {
  return {
    title: "Preparación de una mezcla líquida heterogénea",
    description:
      "Los líquidos son inmiscibles y tienden a formar fases separadas.",
    equipmentIds: ["graduated-cylinder", "beaker", "glass-rod"],
    steps: [
      "Reuní los materiales necesarios.",
      "Medí cada componente líquido por separado.",
      "Transferí ambos líquidos a un recipiente adecuado.",
      "Mezclá suavemente si la experiencia requiere observar su comportamiento.",
      "Observá la formación y separación de fases.",
      "Registrá las características visibles de la mezcla.",
      "Rotulá el recipiente indicando los componentes y la fecha.",
    ],
    warnings: [
      "Esta preparación es una mezcla líquida heterogénea.",
      "No debe describirse automáticamente como una emulsión.",
      "Una emulsión requiere una dispersión de un líquido en otro y condiciones específicas de formación o estabilización.",
      ...(input.safetyLevel === "supervision"
        ? ["Esta preparación requiere supervisión docente."]
        : []),
    ],
    canShowAutonomousProcedure: true,
  };
}

function createUnknownLiquidMixture(): PreparationPlan {
  return {
    title: "Interacción entre líquidos no determinada",
    description:
      "QuimiLab reconoce que ambos componentes son líquidos, pero necesita conocer su miscibilidad antes de generar un procedimiento.",
    equipmentIds: [],
    steps: [],
    warnings: [
      "No se asumirá que dos líquidos son miscibles solamente porque pueden mezclarse físicamente.",
      "QuimiLab necesita información específica sobre la interacción entre ambos componentes.",
    ],
    canShowAutonomousProcedure: false,
  };
}

function createUnknownPreparation(): PreparationPlan {
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

function formatAmount(value: number, unit: "mL" | "L" | "g" | "kg"): string {
  return `${value} ${unit}`;
}

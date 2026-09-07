export type ConcentrationUnit =
  | "molarity"
  | "molality"
  | "normality"
  | "percentMassMass"
  | "percentMassVolume"
  | "gPerLiter"
  | "ppmMass"
  | "ppbMass";

export type ConcentrationConversionInput = {
  value: number;
  from: ConcentrationUnit;
  to: ConcentrationUnit;

  /**
   * Masa molar del soluto en g/mol.
   * Necesaria para conversiones que involucren cantidad de sustancia.
   */
  molarMass?: number;

  /**
   * Densidad de la solución en g/mL.
   * Necesaria para conversiones entre bases de masa y volumen
   * cuando no existe una relación directa.
   */
  solutionDensity?: number;

  /**
   * Factor de equivalencia para normalidad.
   * Ejemplo:
   * NaOH en neutralización ácido-base -> 1
   * H2SO4 en neutralización completa -> 2
   */
  equivalenceFactor?: number;
};

export type ConcentrationConversionResult =
  | {
      success: true;
      value: number;
      from: ConcentrationUnit;
      to: ConcentrationUnit;
      explanation: string[];
      warnings: string[];
      requiredData: [];
    }
  | {
      success: false;
      value: null;
      from: ConcentrationUnit;
      to: ConcentrationUnit;
      explanation: string[];
      warnings: string[];
      requiredData: string[];
    };

export function convertConcentration(
  input: ConcentrationConversionInput,
): ConcentrationConversionResult {
  const validation = validateInput(input);

  if (!validation.success) {
    return validation;
  }

  const { value, from, to, molarMass, solutionDensity, equivalenceFactor } =
    input;

  if (from === to) {
    return successResult(
      value,
      from,
      to,
      ["La unidad de origen y la unidad de destino son iguales."],
      [],
    );
  }

  // Molaridad <-> g/L
  if (from === "molarity" && to === "gPerLiter") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir molaridad a g/L se necesita conocer la masa molar.",
      );
    }

    const result = value * molarMass;

    return successResult(
      result,
      from,
      to,
      [
        "La molaridad expresa moles de soluto por litro de solución.",
        "Se multiplica la cantidad de moles por la masa molar del soluto.",
      ],
      [],
    );
  }

  if (from === "gPerLiter" && to === "molarity") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir g/L a molaridad se necesita conocer la masa molar.",
      );
    }

    const result = value / molarMass;

    return successResult(
      result,
      from,
      to,
      [
        "Se divide la concentración en g/L por la masa molar del soluto.",
        "El resultado representa moles de soluto por litro de solución.",
      ],
      [],
    );
  }

  // Molaridad <-> % m/v
  if (from === "molarity" && to === "percentMassVolume") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir molaridad a % m/v se necesita conocer la masa molar.",
      );
    }

    const result = (value * molarMass) / 10;

    return successResult(
      result,
      from,
      to,
      [
        "Primero se obtiene la masa de soluto presente en un litro de solución.",
        "Luego se expresa esa masa por cada 100 mL de solución.",
      ],
      [],
    );
  }

  if (from === "percentMassVolume" && to === "molarity") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir % m/v a molaridad se necesita conocer la masa molar.",
      );
    }

    const result = (value * 10) / molarMass;

    return successResult(
      result,
      from,
      to,
      [
        "Un porcentaje m/v expresa gramos de soluto por cada 100 mL de solución.",
        "Se lleva esa cantidad a gramos por litro y luego se divide por la masa molar.",
      ],
      [],
    );
  }

  // g/L <-> % m/v
  if (from === "gPerLiter" && to === "percentMassVolume") {
    const result = value / 10;

    return successResult(
      result,
      from,
      to,
      [
        "Un litro contiene 1000 mL.",
        "Para expresar gramos por cada 100 mL se divide el valor en g/L por 10.",
      ],
      [],
    );
  }

  if (from === "percentMassVolume" && to === "gPerLiter") {
    const result = value * 10;

    return successResult(
      result,
      from,
      to,
      [
        "El porcentaje m/v indica gramos de soluto por cada 100 mL de solución.",
        "Para obtener gramos por litro se multiplica por 10.",
      ],
      [],
    );
  }

  // Molaridad <-> Normalidad
  if (from === "molarity" && to === "normality") {
    if (!equivalenceFactor) {
      return missingDataResult(
        from,
        to,
        ["factor de equivalencia"],
        "La normalidad depende de la reacción química y no puede calcularse sin conocer el factor de equivalencia.",
      );
    }

    const result = value * equivalenceFactor;

    return successResult(
      result,
      from,
      to,
      [
        "La normalidad depende del número de equivalentes químicos que participa en la reacción.",
        "Se multiplica la molaridad por el factor de equivalencia correspondiente.",
      ],
      [
        "El factor de equivalencia depende de la reacción considerada. No debe asumirse automáticamente.",
      ],
    );
  }

  if (from === "normality" && to === "molarity") {
    if (!equivalenceFactor) {
      return missingDataResult(
        from,
        to,
        ["factor de equivalencia"],
        "La normalidad depende de la reacción química y no puede convertirse a molaridad sin conocer el factor de equivalencia.",
      );
    }

    const result = value / equivalenceFactor;

    return successResult(
      result,
      from,
      to,
      [
        "Se divide la normalidad por el factor de equivalencia correspondiente a la reacción.",
      ],
      ["La normalidad es dependiente de la reacción química."],
    );
  }

  // Molaridad <-> % m/m
  if (from === "molarity" && to === "percentMassMass") {
    const missing: string[] = [];

    if (!molarMass) {
      missing.push("masa molar del soluto");
    }

    if (!solutionDensity) {
      missing.push("densidad de la solución");
    }

    if (missing.length > 0) {
      return missingDataResult(
        from,
        to,
        missing,
        "Para relacionar molaridad con % m/m se necesita conocer tanto la masa molar como la densidad de la solución.",
      );
    }

    const result =
      (value * (molarMass as number)) / (10 * (solutionDensity as number));

    return successResult(
      result,
      from,
      to,
      [
        "La molaridad se convierte primero en masa de soluto por litro de solución.",
        "La densidad permite conocer la masa total de ese litro de solución.",
        "Con ambas masas se calcula el porcentaje m/m.",
      ],
      [],
    );
  }

  if (from === "percentMassMass" && to === "molarity") {
    const missing: string[] = [];

    if (!molarMass) {
      missing.push("masa molar del soluto");
    }

    if (!solutionDensity) {
      missing.push("densidad de la solución");
    }

    if (missing.length > 0) {
      return missingDataResult(
        from,
        to,
        missing,
        "Para convertir % m/m a molaridad se necesita conocer la masa molar y la densidad de la solución.",
      );
    }

    const result =
      (10 * (solutionDensity as number) * value) / (molarMass as number);

    return successResult(
      result,
      from,
      to,
      [
        "La densidad permite relacionar la masa de la solución con su volumen.",
        "Luego la masa de soluto se convierte a moles mediante la masa molar.",
      ],
      [],
    );
  }

  // Molalidad <-> % m/m
  if (from === "molality" && to === "percentMassMass") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir molalidad a % m/m se necesita conocer la masa molar.",
      );
    }

    const soluteMass = value * molarMass;
    const totalMass = 1000 + soluteMass;
    const result = (soluteMass / totalMass) * 100;

    return successResult(
      result,
      from,
      to,
      [
        "Se toma como base 1 kg de solvente.",
        "La molalidad indica cuántos moles de soluto hay en ese kilogramo de solvente.",
        "Los moles se convierten en masa y luego se calcula el porcentaje respecto de la masa total.",
      ],
      [],
    );
  }

  if (from === "percentMassMass" && to === "molality") {
    if (!molarMass) {
      return missingDataResult(
        from,
        to,
        ["masa molar del soluto"],
        "Para convertir % m/m a molalidad se necesita conocer la masa molar.",
      );
    }

    if (value >= 100) {
      return failureResult(
        from,
        to,
        [
          "El porcentaje m/m debe ser menor que 100 para calcular una molalidad con una cantidad distinta de cero de solvente.",
        ],
        [],
      );
    }

    const result = (1000 * value) / (molarMass * (100 - value));

    return successResult(
      result,
      from,
      to,
      [
        "Se toma una base de 100 g de solución.",
        "El porcentaje indica la masa de soluto y la diferencia hasta 100 g corresponde a la masa de solvente.",
        "La masa de soluto se convierte en moles y se relaciona con los kilogramos de solvente.",
      ],
      [],
    );
  }

  // Molaridad <-> Molalidad
  if (from === "molarity" && to === "molality") {
    const missing: string[] = [];

    if (!molarMass) {
      missing.push("masa molar del soluto");
    }

    if (!solutionDensity) {
      missing.push("densidad de la solución");
    }

    if (missing.length > 0) {
      return missingDataResult(
        from,
        to,
        missing,
        "Para convertir molaridad a molalidad se necesita conocer la masa molar del soluto y la densidad de la solución.",
      );
    }

    const solventMass =
      1000 * (solutionDensity as number) - value * (molarMass as number);

    if (solventMass <= 0) {
      return failureResult(
        from,
        to,
        [
          "Los datos ingresados producen una masa de solvente igual o menor que cero.",
          "Revisá la concentración, la masa molar o la densidad.",
        ],
        [],
      );
    }

    const result = (1000 * value) / solventMass;

    return successResult(
      result,
      from,
      to,
      [
        "Se toma como base 1 litro de solución.",
        "La densidad permite obtener la masa total de ese litro.",
        "La masa del soluto se obtiene mediante la molaridad y la masa molar.",
        "La diferencia corresponde a la masa de solvente.",
      ],
      [],
    );
  }

  if (from === "molality" && to === "molarity") {
    const missing: string[] = [];

    if (!molarMass) {
      missing.push("masa molar del soluto");
    }

    if (!solutionDensity) {
      missing.push("densidad de la solución");
    }

    if (missing.length > 0) {
      return missingDataResult(
        from,
        to,
        missing,
        "Para convertir molalidad a molaridad se necesita conocer la masa molar del soluto y la densidad de la solución.",
      );
    }

    const result =
      (1000 * value * (solutionDensity as number)) /
      (1000 + value * (molarMass as number));

    return successResult(
      result,
      from,
      to,
      [
        "Se toma como base 1 kg de solvente.",
        "La molalidad permite conocer los moles y la masa del soluto.",
        "La densidad permite relacionar la masa total obtenida con el volumen de la solución.",
      ],
      [],
    );
  }

  // % m/m <-> ppm masa
  if (from === "percentMassMass" && to === "ppmMass") {
    const result = value * 10000;

    return successResult(
      result,
      from,
      to,
      [
        "El porcentaje m/m representa partes por cien.",
        "Las ppm representan partes por millón.",
      ],
      [],
    );
  }

  if (from === "ppmMass" && to === "percentMassMass") {
    const result = value / 10000;

    return successResult(
      result,
      from,
      to,
      [
        "Las ppm en base masa pueden convertirse directamente a porcentaje m/m.",
      ],
      [],
    );
  }

  // % m/m <-> ppb masa
  if (from === "percentMassMass" && to === "ppbMass") {
    const result = value * 10000000;

    return successResult(
      result,
      from,
      to,
      [
        "El porcentaje m/m representa partes por cien.",
        "Las ppb representan partes por mil millones.",
      ],
      [],
    );
  }

  if (from === "ppbMass" && to === "percentMassMass") {
    const result = value / 10000000;

    return successResult(
      result,
      from,
      to,
      [
        "Las ppb en base masa pueden convertirse directamente a porcentaje m/m.",
      ],
      [],
    );
  }

  // ppm <-> ppb, ambas en base masa
  if (from === "ppmMass" && to === "ppbMass") {
    return successResult(
      value * 1000,
      from,
      to,
      [
        "1 ppm equivale a 1000 ppb cuando ambas expresiones utilizan la misma base de masa.",
      ],
      [],
    );
  }

  if (from === "ppbMass" && to === "ppmMass") {
    return successResult(
      value / 1000,
      from,
      to,
      [
        "1000 ppb equivalen a 1 ppm cuando ambas expresiones utilizan la misma base de masa.",
      ],
      [],
    );
  }

  return failureResult(
    from,
    to,
    [
      "QuimiLab todavía no realiza esta conversión de forma automática.",
      "La conversión puede requerir información adicional sobre la composición o las propiedades físicas de la solución.",
    ],
    ["No se realizó ninguna aproximación automática."],
  );
}

function validateInput(
  input: ConcentrationConversionInput,
): ConcentrationConversionResult | { success: true } {
  if (!Number.isFinite(input.value) || input.value < 0) {
    return failureResult(
      input.from,
      input.to,
      ["La concentración debe ser un número válido mayor o igual que cero."],
      [],
    );
  }

  if (
    input.molarMass !== undefined &&
    (!Number.isFinite(input.molarMass) || input.molarMass <= 0)
  ) {
    return failureResult(
      input.from,
      input.to,
      ["La masa molar debe ser un número válido mayor que cero."],
      [],
    );
  }

  if (
    input.solutionDensity !== undefined &&
    (!Number.isFinite(input.solutionDensity) || input.solutionDensity <= 0)
  ) {
    return failureResult(
      input.from,
      input.to,
      ["La densidad de la solución debe ser un número válido mayor que cero."],
      [],
    );
  }

  if (
    input.equivalenceFactor !== undefined &&
    (!Number.isFinite(input.equivalenceFactor) || input.equivalenceFactor <= 0)
  ) {
    return failureResult(
      input.from,
      input.to,
      ["El factor de equivalencia debe ser un número válido mayor que cero."],
      [],
    );
  }

  return { success: true };
}

function successResult(
  value: number,
  from: ConcentrationUnit,
  to: ConcentrationUnit,
  explanation: string[],
  warnings: string[],
): ConcentrationConversionResult {
  return {
    success: true,
    value,
    from,
    to,
    explanation,
    warnings,
    requiredData: [],
  };
}

function missingDataResult(
  from: ConcentrationUnit,
  to: ConcentrationUnit,
  requiredData: string[],
  explanation: string,
): ConcentrationConversionResult {
  return {
    success: false,
    value: null,
    from,
    to,
    explanation: [explanation],
    warnings: [
      "QuimiLab no realizará la conversión suponiendo datos que no fueron proporcionados.",
    ],
    requiredData,
  };
}

function failureResult(
  from: ConcentrationUnit,
  to: ConcentrationUnit,
  explanation: string[],
  warnings: string[],
): ConcentrationConversionResult {
  return {
    success: false,
    value: null,
    from,
    to,
    explanation,
    warnings,
    requiredData: [],
  };
}

export function getConcentrationUnitLabel(unit: ConcentrationUnit): string {
  const labels: Record<ConcentrationUnit, string> = {
    molarity: "Molaridad (mol/L)",
    molality: "Molalidad (mol/kg)",
    normality: "Normalidad (eq/L)",
    percentMassMass: "% m/m",
    percentMassVolume: "% m/v",
    gPerLiter: "g/L",
    ppmMass: "ppm (m/m)",
    ppbMass: "ppb (m/m)",
  };

  return labels[unit];
}

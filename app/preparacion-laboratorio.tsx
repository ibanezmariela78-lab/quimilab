import { Stack } from "expo-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createLabPreparationPlan,
    type PreparationPlan,
    type SafetyLevel,
} from "../chemistry/labPreparation";

import { classifyMixture } from "../chemistry/classifyMixture";

import {
    calculateConcentrationPreparation,
    calculateTracePreparation,
    getConcentrationMethodLabel,
    getConcentrationUnit,
    type ConcentrationMethod,
    type ConcentrationPreparationResponse,
    type TracePreparationResponse,
} from "../chemistry/concentrationPreparation";

import { inferPreparationType } from "../chemistry/inferPreparationType";
import { getInteractionWithWater } from "../chemistry/substanceInteractions";
import { getSubstancePairInteraction } from "../chemistry/substancePairInteractions";

import {
    findExactSubstance,
    type SubstanceRecord,
} from "../chemistry/substances";

import { labEquipment } from "../data/labEquipment";

type PreparationObjective = "combineComponents" | "dilution";

type PreparationConcentrationMethod = ConcentrationMethod | "ppm" | "ppb";

type TracePreparationMode = "dilute-aqueous" | "mass-mass";

export default function PreparacionLaboratorioScreen() {
  const [component1Input, setComponent1Input] = useState("CaCl2");

  const [component2Input, setComponent2Input] = useState("H2O");

  const [objective, setObjective] =
    useState<PreparationObjective>("combineComponents");

  const [cantidadFinal, setCantidadFinal] = useState("500");

  const [unidadFinal, setUnidadFinal] = useState<"mL" | "L" | "g" | "kg">("mL");

  const [concentrationMethod, setConcentrationMethod] =
    useState<PreparationConcentrationMethod>("molarity");

  const [concentrationInput, setConcentrationInput] = useState("0,5");

  const [solventMassInput, setSolventMassInput] = useState("500");

  const [solventMassUnit, setSolventMassUnit] = useState<"g" | "kg">("g");

  const [finalMassInput, setFinalMassInput] = useState("500");

  const [finalMassUnit, setFinalMassUnit] = useState<"g" | "kg">("g");

  const [traceMode, setTraceMode] =
    useState<TracePreparationMode>("dilute-aqueous");

  const cantidadNumerica = Number(cantidadFinal.replace(",", "."));

  const component1 = useMemo(() => {
    if (!component1Input.trim()) {
      return null;
    }

    return findExactSubstance(component1Input) ?? null;
  }, [component1Input]);

  const component2 = useMemo(() => {
    if (!component2Input.trim()) {
      return null;
    }

    return findExactSubstance(component2Input) ?? null;
  }, [component2Input]);

  const pairInteraction = useMemo(() => {
    if (!component1 || !component2) {
      return null;
    }

    return getSubstancePairInteraction(component1.formula, component2.formula);
  }, [component1, component2]);

  const safetyLevel = useMemo<SafetyLevel>(() => {
    const levels = [
      component1?.safetyClassification,
      component2?.safetyClassification,
    ];

    if (levels.includes("highPrecaution")) {
      return "highPrecaution";
    }

    if (levels.includes("requiresSupervision")) {
      return "supervision";
    }

    return "educational";
  }, [component1, component2]);

  const automaticPreparation = useMemo(() => {
    return inferPreparationType({
      substance: component1,
      secondSubstance: component2,
      isDilution: objective === "dilution",
      pairInteraction: pairInteraction?.interaction ?? null,
    });
  }, [component1, component2, objective, pairInteraction]);

  const waterBasedInteraction = useMemo(() => {
    if (!component1 || !component2) {
      return null;
    }

    const component1IsWater = component1.formula === "H2O";

    const component2IsWater = component2.formula === "H2O";

    if (component1IsWater && !component2IsWater) {
      return getInteractionWithWater(component2.formula);
    }

    if (component2IsWater && !component1IsWater) {
      return getInteractionWithWater(component1.formula);
    }

    return null;
  }, [component1, component2]);

  const mixtureAnalysis = useMemo(() => {
    if (!component1 || !component2 || !waterBasedInteraction) {
      return null;
    }

    const state1 = component1.physicalState;
    const state2 = component2.physicalState;

    if (
      state1 !== "solid" &&
      state1 !== "liquid" &&
      state1 !== "viscousLiquid" &&
      state1 !== "semisolid"
    ) {
      return null;
    }

    if (
      state2 !== "solid" &&
      state2 !== "liquid" &&
      state2 !== "viscousLiquid" &&
      state2 !== "semisolid"
    ) {
      return null;
    }

    return classifyMixture({
      component1State: state1,
      component2State: state2,
      interaction: waterBasedInteraction.interaction,
    });
  }, [component1, component2, waterBasedInteraction]);

  const liquidLiquidBehavior = useMemo(() => {
    if (!pairInteraction) {
      return "unknown" as const;
    }

    if (pairInteraction.interaction === "miscible") {
      return "miscible" as const;
    }

    if (pairInteraction.interaction === "immiscible") {
      return "immiscible" as const;
    }

    return "unknown" as const;
  }, [pairInteraction]);

  const aqueousSolidSolute = useMemo(() => {
    if (
      !component1 ||
      !component2 ||
      objective !== "combineComponents" ||
      mixtureAnalysis?.type !== "solution"
    ) {
      return null;
    }

    if (component1.formula === "H2O" && component2.physicalState === "solid") {
      return component2;
    }

    if (component2.formula === "H2O" && component1.physicalState === "solid") {
      return component1;
    }

    return null;
  }, [component1, component2, objective, mixtureAnalysis]);

  const isLiquidLiquid =
    component1?.physicalState === "liquid" &&
    component2?.physicalState === "liquid";

  const percentageComponent = useMemo(() => {
    if (aqueousSolidSolute) {
      return aqueousSolidSolute;
    }

    if (!isLiquidLiquid || !component1 || !component2) {
      return null;
    }

    if (component1.formula === "H2O") {
      return component2;
    }

    if (component2.formula === "H2O") {
      return component1;
    }

    return component1;
  }, [aqueousSolidSolute, isLiquidLiquid, component1, component2]);

  const otherComponent = useMemo(() => {
    if (!percentageComponent || !component1 || !component2) {
      return null;
    }

    if (percentageComponent.formula === component1.formula) {
      return component2;
    }

    return component1;
  }, [percentageComponent, component1, component2]);

  const availableMethods = useMemo<PreparationConcentrationMethod[]>(() => {
    if (aqueousSolidSolute) {
      return [
        "molarity",
        "molality",
        "normality",
        "massMassPercentage",
        "massVolumePercentage",
        "ppm",
        "ppb",
      ];
    }

    if (isLiquidLiquid && pairInteraction?.interaction === "miscible") {
      return ["volumeVolumePercentage"];
    }

    return [];
  }, [aqueousSolidSolute, isLiquidLiquid, pairInteraction]);

  useEffect(() => {
    if (
      availableMethods.length > 0 &&
      !availableMethods.includes(concentrationMethod)
    ) {
      setConcentrationMethod(availableMethods[0]);
    }
  }, [availableMethods, concentrationMethod]);

  useEffect(() => {
    const requiresVolume =
      concentrationMethod === "molarity" ||
      concentrationMethod === "normality" ||
      concentrationMethod === "massVolumePercentage" ||
      concentrationMethod === "volumeVolumePercentage" ||
      ((concentrationMethod === "ppm" || concentrationMethod === "ppb") &&
        traceMode === "dilute-aqueous");

    if (requiresVolume && unidadFinal !== "mL" && unidadFinal !== "L") {
      setUnidadFinal("mL");
    }
  }, [concentrationMethod, traceMode, unidadFinal]);

  const isTraceMethod =
    concentrationMethod === "ppm" || concentrationMethod === "ppb";

  const concentrationCalculation =
    useMemo<ConcentrationPreparationResponse | null>(() => {
      if (
        availableMethods.length === 0 ||
        !concentrationInput.trim() ||
        isTraceMethod
      ) {
        return null;
      }

      if (concentrationMethod === "molarity") {
        if (
          !aqueousSolidSolute ||
          (unidadFinal !== "mL" && unidadFinal !== "L")
        ) {
          return {
            method: "molarity",
            error:
              "La molaridad requiere una solución y un volumen final expresado en mL o L.",
          };
        }

        return calculateConcentrationPreparation({
          method: "molarity",
          formula: aqueousSolidSolute.formula,
          concentration: concentrationInput,
          volume: cantidadFinal,
          volumeUnit: unidadFinal,
        });
      }

      if (concentrationMethod === "molality") {
        if (!aqueousSolidSolute) {
          return {
            method: "molality",
            error:
              "La molalidad necesita identificar el soluto y la masa del solvente.",
          };
        }

        return calculateConcentrationPreparation({
          method: "molality",
          formula: aqueousSolidSolute.formula,
          concentration: concentrationInput,
          solventMass: solventMassInput,
          solventMassUnit,
        });
      }

      if (concentrationMethod === "normality") {
        if (
          !aqueousSolidSolute ||
          (unidadFinal !== "mL" && unidadFinal !== "L")
        ) {
          return {
            method: "normality",
            error:
              "La normalidad requiere una solución y un volumen final expresado en mL o L.",
          };
        }

        return calculateConcentrationPreparation({
          method: "normality",
          formula: aqueousSolidSolute.formula,
          concentration: concentrationInput,
          volume: cantidadFinal,
          volumeUnit: unidadFinal,
        });
      }

      if (concentrationMethod === "massMassPercentage") {
        if (!percentageComponent) {
          return {
            method: "massMassPercentage",
            error:
              "QuimiLab necesita identificar el componente cuyo porcentaje se desea calcular.",
          };
        }

        return calculateConcentrationPreparation({
          method: "massMassPercentage",
          component: percentageComponent.formula,
          concentration: concentrationInput,
          finalMass: finalMassInput,
          massUnit: finalMassUnit,
        });
      }

      if (concentrationMethod === "massVolumePercentage") {
        if (
          !aqueousSolidSolute ||
          (unidadFinal !== "mL" && unidadFinal !== "L")
        ) {
          return {
            method: "massVolumePercentage",
            error:
              "El porcentaje m/v requiere un componente expresado en masa y un volumen final en mL o L.",
          };
        }

        return calculateConcentrationPreparation({
          method: "massVolumePercentage",
          component: aqueousSolidSolute.formula,
          concentration: concentrationInput,
          finalVolume: cantidadFinal,
          volumeUnit: unidadFinal,
        });
      }

      if (concentrationMethod === "volumeVolumePercentage") {
        if (
          !percentageComponent ||
          unidadFinal === "g" ||
          unidadFinal === "kg"
        ) {
          return {
            method: "volumeVolumePercentage",
            error:
              "El porcentaje v/v requiere un componente líquido y un volumen final expresado en mL o L.",
          };
        }

        return calculateConcentrationPreparation({
          method: "volumeVolumePercentage",
          component: percentageComponent.formula,
          concentration: concentrationInput,
          finalVolume: cantidadFinal,
          volumeUnit: unidadFinal,
        });
      }

      return null;
    }, [
      availableMethods,
      concentrationMethod,
      concentrationInput,
      isTraceMethod,
      aqueousSolidSolute,
      percentageComponent,
      cantidadFinal,
      unidadFinal,
      solventMassInput,
      solventMassUnit,
      finalMassInput,
      finalMassUnit,
    ]);

  const traceCalculation = useMemo<TracePreparationResponse | null>(() => {
    if (!isTraceMethod || !aqueousSolidSolute || !concentrationInput.trim()) {
      return null;
    }

    if (traceMode === "mass-mass") {
      return calculateTracePreparation({
        component: aqueousSolidSolute.formula,
        concentration: concentrationInput,
        unit: concentrationMethod,
        mode: "mass-mass",
        finalAmount: finalMassInput,
        finalUnit: finalMassUnit,
      });
    }

    if (unidadFinal !== "mL" && unidadFinal !== "L") {
      return {
        unit: concentrationMethod,
        mode: "dilute-aqueous",
        error:
          "La solución acuosa diluida requiere un volumen final expresado en mL o L.",
      };
    }

    return calculateTracePreparation({
      component: aqueousSolidSolute.formula,
      concentration: concentrationInput,
      unit: concentrationMethod,
      mode: "dilute-aqueous",
      finalAmount: cantidadFinal,
      finalUnit: unidadFinal,
    });
  }, [
    isTraceMethod,
    aqueousSolidSolute,
    concentrationInput,
    concentrationMethod,
    traceMode,
    finalMassInput,
    finalMassUnit,
    cantidadFinal,
    unidadFinal,
  ]);

  const concentrationUsesMassBasis =
    concentrationMethod === "molality" ||
    concentrationMethod === "massMassPercentage" ||
    (isTraceMethod && traceMode === "mass-mass");

  const basePlan = useMemo(() => {
    if (!automaticPreparation.type) {
      return null;
    }

    if (
      automaticPreparation.type === "solidLiquidSolution" &&
      !mixtureAnalysis
    ) {
      return null;
    }

    if (
      automaticPreparation.type === "liquidLiquidMixture" &&
      liquidLiquidBehavior === "unknown"
    ) {
      return null;
    }

    return createLabPreparationPlan({
      type: automaticPreparation.type,

      finalAmount:
        concentrationUsesMassBasis && availableMethods.length > 0
          ? undefined
          : Number.isFinite(cantidadNumerica) && cantidadNumerica > 0
            ? cantidadNumerica
            : undefined,

      finalUnit:
        concentrationUsesMassBasis && availableMethods.length > 0
          ? undefined
          : unidadFinal,

      safetyLevel,

      mixtureType:
        automaticPreparation.type === "solidLiquidSolution"
          ? mixtureAnalysis?.type
          : undefined,

      liquidLiquidBehavior:
        automaticPreparation.type === "liquidLiquidMixture"
          ? liquidLiquidBehavior
          : undefined,
    });
  }, [
    automaticPreparation,
    mixtureAnalysis,
    liquidLiquidBehavior,
    concentrationUsesMassBasis,
    availableMethods,
    cantidadNumerica,
    unidadFinal,
    safetyLevel,
  ]);

  const molalityPlan = useMemo<PreparationPlan | null>(() => {
    if (
      concentrationMethod !== "molality" ||
      safetyLevel === "highPrecaution" ||
      !concentrationCalculation ||
      "error" in concentrationCalculation ||
      concentrationCalculation.method !== "molality"
    ) {
      return null;
    }

    const result = concentrationCalculation.result;

    return {
      title: "Preparación de una solución por molalidad",

      description:
        "La preparación se realiza utilizando la masa del solvente y la masa de soluto calculada.",

      equipmentIds: [
        "balance",
        "spatula",
        "weighing-container",
        "beaker",
        "glass-rod",
      ],

      steps: [
        "Reuní todos los materiales necesarios.",
        "Colocá un recipiente limpio y seco sobre la balanza y tará la balanza.",
        `Pesá ${formatNumber(
          result.solventMass,
        )} ${result.solventMassUnit} de agua.`,
        "Utilizá otro recipiente adecuado para pesar el soluto.",
        `Pesá ${formatNumber(result.gramsNeeded, 2)} g de ${result.formula}.`,
        "Agregá gradualmente el soluto al solvente pesado.",
        "Mezclá hasta lograr la disolución cuando sea químicamente posible.",
        "Homogeneizá la preparación.",
        `Rotulá indicando ${result.formula}, ${formatNumber(
          result.molality,
        )} mol/kg y fecha.`,
      ],

      warnings: [
        "La masa de solvente no es la masa total de la solución.",
        "La molalidad no utiliza el volumen final.",
        "No corresponde completar hasta la marca de un matraz aforado.",
        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [concentrationMethod, safetyLevel, concentrationCalculation]);

  const massMassPlan = useMemo<PreparationPlan | null>(() => {
    if (
      concentrationMethod !== "massMassPercentage" ||
      safetyLevel === "highPrecaution" ||
      !concentrationCalculation ||
      "error" in concentrationCalculation ||
      concentrationCalculation.method !== "massMassPercentage"
    ) {
      return null;
    }

    const result = concentrationCalculation.result;

    return {
      title: "Preparación por porcentaje masa en masa",

      description:
        "La preparación se realiza por pesada de los componentes hasta obtener la masa final indicada.",

      equipmentIds: [
        "balance",
        "spatula",
        "weighing-container",
        "beaker",
        "glass-rod",
      ],

      steps: [
        "Reuní los materiales necesarios.",
        "Colocá el recipiente para pesada sobre la balanza y tará la balanza.",
        `Pesá ${formatNumber(result.componentAmountBase, 2)} g de ${
          percentageComponent?.name ?? result.component
        }.`,
        result.remainingAmountBase !== undefined
          ? `Pesá ${formatNumber(result.remainingAmountBase, 2)} g de ${
              otherComponent?.name ?? "los demás componentes"
            }.`
          : "Determiná la masa restante de los demás componentes.",
        "Transferí los componentes a un recipiente adecuado.",
        "Mezclá y homogeneizá la preparación.",
        "Verificá que la masa total corresponda a la masa final indicada.",
        `Rotulá indicando ${
          percentageComponent?.name ?? result.component
        }, ${formatNumber(result.percentage)} % m/m y fecha.`,
      ],

      warnings: [
        "El porcentaje m/m utiliza la masa total final de la mezcla.",
        "La masa de cada componente forma parte de esa masa final.",
        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [
    concentrationMethod,
    safetyLevel,
    concentrationCalculation,
    percentageComponent,
    otherComponent,
  ]);

  const massVolumePlan = useMemo<PreparationPlan | null>(() => {
    if (
      concentrationMethod !== "massVolumePercentage" ||
      safetyLevel === "highPrecaution" ||
      !concentrationCalculation ||
      "error" in concentrationCalculation ||
      concentrationCalculation.method !== "massVolumePercentage"
    ) {
      return null;
    }

    const result = concentrationCalculation.result;

    return {
      title: "Preparación por porcentaje masa en volumen",

      description:
        "Se pesa el soluto y luego se completa la solución hasta alcanzar el volumen final indicado.",

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
        "Reuní todos los materiales necesarios.",
        "Colocá un recipiente para pesada sobre la balanza y tará la balanza.",
        `Pesá ${formatNumber(result.componentAmountBase, 2)} g de ${
          percentageComponent?.name ?? result.component
        }.`,
        "Colocá una cantidad de solvente menor al volumen final en un vaso de precipitados.",
        "Agregá el soluto y mezclá hasta lograr la disolución cuando sea posible.",
        "Transferí la solución al matraz aforado.",
        "Enjuagá el vaso y agregá los lavados al matraz.",
        `Completá cuidadosamente hasta el volumen final de ${formatNumber(
          result.finalAmount,
        )} ${result.finalUnit}.`,
        "Tapá y homogeneizá.",
        `Rotulá indicando ${
          percentageComponent?.name ?? result.component
        }, ${formatNumber(result.percentage)} % m/v y fecha.`,
      ],

      warnings: [
        "El volumen indicado es el volumen final de la solución.",
        "No significa agregar el soluto a esa cantidad inicial de solvente.",
        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [
    concentrationMethod,
    safetyLevel,
    concentrationCalculation,
    percentageComponent,
  ]);

  const volumeVolumePlan = useMemo<PreparationPlan | null>(() => {
    if (
      concentrationMethod !== "volumeVolumePercentage" ||
      safetyLevel === "highPrecaution" ||
      !concentrationCalculation ||
      "error" in concentrationCalculation ||
      concentrationCalculation.method !== "volumeVolumePercentage"
    ) {
      return null;
    }

    const result = concentrationCalculation.result;

    return {
      title: "Preparación por porcentaje volumen en volumen",

      description:
        "Se mide el volumen del componente líquido y se completa la preparación hasta alcanzar el volumen final indicado.",

      equipmentIds: [
        "graduated-cylinder",
        "volumetric-pipette",
        "pipette-filler",
        "volumetric-flask",
      ],

      steps: [
        "Reuní el material volumétrico necesario.",
        `Medí ${formatNumber(result.componentAmountBase, 2)} mL de ${
          percentageComponent?.name ?? result.component
        }.`,
        "Transferí el componente al recipiente volumétrico adecuado.",
        "Agregá parcialmente el segundo componente.",
        `Completá cuidadosamente hasta alcanzar un volumen final de ${formatNumber(
          result.finalAmount,
        )} ${result.finalUnit}.`,
        "Tapá y homogeneizá la preparación.",
        "Verificá que la mezcla permanezca en una única fase cuando corresponda.",
        `Rotulá indicando ${
          percentageComponent?.name ?? result.component
        }, ${formatNumber(result.percentage)} % v/v y fecha.`,
      ],

      warnings: [
        "No debe suponerse que el volumen del segundo componente es simplemente el volumen final menos el volumen del primero.",
        "Los volúmenes de dos líquidos no siempre son perfectamente aditivos.",
        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [
    concentrationMethod,
    safetyLevel,
    concentrationCalculation,
    percentageComponent,
  ]);

  const tracePlan = useMemo<PreparationPlan | null>(() => {
    if (
      !isTraceMethod ||
      safetyLevel === "highPrecaution" ||
      !traceCalculation ||
      "error" in traceCalculation
    ) {
      return null;
    }

    const result = traceCalculation.result;

    const componentMassText = getTraceMassText(result);

    if (traceMode === "mass-mass") {
      return {
        title: `Preparación en ${result.unit} por masa`,

        description:
          "La concentración traza se calcula respecto de la masa total final de la mezcla.",

        equipmentIds: [
          "balance",
          "spatula",
          "weighing-container",
          "beaker",
          "glass-rod",
        ],

        steps: [
          "Reuní los materiales necesarios.",
          "Verificá que la balanza tenga resolución suficiente para medir la masa calculada.",
          `Medí ${componentMassText} de ${aqueousSolidSolute?.name ?? result.component}.`,
          `Completá la preparación hasta una masa final de ${formatNumber(
            result.finalAmount,
          )} ${result.finalUnit}.`,
          "Homogeneizá cuidadosamente la mezcla.",
          `Rotulá indicando ${formatNumber(
            result.concentration,
          )} ${result.unit} y fecha.`,
        ],

        warnings: [
          result.unit === "ppm"
            ? "En base masa/masa, 1 ppm equivale a 1 mg de componente por kilogramo de mezcla."
            : "En base masa/masa, 1 ppb equivale a 1 microgramo de componente por kilogramo de mezcla.",
          "Si la masa calculada es menor que la resolución de la balanza disponible, no debe pesarse directamente. Debe utilizarse una solución madre y realizar una dilución adecuada.",
          ...(safetyLevel === "supervision"
            ? ["Esta preparación requiere supervisión docente."]
            : []),
        ],

        canShowAutonomousProcedure: true,
      };
    }

    return {
      title: `Preparación acuosa en ${result.unit}`,

      description:
        "La concentración se calcula mediante la aproximación válida para soluciones acuosas suficientemente diluidas y con densidad cercana a 1 kg/L.",

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
        "Reuní los materiales necesarios.",
        "Verificá que el instrumental disponible tenga resolución suficiente para medir la cantidad calculada.",
        `La cantidad teórica necesaria es ${componentMassText} de ${aqueousSolidSolute?.name ?? result.component}.`,
        "Si esa cantidad puede medirse con precisión, prepará inicialmente una solución con una cantidad de agua menor al volumen final.",
        "Transferí cuantitativamente la preparación al matraz aforado.",
        `Completá cuidadosamente hasta un volumen final de ${formatNumber(
          result.finalAmount,
        )} ${result.finalUnit}.`,
        "Tapá y homogeneizá.",
        `Rotulá indicando ${formatNumber(
          result.concentration,
        )} ${result.unit} y fecha.`,
      ],

      warnings: [
        result.warning ??
          "La relación utilizada es una aproximación para soluciones acuosas diluidas.",
        "Para concentraciones muy bajas, la pesada directa puede no ser técnicamente posible con una balanza de laboratorio escolar.",
        "Si la cantidad calculada es menor que la resolución del instrumental, corresponde preparar una solución madre de concentración conocida y luego realizar una dilución.",
        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [
    isTraceMethod,
    safetyLevel,
    traceCalculation,
    traceMode,
    aqueousSolidSolute,
  ]);

  const plan = useMemo(() => {
    if (
      safetyLevel !== "highPrecaution" &&
      concentrationCalculation &&
      "error" in concentrationCalculation
    ) {
      return null;
    }

    if (
      safetyLevel !== "highPrecaution" &&
      traceCalculation &&
      "error" in traceCalculation
    ) {
      return null;
    }

    if (safetyLevel === "highPrecaution") {
      return basePlan;
    }

    if (isTraceMethod) {
      return tracePlan ?? basePlan;
    }

    switch (concentrationMethod) {
      case "molality":
        return molalityPlan ?? basePlan;

      case "massMassPercentage":
        return massMassPlan ?? basePlan;

      case "massVolumePercentage":
        return massVolumePlan ?? basePlan;

      case "volumeVolumePercentage":
        return volumeVolumePlan ?? basePlan;

      default:
        return basePlan;
    }
  }, [
    safetyLevel,
    concentrationCalculation,
    traceCalculation,
    isTraceMethod,
    concentrationMethod,
    basePlan,
    molalityPlan,
    massMassPlan,
    massVolumePlan,
    volumeVolumePlan,
    tracePlan,
  ]);

  const materiales = plan
    ? plan.equipmentIds
        .map((id) => labEquipment.find((item) => item.id === id))
        .filter(
          (item): item is (typeof labEquipment)[number] => item !== undefined,
        )
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Preparación de laboratorio",
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Preparación de laboratorio</Text>

        <Text style={styles.subtitle}>
          Ingresá los componentes. QuimiLab analiza las sustancias, determina el
          tipo de preparación y selecciona los cálculos y materiales adecuados.
        </Text>

        <SubstanceInputCard
          title="Componente 1"
          value={component1Input}
          onChangeText={setComponent1Input}
          substance={component1}
        />

        <SubstanceInputCard
          title="Componente 2"
          value={component2Input}
          onChangeText={setComponent2Input}
          substance={component2}
        />

        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Objetivo de la preparación</Text>

          <Pressable
            style={[
              styles.optionCard,
              objective === "combineComponents" && styles.optionActive,
            ]}
            onPress={() => setObjective("combineComponents")}
          >
            <Text style={styles.optionTitle}>Combinar los componentes</Text>

            <Text style={styles.optionText}>
              Analizar solubilidad, miscibilidad y tipo de preparación.
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.optionCard,
              objective === "dilution" && styles.optionActive,
            ]}
            onPress={() => setObjective("dilution")}
          >
            <Text style={styles.optionTitle}>Diluir una solución madre</Text>

            <Text style={styles.optionText}>
              Preparar una solución menos concentrada.
            </Text>
          </Pressable>
        </View>

        <View style={styles.detectionCard}>
          <Text style={styles.detectionLabel}>DETECCIÓN AUTOMÁTICA</Text>

          <Text style={styles.detectionTitle}>
            {automaticPreparation.title}
          </Text>

          <Text style={styles.detectionText}>
            {automaticPreparation.explanation}
          </Text>
        </View>

        {component1 && component2 && objective === "combineComponents" && (
          <View style={styles.card}>
            <Text style={styles.smallLabel}>ANÁLISIS DE LOS COMPONENTES</Text>

            <Text style={styles.cardTitle}>
              {component1.name} + {component2.name}
            </Text>

            {isLiquidLiquid ? (
              pairInteraction ? (
                <>
                  <Text style={styles.resultText}>
                    Resultado: {pairInteraction.resultLabel}
                  </Text>

                  <Text style={styles.body}>{pairInteraction.description}</Text>

                  {pairInteraction.warning ? (
                    <View style={styles.warningInside}>
                      <Text style={styles.warningTitle}>Seguridad</Text>

                      <Text style={styles.warningText}>
                        {pairInteraction.warning}
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.body}>
                  QuimiLab todavía no dispone de información específica sobre la
                  interacción entre estos líquidos.
                </Text>
              )
            ) : waterBasedInteraction ? (
              <>
                <Text style={styles.body}>
                  {waterBasedInteraction.description}
                </Text>

                {mixtureAnalysis && (
                  <>
                    <Text style={styles.resultText}>
                      Resultado: {mixtureAnalysis.label}
                    </Text>

                    <Text style={styles.body}>
                      {mixtureAnalysis.explanation}
                    </Text>
                  </>
                )}

                {waterBasedInteraction.warning ? (
                  <View style={styles.warningInside}>
                    <Text style={styles.warningTitle}>Observación</Text>

                    <Text style={styles.warningText}>
                      {waterBasedInteraction.warning}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={styles.body}>
                QuimiLab todavía no posee información suficiente sobre esta
                interacción.
              </Text>
            )}
          </View>
        )}

        {availableMethods.length > 0 ? (
          <View style={styles.concentrationCard}>
            <Text style={styles.smallLabel}>CONCENTRACIÓN</Text>

            <Text style={styles.cardTitle}>
              ¿Cómo querés expresar la concentración?
            </Text>

            <View style={styles.methodRow}>
              {availableMethods.map((method) => (
                <Pressable
                  key={method}
                  style={[
                    styles.methodButton,
                    concentrationMethod === method && styles.methodButtonActive,
                  ]}
                  onPress={() => setConcentrationMethod(method)}
                >
                  <Text
                    style={[
                      styles.methodText,
                      concentrationMethod === method && styles.methodTextActive,
                    ]}
                  >
                    {getPreparationMethodLabel(method)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>
              {getConcentrationPrompt(concentrationMethod)}
            </Text>

            <View style={styles.valueRow}>
              <TextInput
                value={concentrationInput}
                onChangeText={setConcentrationInput}
                keyboardType="decimal-pad"
                style={[styles.input, styles.flexInput]}
                placeholder={
                  concentrationMethod === "ppm" ||
                  concentrationMethod === "ppb" ||
                  concentrationMethod === "massMassPercentage" ||
                  concentrationMethod === "massVolumePercentage" ||
                  concentrationMethod === "volumeVolumePercentage"
                    ? "10"
                    : "0,5"
                }
              />

              <Text style={styles.suffix}>
                {getPreparationMethodUnit(concentrationMethod)}
              </Text>
            </View>

            {isTraceMethod ? (
              <>
                <Text style={styles.label}>Base de concentración</Text>

                <View style={styles.unitRow}>
                  <Pressable
                    style={[
                      styles.traceModeButton,
                      traceMode === "dilute-aqueous" && styles.unitButtonActive,
                    ]}
                    onPress={() => setTraceMode("dilute-aqueous")}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        traceMode === "dilute-aqueous" && styles.unitTextActive,
                      ]}
                    >
                      Solución acuosa diluida
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.traceModeButton,
                      traceMode === "mass-mass" && styles.unitButtonActive,
                    ]}
                    onPress={() => setTraceMode("mass-mass")}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        traceMode === "mass-mass" && styles.unitTextActive,
                      ]}
                    >
                      Masa / masa
                    </Text>
                  </Pressable>
                </View>

                {traceMode === "dilute-aqueous" ? (
                  <>
                    <Text style={styles.label}>Volumen final de solución</Text>

                    <TextInput
                      value={cantidadFinal}
                      onChangeText={setCantidadFinal}
                      keyboardType="decimal-pad"
                      style={styles.input}
                    />

                    <View style={styles.unitRow}>
                      {(["mL", "L"] as const).map((unit) => (
                        <Pressable
                          key={unit}
                          style={[
                            styles.unitButton,
                            unidadFinal === unit && styles.unitButtonActive,
                          ]}
                          onPress={() => setUnidadFinal(unit)}
                        >
                          <Text
                            style={[
                              styles.unitText,
                              unidadFinal === unit && styles.unitTextActive,
                            ]}
                          >
                            {unit}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <Text style={styles.helper}>
                      Para soluciones acuosas diluidas, QuimiLab utiliza la
                      aproximación basada en una densidad cercana a 1 kg/L.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Masa final de la mezcla</Text>

                    <TextInput
                      value={finalMassInput}
                      onChangeText={setFinalMassInput}
                      keyboardType="decimal-pad"
                      style={styles.input}
                    />

                    <View style={styles.unitRow}>
                      {(["g", "kg"] as const).map((unit) => (
                        <Pressable
                          key={unit}
                          style={[
                            styles.unitButton,
                            finalMassUnit === unit && styles.unitButtonActive,
                          ]}
                          onPress={() => setFinalMassUnit(unit)}
                        >
                          <Text
                            style={[
                              styles.unitText,
                              finalMassUnit === unit && styles.unitTextActive,
                            ]}
                          >
                            {unit}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <Text style={styles.helper}>
                      Esta opción calcula ppm o ppb directamente respecto de la
                      masa total de la mezcla.
                    </Text>
                  </>
                )}

                {traceCalculation ? (
                  <TraceResultView
                    calculation={traceCalculation}
                    componentName={aqueousSolidSolute?.name}
                  />
                ) : null}
              </>
            ) : concentrationMethod === "molality" ? (
              <>
                <Text style={styles.label}>Masa de solvente</Text>

                <TextInput
                  value={solventMassInput}
                  onChangeText={setSolventMassInput}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <View style={styles.unitRow}>
                  {(["g", "kg"] as const).map((unit) => (
                    <Pressable
                      key={unit}
                      style={[
                        styles.unitButton,
                        solventMassUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setSolventMassUnit(unit)}
                    >
                      <Text
                        style={[
                          styles.unitText,
                          solventMassUnit === unit && styles.unitTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.helper}>
                  La molalidad utiliza masa de solvente, no volumen final.
                </Text>
              </>
            ) : concentrationMethod === "massMassPercentage" ? (
              <>
                <Text style={styles.label}>Masa final de la mezcla</Text>

                <TextInput
                  value={finalMassInput}
                  onChangeText={setFinalMassInput}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <View style={styles.unitRow}>
                  {(["g", "kg"] as const).map((unit) => (
                    <Pressable
                      key={unit}
                      style={[
                        styles.unitButton,
                        finalMassUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setFinalMassUnit(unit)}
                    >
                      <Text
                        style={[
                          styles.unitText,
                          finalMassUnit === unit && styles.unitTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.helper}>
                  % m/m utiliza la masa total final de la mezcla.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Volumen final</Text>

                <TextInput
                  value={cantidadFinal}
                  onChangeText={setCantidadFinal}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <View style={styles.unitRow}>
                  {(["mL", "L"] as const).map((unit) => (
                    <Pressable
                      key={unit}
                      style={[
                        styles.unitButton,
                        unidadFinal === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setUnidadFinal(unit)}
                    >
                      <Text
                        style={[
                          styles.unitText,
                          unidadFinal === unit && styles.unitTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.helper}>
                  {getMethodExplanation(concentrationMethod)}
                </Text>
              </>
            )}

            {!isTraceMethod && concentrationCalculation ? (
              <ConcentrationResultView
                calculation={concentrationCalculation}
                componentName={percentageComponent?.name}
              />
            ) : null}
          </View>
        ) : (
          <View style={styles.inputCard}>
            <Text style={styles.label}>Cantidad o volumen de preparación</Text>

            <TextInput
              value={cantidadFinal}
              onChangeText={setCantidadFinal}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <View style={styles.unitRow}>
              {(["mL", "L", "g", "kg"] as const).map((unit) => (
                <Pressable
                  key={unit}
                  style={[
                    styles.unitButton,
                    unidadFinal === unit && styles.unitButtonActive,
                  ]}
                  onPress={() => setUnidadFinal(unit)}
                >
                  <Text
                    style={[
                      styles.unitText,
                      unidadFinal === unit && styles.unitTextActive,
                    ]}
                  >
                    {unit}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {plan ? (
          <>
            <View style={styles.planCard}>
              <Text style={styles.planLabel}>PLAN DE PREPARACIÓN</Text>

              <Text style={styles.planTitle}>{plan.title}</Text>

              <Text style={styles.planText}>{plan.description}</Text>
            </View>

            {materiales.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Materiales necesarios</Text>

                {materiales.map((material) => (
                  <View key={material.id} style={styles.materialRow}>
                    <Text style={styles.bullet}>•</Text>

                    <View style={styles.flex}>
                      <Text style={styles.materialName}>{material.nombre}</Text>

                      <Text style={styles.body}>{material.porqueUsarlo}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {plan.steps.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Procedimiento guiado</Text>

                {plan.steps.map((step, index) => (
                  <View key={`${step}-${index}`} style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>

                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {plan.warnings.length > 0 && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Atención</Text>

                {plan.warnings.map((warning) => (
                  <Text key={warning} style={styles.warningText}>
                    • {warning}
                  </Text>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>Procedimiento pendiente</Text>

            <Text style={styles.body}>
              QuimiLab necesita información suficiente para generar un
              procedimiento correcto.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>¿Cómo decide QuimiLab?</Text>

          <Text style={styles.body}>
            QuimiLab analiza las sustancias, su interacción, el método de
            concentración y el nivel de seguridad antes de generar los cálculos,
            materiales y procedimiento.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function TraceResultView({
  calculation,
  componentName,
}: {
  calculation: TracePreparationResponse;
  componentName?: string;
}) {
  if ("error" in calculation) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.warningTitle}>No se puede calcular</Text>

        <Text style={styles.warningText}>{calculation.error}</Text>
      </View>
    );
  }

  const result = calculation.result;

  return (
    <>
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>Cálculo</Text>

        <Text style={styles.equation}>{result.calculation}</Text>

        <Text style={styles.calculationTitle}>
          Masa necesaria del componente
        </Text>

        <Text style={styles.strong}>{getTraceMassText(result)}</Text>
      </View>

      <ResultBox>
        {getTraceMassText(result)} de {componentName ?? result.component}
        {"\n"}
        para una concentración de {formatNumber(result.concentration)}{" "}
        {result.unit}
      </ResultBox>

      {result.approximation ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Aproximación</Text>

          <Text style={styles.warningText}>{result.warning}</Text>
        </View>
      ) : (
        <View style={styles.helperBox}>
          <Text style={styles.body}>
            Este cálculo está expresado en base masa/masa.
          </Text>
        </View>
      )}

      <View style={styles.helperBox}>
        <Text style={styles.body}>
          Para masas muy pequeñas, verificá siempre la resolución del
          instrumental. Si no pueden medirse con precisión, corresponde preparar
          una solución madre y luego realizar una dilución.
        </Text>
      </View>
    </>
  );
}

function ConcentrationResultView({
  calculation,
  componentName,
}: {
  calculation: ConcentrationPreparationResponse;
  componentName?: string;
}) {
  if ("error" in calculation) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.warningTitle}>No se puede calcular</Text>

        <Text style={styles.warningText}>{calculation.error}</Text>
      </View>
    );
  }

  if (calculation.method === "molarity") {
    const result = calculation.result;

    return (
      <>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>
            Paso 1: calcular los moles
          </Text>

          <Text style={styles.equation}>n = M × V</Text>

          <Text style={styles.strong}>
            n = {formatNumber(result.molesNeeded)} mol
          </Text>

          <Text style={styles.calculationTitle}>
            Paso 2: convertir a gramos
          </Text>

          <Text style={styles.equation}>masa = n × MM</Text>
        </View>

        <ResultBox>
          {formatNumber(result.gramsNeeded, 2)} g de {result.formula}
          {"\n"}
          para preparar {formatNumber(result.volume)} {result.volumeUnit} de
          solución {formatNumber(result.molarity)} M
        </ResultBox>
      </>
    );
  }

  if (calculation.method === "molality") {
    const result = calculation.result;

    return (
      <>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>Masa de solvente</Text>

          <Text style={styles.strong}>
            {formatNumber(result.solventMassKg)} kg
          </Text>

          <Text style={styles.calculationTitle}>Moles necesarios</Text>

          <Text style={styles.equation}>n = m × kg de solvente</Text>

          <Text style={styles.strong}>
            n = {formatNumber(result.molesNeeded)} mol
          </Text>
        </View>

        <ResultBox>
          {formatNumber(result.gramsNeeded, 2)} g de {result.formula}
          {"\n"}
          con {formatNumber(result.solventMass)} {result.solventMassUnit} de
          solvente
        </ResultBox>
      </>
    );
  }

  if (calculation.method === "normality") {
    const result = calculation.result;

    return (
      <>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>Factor de equivalencia</Text>

          <Text style={styles.strong}>{result.equivalenceFactor}</Text>

          <Text style={styles.body}>{result.equivalenceExplanation}</Text>

          <Text style={styles.calculationTitle}>Peso equivalente</Text>

          <Text style={styles.strong}>
            {formatNumber(result.equivalentWeight, 3)} g/eq
          </Text>

          <Text style={styles.calculationTitle}>Molaridad relacionada</Text>

          <Text style={styles.strong}>
            {formatNumber(result.molarity)} mol/L
          </Text>
        </View>

        <ResultBox>
          {formatNumber(result.gramsNeeded, 2)} g de {result.formula}
          {"\n"}
          para preparar {formatNumber(result.volume)} {result.volumeUnit} de
          solución {formatNumber(result.normality)} N
        </ResultBox>
      </>
    );
  }

  if (calculation.method === "massMassPercentage") {
    const result = calculation.result;

    return (
      <>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>Masa del componente</Text>

          <Text style={styles.equation}>masa = (% × masa final) / 100</Text>

          <Text style={styles.strong}>
            {formatNumber(result.componentAmountBase, 2)} g
          </Text>

          {result.remainingAmountBase !== undefined ? (
            <>
              <Text style={styles.calculationTitle}>Masa restante</Text>

              <Text style={styles.strong}>
                {formatNumber(result.remainingAmountBase, 2)} g
              </Text>
            </>
          ) : null}
        </View>

        <ResultBox>
          {formatNumber(result.componentAmountBase, 2)} g de{" "}
          {componentName ?? result.component}
          {"\n"}
          para una preparación de {formatNumber(result.percentage)} % m/m
        </ResultBox>
      </>
    );
  }

  if (calculation.method === "massVolumePercentage") {
    const result = calculation.result;

    return (
      <>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>Masa de soluto</Text>

          <Text style={styles.equation}>
            masa = (% × volumen final en mL) / 100
          </Text>

          <Text style={styles.strong}>
            {formatNumber(result.componentAmountBase, 2)} g
          </Text>
        </View>

        <ResultBox>
          {formatNumber(result.componentAmountBase, 2)} g de{" "}
          {componentName ?? result.component}
          {"\n"}
          para preparar {formatNumber(result.finalAmount)} {result.finalUnit} al{" "}
          {formatNumber(result.percentage)} % m/v
        </ResultBox>
      </>
    );
  }

  const result = calculation.result;

  return (
    <>
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>Volumen del componente</Text>

        <Text style={styles.equation}>volumen = (% × volumen final) / 100</Text>

        <Text style={styles.strong}>
          {formatNumber(result.componentAmountBase, 2)} mL
        </Text>
      </View>

      <ResultBox>
        {formatNumber(result.componentAmountBase, 2)} mL de{" "}
        {componentName ?? result.component}
        {"\n"}
        para preparar {formatNumber(result.finalAmount)} {result.finalUnit} al{" "}
        {formatNumber(result.percentage)} % v/v
      </ResultBox>

      <View style={styles.helperBox}>
        <Text style={styles.body}>
          El volumen restante no debe calcularse automáticamente como volumen
          final menos volumen del componente, porque los volúmenes pueden no ser
          perfectamente aditivos.
        </Text>
      </View>
    </>
  );
}

function ResultBox({ children }: { children: ReactNode }) {
  return (
    <View style={styles.finalResult}>
      <Text style={styles.finalLabel}>RESULTADO</Text>

      <Text style={styles.finalText}>{children}</Text>
    </View>
  );
}

type SubstanceInputCardProps = {
  title: string;
  value: string;
  onChangeText: (value: string) => void;
  substance: SubstanceRecord | null;
};

function SubstanceInputCard({
  title,
  value,
  onChangeText,
  substance,
}: SubstanceInputCardProps) {
  return (
    <View style={styles.inputCard}>
      <Text style={styles.label}>{title}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder="Fórmula o nombre"
        autoCapitalize="none"
      />

      {substance ? (
        <View style={styles.identifiedBox}>
          <Text style={styles.smallLabel}>SUSTANCIA IDENTIFICADA</Text>

          <Text style={styles.cardTitle}>{substance.name}</Text>

          <Text style={styles.body}>{substance.formula}</Text>

          <Text style={styles.body}>
            Estado físico: {getPhysicalStateLabel(substance.physicalState)}
          </Text>

          <Text style={styles.body}>
            Seguridad: {getSafetyLabel(substance.safetyClassification)}
          </Text>
        </View>
      ) : value.trim() !== "" ? (
        <Text style={styles.warningText}>
          Sustancia todavía no registrada en QuimiLab.
        </Text>
      ) : null}
    </View>
  );
}

function getPreparationMethodLabel(
  method: PreparationConcentrationMethod,
): string {
  if (method === "ppm") {
    return "ppm";
  }

  if (method === "ppb") {
    return "ppb";
  }

  return getConcentrationMethodLabel(method);
}

function getPreparationMethodUnit(
  method: PreparationConcentrationMethod,
): string {
  if (method === "ppm") {
    return "ppm";
  }

  if (method === "ppb") {
    return "ppb";
  }

  return getConcentrationUnit(method);
}

function getConcentrationPrompt(
  method: PreparationConcentrationMethod,
): string {
  switch (method) {
    case "molarity":
      return "Molaridad deseada";

    case "molality":
      return "Molalidad deseada";

    case "normality":
      return "Normalidad deseada";

    case "massMassPercentage":
      return "Porcentaje m/m";

    case "massVolumePercentage":
      return "Porcentaje m/v";

    case "volumeVolumePercentage":
      return "Porcentaje v/v";

    case "ppm":
      return "Concentración en ppm";

    case "ppb":
      return "Concentración en ppb";
  }
}

function getMethodExplanation(method: PreparationConcentrationMethod): string {
  switch (method) {
    case "molarity":
      return "La molaridad utiliza el volumen final de la solución.";

    case "normality":
      return "La normalidad depende del número de equivalentes involucrados en la reacción.";

    case "massVolumePercentage":
      return "% m/v expresa gramos de componente por cada 100 mL de solución final.";

    case "volumeVolumePercentage":
      return "% v/v expresa mililitros de componente por cada 100 mL de mezcla final.";

    default:
      return "";
  }
}

function getTraceMassText(result: {
  componentMass: {
    grams: number;
    milligrams: number;
    micrograms: number;
  };
}): string {
  if (result.componentMass.grams >= 1) {
    return `${formatNumber(result.componentMass.grams, 6)} g`;
  }

  if (result.componentMass.milligrams >= 1) {
    return `${formatNumber(result.componentMass.milligrams, 6)} mg`;
  }

  return `${formatNumber(result.componentMass.micrograms, 6)} µg`;
}

function getPhysicalStateLabel(
  state:
    | "solid"
    | "liquid"
    | "viscousLiquid"
    | "semisolid"
    | "gas"
    | null
    | undefined,
): string {
  switch (state) {
    case "solid":
      return "Sólido";

    case "liquid":
      return "Líquido";

    case "viscousLiquid":
      return "Líquido viscoso";

    case "semisolid":
      return "Semisólido";

    case "gas":
      return "Gas";

    default:
      return "No especificado";
  }
}

function getSafetyLabel(
  classification:
    | "educational"
    | "requiresSupervision"
    | "highPrecaution"
    | undefined,
): string {
  switch (classification) {
    case "requiresSupervision":
      return "Requiere supervisión docente";

    case "highPrecaution":
      return "Precaución alta";

    case "educational":
      return "Uso educativo";

    default:
      return "No especificado";
  }
}

function formatNumber(value: number, decimals = 3): string {
  return value
    .toFixed(decimals)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f8",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
  },

  flex: {
    flex: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#617a7b",
    marginBottom: 24,
  },

  inputCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  concentrationCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#0d887d",
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 8,
  },

  smallLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0d887d",
    marginBottom: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#173b40",
    marginTop: 12,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 17,
    color: "#173b40",
    backgroundColor: "#ffffff",
  },

  identifiedBox: {
    backgroundColor: "#eaf7f5",
    borderRadius: 14,
    padding: 14,
    marginTop: 13,
  },

  body: {
    color: "#4f696b",
    fontSize: 15,
    lineHeight: 23,
  },

  optionCard: {
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },

  optionActive: {
    borderColor: "#0d887d",
    backgroundColor: "#daf1ed",
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 5,
  },

  optionText: {
    color: "#617a7b",
    lineHeight: 21,
  },

  detectionCard: {
    backgroundColor: "#173b40",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  detectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8ddbd0",
    marginBottom: 6,
  },

  detectionTitle: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 8,
  },

  detectionText: {
    color: "#d8e9e8",
    lineHeight: 23,
  },

  resultText: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 17,
    marginVertical: 8,
  },

  warningInside: {
    backgroundColor: "#fff6df",
    borderRadius: 13,
    padding: 14,
    marginTop: 12,
  },

  methodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  methodButton: {
    minWidth: "30%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: "center",
  },

  methodButtonActive: {
    backgroundColor: "#0d887d",
    borderColor: "#0d887d",
  },

  methodText: {
    color: "#173b40",
    fontWeight: "800",
    textAlign: "center",
  },

  methodTextActive: {
    color: "#ffffff",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  flexInput: {
    flex: 1,
  },

  suffix: {
    marginLeft: 10,
    color: "#617a7b",
    fontWeight: "700",
  },

  unitRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },

  unitButton: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  traceModeButton: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "center",
  },

  unitButtonActive: {
    backgroundColor: "#0d887d",
    borderColor: "#0d887d",
  },

  unitText: {
    color: "#173b40",
    fontWeight: "700",
    textAlign: "center",
  },

  unitTextActive: {
    color: "#ffffff",
  },

  helper: {
    color: "#617a7b",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },

  helperBox: {
    backgroundColor: "#e0f4f0",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },

  calculationBox: {
    backgroundColor: "#f4f9f8",
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
  },

  calculationTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 6,
  },

  equation: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 5,
  },

  strong: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 8,
  },

  finalResult: {
    backgroundColor: "#0d887d",
    borderRadius: 15,
    padding: 17,
    marginTop: 14,
  },

  finalLabel: {
    color: "#d9f4ef",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 7,
  },

  finalText: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
  },

  errorBox: {
    backgroundColor: "#fff6df",
    borderRadius: 14,
    padding: 15,
    marginTop: 15,
  },

  planCard: {
    backgroundColor: "#0d887d",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  planLabel: {
    color: "#d9f4ef",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  planTitle: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 23,
    marginBottom: 8,
  },

  planText: {
    color: "#e6f7f4",
    lineHeight: 23,
  },

  materialRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  materialName: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 3,
  },

  bullet: {
    color: "#0d887d",
    marginRight: 10,
    fontSize: 20,
  },

  step: {
    flexDirection: "row",
    marginBottom: 15,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#daf1ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  stepNumberText: {
    color: "#0d887d",
    fontWeight: "800",
  },

  stepText: {
    flex: 1,
    color: "#4f696b",
    lineHeight: 22,
  },

  warningCard: {
    backgroundColor: "#fff6df",
    borderWidth: 1,
    borderColor: "#ddb85e",
    borderRadius: 16,
    padding: 17,
    marginBottom: 18,
  },

  warningTitle: {
    color: "#805a08",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 7,
  },

  warningText: {
    color: "#6c562b",
    lineHeight: 22,
  },

  pendingCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  pendingTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 19,
    marginBottom: 7,
  },

  infoCard: {
    backgroundColor: "#e0f4f0",
    borderRadius: 16,
    padding: 18,
  },
});

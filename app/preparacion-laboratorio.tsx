import { Stack } from "expo-router";
import { useMemo, useState } from "react";
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
    type ConcentrationMethod,
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

export default function PreparacionLaboratorioScreen() {
  const [component1Input, setComponent1Input] = useState("CaCl2");

  const [component2Input, setComponent2Input] = useState("H2O");

  const [objective, setObjective] =
    useState<PreparationObjective>("combineComponents");

  const [cantidadFinal, setCantidadFinal] = useState("500");

  const [unidadFinal, setUnidadFinal] = useState<"mL" | "L" | "g" | "kg">("mL");

  const [concentrationMethod, setConcentrationMethod] =
    useState<ConcentrationMethod>("molarity");

  const [concentrationInput, setConcentrationInput] = useState("0,5");

  const [solventMassInput, setSolventMassInput] = useState("500");

  const [solventMassUnit, setSolventMassUnit] = useState<"g" | "kg">("g");

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
    if (!component1 || !component2) {
      return null;
    }

    if (!waterBasedInteraction) {
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

  const concentrationCalculation = useMemo(() => {
    if (!aqueousSolidSolute) {
      return null;
    }

    if (!concentrationInput.trim()) {
      return null;
    }

    if (concentrationMethod === "molarity") {
      if (unidadFinal !== "mL" && unidadFinal !== "L") {
        return {
          method: "molarity" as const,
          error: "La molaridad requiere un volumen final expresado en mL o L.",
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
      return calculateConcentrationPreparation({
        method: "molality",
        formula: aqueousSolidSolute.formula,
        concentration: concentrationInput,
        solventMass: solventMassInput,
        solventMassUnit,
      });
    }

    if (unidadFinal !== "mL" && unidadFinal !== "L") {
      return {
        method: "normality" as const,
        error: "La normalidad requiere un volumen final expresado en mL o L.",
      };
    }

    return calculateConcentrationPreparation({
      method: "normality",
      formula: aqueousSolidSolute.formula,
      concentration: concentrationInput,
      volume: cantidadFinal,
      volumeUnit: unidadFinal,
    });
  }, [
    aqueousSolidSolute,
    concentrationMethod,
    concentrationInput,
    cantidadFinal,
    unidadFinal,
    solventMassInput,
    solventMassUnit,
  ]);

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
        concentrationMethod === "molality" && aqueousSolidSolute
          ? undefined
          : Number.isFinite(cantidadNumerica) && cantidadNumerica > 0
            ? cantidadNumerica
            : undefined,

      finalUnit:
        concentrationMethod === "molality" && aqueousSolidSolute
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
    concentrationMethod,
    aqueousSolidSolute,
    cantidadNumerica,
    unidadFinal,
    safetyLevel,
    mixtureAnalysis,
    liquidLiquidBehavior,
  ]);

  const molalityPlan = useMemo<PreparationPlan | null>(() => {
    if (!aqueousSolidSolute || concentrationMethod !== "molality") {
      return null;
    }

    if (safetyLevel === "highPrecaution") {
      return null;
    }

    if (
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
        "La molalidad se basa en los moles de soluto por kilogramo de solvente. La preparación se realiza por masa y no completando hasta un volumen final.",

      equipmentIds: [
        "balance",
        "spatula",
        "weighing-container",
        "beaker",
        "glass-rod",
      ],

      steps: [
        "Reuní todos los materiales necesarios antes de comenzar.",

        "Colocá un recipiente limpio y seco sobre la balanza y tará la balanza.",

        `Pesá ${formatNumber(
          result.solventMass,
        )} ${result.solventMassUnit} de agua.`,

        "Utilizá otro recipiente adecuado para pesar el soluto.",

        `Pesá ${formatNumber(result.gramsNeeded, 2)} g de ${result.formula}.`,

        "Agregá gradualmente el soluto al solvente pesado.",

        "Mezclá hasta lograr la disolución cuando sea químicamente posible.",

        "Verificá que no quede material adherido al recipiente utilizado para pesar el soluto.",

        "Homogeneizá la preparación.",

        `Rotulá indicando ${result.formula}, molalidad ${formatNumber(
          result.molality,
        )} mol/kg, masa de solvente utilizada y fecha.`,
      ],

      warnings: [
        "La masa de solvente no es la masa total de la solución.",

        "La molalidad no utiliza el volumen final de la solución como base de cálculo.",

        "No corresponde completar la preparación hasta la marca de un matraz aforado.",

        ...(safetyLevel === "supervision"
          ? ["Esta preparación requiere supervisión docente."]
          : []),
      ],

      canShowAutonomousProcedure: true,
    };
  }, [
    aqueousSolidSolute,
    concentrationMethod,
    safetyLevel,
    concentrationCalculation,
  ]);

  const plan = useMemo(() => {
    if (
      aqueousSolidSolute &&
      safetyLevel !== "highPrecaution" &&
      concentrationCalculation &&
      "error" in concentrationCalculation
    ) {
      return null;
    }

    if (aqueousSolidSolute && concentrationMethod === "molality") {
      if (safetyLevel === "highPrecaution") {
        return basePlan;
      }

      return molalityPlan;
    }

    return basePlan;
  }, [
    aqueousSolidSolute,
    concentrationMethod,
    safetyLevel,
    concentrationCalculation,
    basePlan,
    molalityPlan,
  ]);

  const materiales = plan
    ? plan.equipmentIds
        .map((id) => labEquipment.find((item) => item.id === id))
        .filter(
          (item): item is (typeof labEquipment)[number] => item !== undefined,
        )
    : [];

  const isLiquidLiquid =
    component1?.physicalState === "liquid" &&
    component2?.physicalState === "liquid";

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
          Ingresá los componentes. QuimiLab analiza las sustancias, selecciona
          el método de preparación y realiza los cálculos correspondientes.
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

        {aqueousSolidSolute ? (
          <View style={styles.concentrationCard}>
            <Text style={styles.smallLabel}>CONCENTRACIÓN</Text>

            <Text style={styles.cardTitle}>
              ¿Cómo querés expresar la concentración?
            </Text>

            <View style={styles.methodRow}>
              {(
                [
                  ["molarity", "Molaridad"],
                  ["molality", "Molalidad"],
                  ["normality", "Normalidad"],
                ] as const
              ).map(([method, label]) => (
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
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>
              {concentrationMethod === "molarity"
                ? "Molaridad deseada"
                : concentrationMethod === "molality"
                  ? "Molalidad deseada"
                  : "Normalidad deseada"}
            </Text>

            <View style={styles.valueRow}>
              <TextInput
                value={concentrationInput}
                onChangeText={setConcentrationInput}
                keyboardType="decimal-pad"
                style={[styles.input, styles.flexInput]}
                placeholder="0,5"
              />

              <Text style={styles.suffix}>
                {concentrationMethod === "molarity"
                  ? "mol/L"
                  : concentrationMethod === "molality"
                    ? "mol/kg"
                    : "eq/L"}
              </Text>
            </View>

            {concentrationMethod === "molality" ? (
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
                  La molalidad utiliza masa de solvente. No utiliza volumen
                  final.
                </Text>
              </>
            ) : (
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
                  {concentrationMethod === "molarity"
                    ? "La molaridad utiliza el volumen final de la solución."
                    : "La normalidad utiliza equivalentes por litro de solución y depende de la reacción considerada."}
                </Text>
              </>
            )}

            {concentrationCalculation ? (
              "error" in concentrationCalculation ? (
                <View style={styles.errorBox}>
                  <Text style={styles.warningTitle}>No se puede calcular</Text>

                  <Text style={styles.warningText}>
                    {concentrationCalculation.error}
                  </Text>
                </View>
              ) : concentrationCalculation.method === "molarity" ? (
                <MolarityResult result={concentrationCalculation.result} />
              ) : concentrationCalculation.method === "molality" ? (
                <MolalityResult result={concentrationCalculation.result} />
              ) : (
                <NormalityResult result={concentrationCalculation.result} />
              )
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
            QuimiLab analiza las sustancias, la interacción entre los
            componentes, el método de concentración y el nivel de seguridad
            antes de generar los cálculos y el procedimiento.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function MolarityResult({
  result,
}: {
  result: {
    formula: string;
    molarity: number;
    volume: number;
    volumeUnit: "mL" | "L";
    volumeLiters: number;
    molesNeeded: number;
    gramsNeeded: number;
    molarMass: {
      molarMass: number | null;
    };
  };
}) {
  return (
    <>
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>Paso 1: calcular los moles</Text>

        <Text style={styles.equation}>n = M × V</Text>

        <Text style={styles.body}>
          n = {formatNumber(result.molarity)} ×{" "}
          {formatNumber(result.volumeLiters)} L
        </Text>

        <Text style={styles.strong}>
          n = {formatNumber(result.molesNeeded)} mol
        </Text>

        <Text style={styles.calculationTitle}>
          Paso 2: convertir moles a gramos
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

function MolalityResult({
  result,
}: {
  result: {
    formula: string;
    molality: number;
    solventMass: number;
    solventMassUnit: "g" | "kg";
    solventMassKg: number;
    molesNeeded: number;
    gramsNeeded: number;
  };
}) {
  return (
    <>
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>Paso 1: masa de solvente</Text>

        <Text style={styles.strong}>
          {formatNumber(result.solventMassKg)} kg
        </Text>

        <Text style={styles.calculationTitle}>Paso 2: calcular moles</Text>

        <Text style={styles.equation}>n = m × kg de solvente</Text>

        <Text style={styles.strong}>
          n = {formatNumber(result.molesNeeded)} mol
        </Text>
      </View>

      <ResultBox>
        {formatNumber(result.gramsNeeded, 2)} g de {result.formula}
        {"\n"}
        con {formatNumber(result.solventMass)} {result.solventMassUnit} de
        solvente para una molalidad de {formatNumber(result.molality)} mol/kg
      </ResultBox>
    </>
  );
}

function NormalityResult({
  result,
}: {
  result: {
    formula: string;
    normality: number;
    volume: number;
    volumeUnit: "mL" | "L";
    volumeLiters: number;
    molarity: number;
    equivalenceFactor: number;
    equivalentWeight: number;
    gramsNeeded: number;
    equivalenceExplanation: string;
    safetyWarning?: string;
  };
}) {
  return (
    <>
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>Factor de equivalencia</Text>

        <Text style={styles.strong}>n-factor = {result.equivalenceFactor}</Text>

        <Text style={styles.body}>{result.equivalenceExplanation}</Text>

        <Text style={styles.calculationTitle}>Peso equivalente</Text>

        <Text style={styles.equation}>PE = MM / factor</Text>

        <Text style={styles.strong}>
          PE = {formatNumber(result.equivalentWeight, 3)} g/eq
        </Text>

        <Text style={styles.calculationTitle}>Relación con la molaridad</Text>

        <Text style={styles.strong}>
          M = {formatNumber(result.molarity)} mol/L
        </Text>

        <Text style={styles.calculationTitle}>Masa necesaria</Text>

        <Text style={styles.equation}>masa = N × V × PE</Text>
      </View>

      <ResultBox>
        {formatNumber(result.gramsNeeded, 2)} g de {result.formula}
        {"\n"}
        para preparar {formatNumber(result.volume)} {result.volumeUnit} de
        solución {formatNumber(result.normality)} N
      </ResultBox>

      {result.safetyWarning ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Seguridad</Text>

          <Text style={styles.warningText}>{result.safetyWarning}</Text>
        </View>
      ) : null}
    </>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
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
    flexGrow: 1,
    minWidth: "30%",
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 12,
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

  unitButtonActive: {
    backgroundColor: "#0d887d",
    borderColor: "#0d887d",
  },

  unitText: {
    color: "#173b40",
    fontWeight: "700",
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
    fontSize: 19,
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

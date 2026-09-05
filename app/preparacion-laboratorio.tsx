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
    SafetyLevel,
} from "../chemistry/labPreparation";

import { classifyMixture } from "../chemistry/classifyMixture";
import { inferPreparationType } from "../chemistry/inferPreparationType";
import { getInteractionWithWater } from "../chemistry/substanceInteractions";
import { findExactSubstance, SubstanceRecord } from "../chemistry/substances";
import { labEquipment } from "../data/labEquipment";

type PreparationObjective = "combineComponents" | "dilution";

export default function PreparacionLaboratorioScreen() {
  const [component1Input, setComponent1Input] = useState("CaCl2");

  const [component2Input, setComponent2Input] = useState("H2O");

  const [objective, setObjective] =
    useState<PreparationObjective>("combineComponents");

  const [cantidadFinal, setCantidadFinal] = useState("500");

  const [unidadFinal, setUnidadFinal] = useState<"mL" | "L" | "g" | "kg">("mL");

  const cantidadNumerica = Number(cantidadFinal.replace(",", "."));

  const component1 = useMemo(() => {
    if (!component1Input.trim()) return null;

    return findExactSubstance(component1Input) ?? null;
  }, [component1Input]);

  const component2 = useMemo(() => {
    if (!component2Input.trim()) return null;

    return findExactSubstance(component2Input) ?? null;
  }, [component2Input]);

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
    });
  }, [component1, component2, objective]);

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

  const plan = useMemo(() => {
    if (!automaticPreparation.type) {
      return null;
    }

    if (
      automaticPreparation.type === "solidLiquidSolution" &&
      !mixtureAnalysis
    ) {
      return null;
    }

    return createLabPreparationPlan({
      type: automaticPreparation.type,

      finalAmount:
        Number.isFinite(cantidadNumerica) && cantidadNumerica > 0
          ? cantidadNumerica
          : undefined,

      finalUnit: unidadFinal,

      safetyLevel,

      mixtureType:
        automaticPreparation.type === "solidLiquidSolution"
          ? mixtureAnalysis?.type
          : undefined,
    });
  }, [
    automaticPreparation,
    cantidadNumerica,
    unidadFinal,
    safetyLevel,
    mixtureAnalysis,
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
          Ingresá los componentes de la preparación. QuimiLab identificará sus
          estados físicos y analizará qué tipo de preparación corresponde.
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
              styles.objectiveCard,
              objective === "combineComponents" && styles.objectiveCardActive,
            ]}
            onPress={() => setObjective("combineComponents")}
          >
            <Text
              style={[
                styles.objectiveTitle,
                objective === "combineComponents" &&
                  styles.objectiveTitleActive,
              ]}
            >
              Combinar los componentes
            </Text>

            <Text style={styles.objectiveDescription}>
              QuimiLab analizará los estados físicos y, cuando existan datos
              suficientes, la solubilidad o miscibilidad.
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.objectiveCard,
              objective === "dilution" && styles.objectiveCardActive,
            ]}
            onPress={() => setObjective("dilution")}
          >
            <Text
              style={[
                styles.objectiveTitle,
                objective === "dilution" && styles.objectiveTitleActive,
              ]}
            >
              Diluir una solución madre
            </Text>

            <Text style={styles.objectiveDescription}>
              Preparar una solución menos concentrada a partir de una solución
              madre.
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

          {automaticPreparation.detectedAutomatically &&
            !automaticPreparation.needsMoreData && (
              <View style={styles.detectedBadge}>
                <Text style={styles.detectedBadgeText}>
                  Detectado automáticamente por QuimiLab
                </Text>
              </View>
            )}

          {automaticPreparation.needsMoreData && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                Se necesita más información
              </Text>
            </View>
          )}
        </View>

        {component1 && component2 && objective === "combineComponents" && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisLabel}>
              ANÁLISIS DE LOS COMPONENTES
            </Text>

            <Text style={styles.analysisTitle}>
              {component1.name} + {component2.name}
            </Text>

            {waterBasedInteraction ? (
              <>
                <Text style={styles.analysisText}>
                  {waterBasedInteraction.description}
                </Text>

                {mixtureAnalysis && (
                  <>
                    <Text style={styles.analysisResult}>
                      Resultado: {mixtureAnalysis.label}
                    </Text>

                    <Text style={styles.analysisText}>
                      {mixtureAnalysis.explanation}
                    </Text>
                  </>
                )}

                {waterBasedInteraction.thermalBehavior === "exothermic" && (
                  <View style={styles.warningInside}>
                    <Text style={styles.warningTitle}>
                      Comportamiento térmico
                    </Text>

                    <Text style={styles.warningText}>
                      {waterBasedInteraction.warning ??
                        "La preparación puede liberar calor."}
                    </Text>
                  </View>
                )}

                {waterBasedInteraction.thermalBehavior === "endothermic" && (
                  <View style={styles.infoInside}>
                    <Text style={styles.infoTitle}>Comportamiento térmico</Text>

                    <Text style={styles.infoText}>
                      La disolución puede absorber calor y disminuir la
                      temperatura de la preparación.
                    </Text>
                  </View>
                )}

                {waterBasedInteraction.thermalBehavior !== "exothermic" &&
                  waterBasedInteraction.thermalBehavior !== "endothermic" &&
                  waterBasedInteraction.warning && (
                    <View style={styles.infoInside}>
                      <Text style={styles.infoTitle}>Observación</Text>

                      <Text style={styles.infoText}>
                        {waterBasedInteraction.warning}
                      </Text>
                    </View>
                  )}
              </>
            ) : component1.formula === "H2O" && component2.formula === "H2O" ? (
              <Text style={styles.analysisText}>
                Ambos componentes corresponden a agua. No se trata de una mezcla
                de sustancias diferentes.
              </Text>
            ) : (
              <View style={styles.pendingAnalysis}>
                <Text style={styles.pendingAnalysisTitle}>
                  Interacción todavía no registrada
                </Text>

                <Text style={styles.pendingAnalysisText}>
                  QuimiLab conoce ambas sustancias y sus estados físicos, pero
                  todavía no posee datos suficientes sobre la interacción
                  específica entre estos dos componentes. No se asumirá que son
                  solubles, miscibles o inmiscibles.
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.inputCard}>
          <Text style={styles.label}>Cantidad o volumen final</Text>

          <TextInput
            value={cantidadFinal}
            onChangeText={setCantidadFinal}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholder="500"
          />

          <Text style={styles.label}>Unidad</Text>

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

        {plan ? (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>PLAN DE PREPARACIÓN</Text>

              <Text style={styles.resultTitle}>{plan.title}</Text>

              <Text style={styles.resultDescription}>{plan.description}</Text>
            </View>

            {materiales.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Materiales necesarios</Text>

                {materiales.map((material) => (
                  <View key={material.id} style={styles.materialRow}>
                    <Text style={styles.bullet}>•</Text>

                    <View style={styles.materialContent}>
                      <Text style={styles.materialName}>{material.nombre}</Text>

                      <Text style={styles.materialReason}>
                        {material.porqueUsarlo}
                      </Text>
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

            <Text style={styles.pendingText}>
              QuimiLab todavía necesita información suficiente sobre los
              componentes o su interacción antes de seleccionar materiales y
              generar un procedimiento.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Cómo decide QuimiLab?</Text>

          <Text style={styles.infoText}>
            QuimiLab identifica cada componente de forma independiente y
            consulta su estado físico, solubilidad, comportamiento térmico y
            nivel de seguridad.
          </Text>

          <Text style={styles.infoText}>
            Cuando no existen datos suficientes sobre la interacción entre dos
            sustancias, la aplicación no inventa un resultado y solicita más
            información.
          </Text>
        </View>
      </ScrollView>
    </>
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
          <Text style={styles.identifiedLabel}>SUSTANCIA IDENTIFICADA</Text>

          <Text style={styles.identifiedName}>{substance.name}</Text>

          <Text style={styles.identifiedFormula}>{substance.formula}</Text>

          <Text style={styles.identifiedData}>
            Estado físico: {getPhysicalStateLabel(substance.physicalState)}
          </Text>

          <Text style={styles.identifiedData}>
            Seguridad: {getSafetyLabel(substance.safetyClassification)}
          </Text>
        </View>
      ) : value.trim() !== "" ? (
        <Text style={styles.notFoundText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f8",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 12,
  },

  subtitle: {
    color: "#617a7b",
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 15,
  },

  inputCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d3e2e0",
    marginBottom: 22,
  },

  label: {
    fontWeight: "800",
    color: "#173b40",
    fontSize: 17,
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: "#173b40",
  },

  identifiedBox: {
    marginTop: 14,
    backgroundColor: "#eaf7f5",
    padding: 15,
    borderRadius: 14,
  },

  identifiedLabel: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 5,
  },

  identifiedName: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 20,
  },

  identifiedFormula: {
    color: "#617a7b",
    fontSize: 16,
    marginTop: 2,
    marginBottom: 8,
  },

  identifiedData: {
    color: "#4f696b",
    fontSize: 14,
    lineHeight: 21,
  },

  notFoundText: {
    marginTop: 10,
    color: "#9a6811",
    fontSize: 14,
  },

  objectiveCard: {
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
  },

  objectiveCardActive: {
    borderColor: "#0d887d",
    backgroundColor: "#daf1ed",
  },

  objectiveTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 6,
  },

  objectiveTitleActive: {
    color: "#0d887d",
  },

  objectiveDescription: {
    color: "#617a7b",
    fontSize: 15,
    lineHeight: 22,
  },

  detectionCard: {
    backgroundColor: "#173b40",
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
  },

  detectionLabel: {
    color: "#8ddbd0",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 7,
  },

  detectionTitle: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 9,
  },

  detectionText: {
    color: "#d8e9e8",
    fontSize: 16,
    lineHeight: 24,
  },

  detectedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#daf1ed",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginTop: 15,
  },

  detectedBadgeText: {
    color: "#0d746b",
    fontWeight: "800",
    fontSize: 13,
  },

  pendingBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff0c7",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginTop: 15,
  },

  pendingBadgeText: {
    color: "#805a08",
    fontWeight: "800",
    fontSize: 13,
  },

  analysisCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d5e4e2",
    padding: 20,
    marginBottom: 22,
  },

  analysisLabel: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 6,
  },

  analysisTitle: {
    color: "#173b40",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  analysisResult: {
    color: "#0d887d",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },

  analysisText: {
    color: "#4f696b",
    fontSize: 16,
    lineHeight: 24,
  },

  pendingAnalysis: {
    backgroundColor: "#fff6df",
    borderRadius: 15,
    padding: 16,
  },

  pendingAnalysisTitle: {
    color: "#805a08",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 7,
  },

  pendingAnalysisText: {
    color: "#6c562b",
    fontSize: 15,
    lineHeight: 23,
  },

  unitRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  unitButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cddfdd",
    backgroundColor: "#ffffff",
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

  resultCard: {
    backgroundColor: "#0d887d",
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
  },

  resultLabel: {
    color: "#d9f4ef",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 8,
  },

  resultTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },

  resultDescription: {
    color: "#e6f7f4",
    fontSize: 17,
    lineHeight: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d5e4e2",
    padding: 20,
    marginBottom: 20,
  },

  materialRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  bullet: {
    color: "#0d887d",
    fontSize: 22,
    marginRight: 10,
  },

  materialContent: {
    flex: 1,
  },

  materialName: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 3,
  },

  materialReason: {
    color: "#617a7b",
    fontSize: 15,
    lineHeight: 22,
  },

  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#daf1ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  stepNumberText: {
    color: "#0d887d",
    fontWeight: "800",
  },

  stepText: {
    flex: 1,
    color: "#4f696b",
    fontSize: 16,
    lineHeight: 24,
  },

  warningCard: {
    backgroundColor: "#fff6df",
    borderWidth: 1,
    borderColor: "#ddb85e",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  warningInside: {
    backgroundColor: "#fff6df",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ddb85e",
  },

  warningTitle: {
    color: "#805a08",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 8,
  },

  warningText: {
    color: "#6c562b",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },

  infoCard: {
    backgroundColor: "#e0f4f0",
    borderRadius: 18,
    padding: 20,
  },

  infoInside: {
    backgroundColor: "#e0f4f0",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  infoTitle: {
    color: "#173b40",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 9,
  },

  infoText: {
    color: "#4f696b",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },

  pendingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#d3e2e0",
    marginBottom: 20,
  },

  pendingTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 8,
  },

  pendingText: {
    color: "#617a7b",
    fontSize: 16,
    lineHeight: 24,
  },
});

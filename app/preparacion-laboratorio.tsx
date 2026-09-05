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
    PreparationType,
    SafetyLevel,
} from "../chemistry/labPreparation";

import { classifyMixture } from "../chemistry/classifyMixture";
import { getInteractionWithWater } from "../chemistry/substanceInteractions";
import { findExactSubstance } from "../chemistry/substances";
import { labEquipment } from "../data/labEquipment";

type PreparationOption = {
  type: PreparationType;
  title: string;
  description: string;
};

const preparationOptions: PreparationOption[] = [
  {
    type: "solidLiquidSolution",
    title: "Sólido + líquido",
    description:
      "QuimiLab analiza la solubilidad para decidir si se forma una solución, suspensión o dispersión.",
  },
  {
    type: "solidSolidMixture",
    title: "Sólido + sólido",
    description:
      "Preparación y homogeneización de dos o más componentes sólidos.",
  },
  {
    type: "liquidDilution",
    title: "Dilución",
    description:
      "Preparación de una solución menos concentrada a partir de una solución madre.",
  },
  {
    type: "viscousPreparation",
    title: "Sustancia viscosa o semisólida",
    description:
      "Preparaciones que requieren considerar masa, viscosidad o densidad.",
  },
];

export default function PreparacionLaboratorioScreen() {
  const [formula, setFormula] = useState("CaCl2");

  const [tipo, setTipo] = useState<PreparationType>("solidLiquidSolution");

  const [cantidadFinal, setCantidadFinal] = useState("500");

  const [unidadFinal, setUnidadFinal] = useState<"mL" | "L" | "g" | "kg">("mL");

  const cantidadNumerica = Number(cantidadFinal.replace(",", "."));

  const substanceData = useMemo(() => {
    if (!formula.trim()) {
      return null;
    }

    return findExactSubstance(formula) ?? null;
  }, [formula]);

  const interactionData = useMemo(() => {
    if (!formula.trim()) {
      return null;
    }

    return getInteractionWithWater(formula);
  }, [formula]);

  const safetyLevel = useMemo<SafetyLevel>(() => {
    switch (substanceData?.safetyClassification) {
      case "requiresSupervision":
        return "supervision";

      case "highPrecaution":
        return "highPrecaution";

      default:
        return "educational";
    }
  }, [substanceData]);

  const mixtureAnalysis = useMemo(() => {
    if (tipo !== "solidLiquidSolution") {
      return null;
    }

    if (!interactionData) {
      return classifyMixture({
        component1State: "solid",
        component2State: "liquid",
        interaction: "unknown",
      });
    }

    return classifyMixture({
      component1State: "solid",
      component2State: "liquid",
      interaction: interactionData.interaction,
    });
  }, [tipo, interactionData]);

  const plan = useMemo(() => {
    return createLabPreparationPlan({
      type: tipo,

      finalAmount:
        Number.isFinite(cantidadNumerica) && cantidadNumerica > 0
          ? cantidadNumerica
          : undefined,

      finalUnit: unidadFinal,

      safetyLevel,

      mixtureType:
        tipo === "solidLiquidSolution" ? mixtureAnalysis?.type : undefined,
    });
  }, [tipo, cantidadNumerica, unidadFinal, safetyLevel, mixtureAnalysis]);

  const materiales = plan.equipmentIds
    .map((id) => labEquipment.find((item) => item.id === id))
    .filter(
      (item): item is (typeof labEquipment)[number] => item !== undefined,
    );

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
          QuimiLab analiza la sustancia, identifica su comportamiento y
          selecciona materiales, procedimiento y nivel de seguridad.
        </Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Fórmula química o nombre</Text>

          <TextInput
            value={formula}
            onChangeText={setFormula}
            style={styles.input}
            placeholder="Ejemplo: CaCl2 o Talco"
            autoCapitalize="none"
          />

          <Text style={styles.helperText}>
            Podés escribir una fórmula química o el nombre de una sustancia
            registrada en QuimiLab.
          </Text>
        </View>

        {substanceData && (
          <View style={styles.substanceCard}>
            <Text style={styles.substanceLabel}>SUSTANCIA IDENTIFICADA</Text>

            <Text style={styles.substanceName}>{substanceData.name}</Text>

            <Text style={styles.substanceFormula}>{substanceData.formula}</Text>

            <View style={styles.dataRow}>
              <Text style={styles.dataTitle}>Estado físico:</Text>

              <Text style={styles.dataText}>
                {getPhysicalStateLabel(substanceData.physicalState)}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataTitle}>Nivel de seguridad:</Text>

              <Text style={styles.dataText}>
                {getSafetyLabel(substanceData.safetyClassification)}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Tipo de preparación</Text>

        {preparationOptions.map((option) => {
          const active = tipo === option.type;

          return (
            <Pressable
              key={option.type}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setTipo(option.type)}
            >
              <Text
                style={[styles.optionTitle, active && styles.optionTitleActive]}
              >
                {option.title}
              </Text>

              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          );
        })}

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

        {tipo === "solidLiquidSolution" && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisLabel}>ANÁLISIS QUÍMICO</Text>

            <Text style={styles.analysisTitle}>
              {substanceData?.name ?? formula.trim() ?? "Sin sustancia"}
            </Text>

            {interactionData ? (
              <>
                <Text style={styles.analysisText}>
                  {interactionData.description}
                </Text>

                {mixtureAnalysis && (
                  <>
                    <Text style={styles.analysisResult}>
                      Tipo de preparación: {mixtureAnalysis.label}
                    </Text>

                    <Text style={styles.analysisText}>
                      {mixtureAnalysis.explanation}
                    </Text>
                  </>
                )}

                {interactionData.thermalBehavior === "exothermic" && (
                  <View style={styles.warningInside}>
                    <Text style={styles.warningTitle}>
                      Comportamiento térmico
                    </Text>

                    <Text style={styles.warningText}>
                      {interactionData.warning ??
                        "La disolución puede liberar calor y aumentar la temperatura de la preparación."}
                    </Text>
                  </View>
                )}

                {interactionData.thermalBehavior === "endothermic" && (
                  <View style={styles.infoInside}>
                    <Text style={styles.infoTitle}>Comportamiento térmico</Text>

                    <Text style={styles.infoText}>
                      La disolución puede absorber calor y disminuir la
                      temperatura de la preparación.
                    </Text>
                  </View>
                )}

                {interactionData.thermalBehavior !== "exothermic" &&
                  interactionData.thermalBehavior !== "endothermic" &&
                  interactionData.warning && (
                    <View style={styles.infoInside}>
                      <Text style={styles.infoTitle}>Observación</Text>

                      <Text style={styles.infoText}>
                        {interactionData.warning}
                      </Text>
                    </View>
                  )}
              </>
            ) : (
              <Text style={styles.analysisText}>
                QuimiLab todavía no posee información suficiente sobre el
                comportamiento de esta sustancia en agua. No se asumirá que
                forma una solución.
              </Text>
            )}
          </View>
        )}

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

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Cómo decide QuimiLab?</Text>

          <Text style={styles.infoText}>
            QuimiLab consulta una única base de sustancias y considera el estado
            físico, la solubilidad, el comportamiento térmico, el tipo de
            preparación y el nivel de seguridad.
          </Text>

          <Text style={styles.infoText}>
            Si una sustancia requiere supervisión o precauciones especiales, el
            procedimiento se adapta automáticamente.
          </Text>
        </View>
      </ScrollView>
    </>
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

  helperText: {
    color: "#617a7b",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  substanceCard: {
    backgroundColor: "#eaf7f5",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#b9ddd8",
    marginBottom: 25,
  },

  substanceLabel: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 6,
  },

  substanceName: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 24,
  },

  substanceFormula: {
    color: "#617a7b",
    fontSize: 17,
    marginTop: 3,
    marginBottom: 14,
  },

  dataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 7,
  },

  dataTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 15,
    marginRight: 5,
  },

  dataText: {
    color: "#4f696b",
    fontSize: 15,
  },

  optionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#d3e2e0",
    padding: 18,
    marginBottom: 12,
  },

  optionCardActive: {
    backgroundColor: "#daf1ed",
    borderColor: "#0d887d",
  },

  optionTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 19,
    marginBottom: 5,
  },

  optionTitleActive: {
    color: "#0d887d",
  },

  optionDescription: {
    color: "#617a7b",
    fontSize: 15,
    lineHeight: 22,
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
});

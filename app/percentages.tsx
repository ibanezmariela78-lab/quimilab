import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    calculateMassMassPercentage,
    calculateMassVolumePercentage,
    calculateVolumeVolumePercentage,
    type PercentageMassUnit,
    type PercentageMode,
    type PercentageResult,
    type PercentageVolumeUnit,
} from "@/chemistry/percentages";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

const materialsByMode: Record<PercentageMode, string[]> = {
  "m/m": [
    "Balanza",
    "Espátula",
    "Recipientes para pesar",
    "Mortero si corresponde",
    "Recipiente de mezcla",
  ],
  "m/v": [
    "Balanza",
    "Espátula",
    "Vaso de precipitados",
    "Varilla",
    "Matraz aforado cuando corresponda",
    "Solvente",
  ],
  "v/v": [
    "Material volumétrico adecuado",
    "Recipiente",
    "Matraz aforado cuando corresponda",
  ],
};

const modeDescriptions: Record<PercentageMode, string> = {
  "m/m":
    "5 % m/m significa que hay 5 g de componente cada 100 g de preparación final.",
  "m/v":
    "5 % m/v significa que hay 5 g de componente cada 100 mL de preparación final.",
  "v/v":
    "10 % v/v significa que hay 10 mL del componente cada 100 mL de preparación final.",
};

const modeLabels: Record<PercentageMode, string> = {
  "m/m": "% m/m",
  "m/v": "% m/v",
  "v/v": "% v/v",
};

type Colors = {
  background: string;
  surface: string;
  pressed: string;
  text: string;
  muted: string;
  accent: string;
  soft: string;
  border: string;
  input: string;
  warning: string;
};

export default function PercentagesScreen() {
  const [mode, setMode] = useState<PercentageMode>("m/m");
  const [component, setComponent] = useState("");
  const [percentage, setPercentage] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [unit, setUnit] = useState<PercentageMassUnit | PercentageVolumeUnit>(
    "g",
  );
  const [result, setResult] = useState<PercentageResult | null>(null);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors: Colors = isDark
    ? {
        background: "#10242A",
        surface: "#18363D",
        pressed: "#21454D",
        text: "#F1FAF8",
        muted: "#B7D1CD",
        accent: "#5DD3B6",
        soft: "#214D4A",
        border: "#2C5559",
        input: "#0D1D22",
        warning: "#F2C879",
      }
    : {
        background: "#F4F8F7",
        surface: "#FFFFFF",
        pressed: "#E8F3F0",
        text: "#17343A",
        muted: "#5A7375",
        accent: "#087F73",
        soft: "#DDF2EC",
        border: "#D6E5E0",
        input: "#FFFFFF",
        warning: "#9A6815",
      };
  const isMassMode = mode === "m/m";

  function handleModeChange(nextMode: PercentageMode) {
    setMode(nextMode);
    setUnit(nextMode === "m/m" ? "g" : "mL");
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    const calculation =
      mode === "m/m"
        ? calculateMassMassPercentage(
            component,
            percentage,
            finalAmount,
            unit as PercentageMassUnit,
          )
        : mode === "m/v"
          ? calculateMassVolumePercentage(
              component,
              percentage,
              finalAmount,
              unit as PercentageVolumeUnit,
            )
          : calculateVolumeVolumePercentage(
              component,
              percentage,
              finalAmount,
              unit as PercentageVolumeUnit,
            );
    if ("error" in calculation) {
      setResult(null);
      setError(calculation.error);
    } else {
      setResult(calculation);
      setError("");
    }
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={[styles.mark, { backgroundColor: colors.soft }]}>
              <Ionicons
                name="pie-chart-outline"
                size={25}
                color={colors.accent}
              />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Preparaciones por porcentaje
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Elegí cómo está expresada la concentración y QuimiLab realizará el
              cálculo paso a paso.
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Tipo de porcentaje
            </ThemedText>
            <View style={styles.segmented}>
              {(["m/m", "m/v", "v/v"] as const).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${modeLabels[option]}`}
                  onPress={() => handleModeChange(option)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor:
                        mode === option ? colors.accent : colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color:
                        mode === option
                          ? isDark
                            ? "#10242A"
                            : "#FFFFFF"
                          : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {modeLabels[option]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <Field
              label={
                isMassMode || mode === "m/v"
                  ? "Sustancia o fórmula"
                  : "Nombre del componente líquido"
              }
              value={component}
              onChangeText={setComponent}
              placeholder={
                isMassMode
                  ? "NaCl o componente"
                  : mode === "m/v"
                    ? "NaCl"
                    : "Componente líquido"
              }
              colors={colors}
            />
            <Field
              label="Porcentaje"
              value={percentage}
              onChangeText={setPercentage}
              placeholder="5"
              keyboardType="decimal-pad"
              suffix="%"
              colors={colors}
            />
            <Field
              label={isMassMode ? "Masa final" : "Volumen final"}
              value={finalAmount}
              onChangeText={setFinalAmount}
              placeholder={isMassMode ? "500" : "500"}
              keyboardType="decimal-pad"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              {isMassMode ? "Unidad de masa" : "Unidad de volumen"}
            </ThemedText>
            <View style={styles.segmented}>
              {(isMassMode
                ? (["g", "kg"] as const)
                : (["mL", "L"] as const)
              ).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${option}`}
                  onPress={() => setUnit(option)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor:
                        unit === option ? colors.accent : colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color:
                        unit === option
                          ? isDark
                            ? "#10242A"
                            : "#FFFFFF"
                          : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={handleCalculate}
              accessibilityRole="button"
              accessibilityLabel="Calcular porcentaje"
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? colors.pressed : colors.accent },
              ]}
            >
              <Ionicons
                name="calculator-outline"
                size={19}
                color={isDark ? "#10242A" : "#FFFFFF"}
              />
              <ThemedText
                style={{
                  color: isDark ? "#10242A" : "#FFFFFF",
                  fontWeight: "800",
                }}
              >
                CALCULAR
              </ThemedText>
            </Pressable>
          </View>

          {error ? (
            <View
              style={[
                styles.message,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={colors.warning}
              />
              <ThemedText style={[styles.body, { color: colors.text }]}>
                {error}
              </ThemedText>
            </View>
          ) : null}
          {result ? (
            <PercentageResultView result={result} colors={colors} />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "decimal-pad";
  suffix?: string;
  colors: Colors;
};
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  suffix,
  colors,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={[styles.label, { color: colors.text }]}>
        {label}
      </ThemedText>
      <View style={styles.inputRow}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={value}
        />
        {suffix ? (
          <ThemedText style={[styles.suffix, { color: colors.muted }]}>
            {suffix}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function PercentageResultView({
  result,
  colors,
}: {
  result: PercentageResult;
  colors: Colors;
}) {
  const knownSubstance = result.molarMass?.substanceName;
  const calculationLabel =
    result.mode === "m/m"
      ? "Masa de componente"
      : result.mode === "m/v"
        ? "Gramos de componente"
        : "Volumen de componente";
  const componentUnit =
    result.mode === "m/m" || result.mode === "m/v" ? "g" : "mL";
  const finalUnit = result.mode === "m/m" ? "g" : "mL";
  const procedure =
    result.mode === "m/m"
      ? [
          "Pesá cada componente.",
          "Colocalos en un recipiente adecuado.",
          "Homogeneizá de manera apropiada.",
          "Rotulá la preparación.",
        ]
      : result.mode === "m/v"
        ? [
            "Pesá el componente sólido.",
            "Disolvelo en una cantidad menor de solvente cuando corresponda.",
            "Completá hasta el volumen final cuando corresponda.",
            "Rotulá la preparación.",
          ]
        : [
            "Medí el componente con material volumétrico adecuado.",
            "Completá hasta alcanzar el volumen final de la preparación.",
            "Rotulá la preparación.",
          ];
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Resultado {modeLabels[result.mode]}
        </ThemedText>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          {calculationLabel}: {format(result.componentAmountBase)}{" "}
          {componentUnit}
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Preparación final: {format(result.finalAmountBase)} {finalUnit}
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Sustancia y datos
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.text }]}>
          Componente: {knownSubstance ?? result.component}
        </ThemedText>
        {result.mode === "m/v" &&
        result.molarMass?.molarMass !== null &&
        result.molarMass?.molarMass !== undefined ? (
          <ThemedText style={[styles.body, { color: colors.muted }]}>
            Fórmula: {result.component} · Masa molar:{" "}
            {format(result.molarMass.molarMass)} g/mol
          </ThemedText>
        ) : null}
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Porcentaje: {format(result.percentage)} {modeLabels[result.mode]}
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Cálculo
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          {result.mode === "m/m"
            ? `masa de componente = (${format(result.percentage)} × ${format(result.finalAmountBase)}) / 100\nmasa de componente = ${format(result.componentAmountBase)} g\nmasa restante = ${format(result.remainingAmountBase ?? 0)} g\nmasa total = ${format(result.finalAmountBase)} g`
            : result.mode === "m/v"
              ? `gramos de componente = (${format(result.percentage)} × ${format(result.finalAmountBase)}) / 100\ngramos de componente = ${format(result.componentAmountBase)} g`
              : `volumen de componente = (${format(result.percentage)} × ${format(result.finalAmountBase)}) / 100\nvolumen de componente = ${format(result.componentAmountBase)} mL`}
        </ThemedText>
      </View>
      <View
        style={[
          styles.note,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={colors.accent}
        />
        <ThemedText style={[styles.body, { color: colors.text }]}>
          {modeDescriptions[result.mode]}
          {result.mode === "m/m"
            ? "  La masa final es la masa total de la preparación."
            : result.mode === "m/v"
              ? "  No significa agregar esa masa al mismo volumen de agua: primero se disuelve y luego se completa al volumen final cuando corresponda."
              : "  No se supone que los volúmenes sean siempre perfectamente aditivos: se mide el componente y luego se completa al volumen final."}
        </ThemedText>
      </View>
      {result.mode === "m/m" || result.mode === "m/v" ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Tipo de preparación
          </ThemedText>
          <ThemedText style={[styles.body, { color: colors.muted }]}>
            {result.mode === "m/m"
              ? "Mezcla o preparación masa/masa"
              : "Preparación masa/volumen"}
          </ThemedText>
        </View>
      ) : null}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Materiales
        </ThemedText>
        {materialsByMode[result.mode].map((item) => (
          <ThemedText
            key={item}
            style={[styles.listItem, { color: colors.muted }]}
          >
            • {item}
          </ThemedText>
        ))}
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Procedimiento guiado
        </ThemedText>
        {procedure.map((step, index) => (
          <ThemedText
            key={step}
            style={[styles.listItem, { color: colors.muted }]}
          >
            {index + 1}. {step}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

function format(value: number): string {
  return value
    .toFixed(3)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  header: { marginBottom: 22 },
  mark: {
    alignItems: "center",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginBottom: 18,
    width: 52,
  },
  title: { fontSize: 30, fontWeight: "800", lineHeight: 37, marginBottom: 10 },
  intro: { fontSize: 15, lineHeight: 23 },
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 12, padding: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  inputRow: { alignItems: "center", flexDirection: "row" },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suffix: { fontSize: 14, marginLeft: 8 },
  segmented: { flexDirection: "row", gap: 8, marginBottom: 16 },
  segment: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 9,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
  },
  message: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginTop: 20,
    padding: 16,
  },
  resultArea: { marginTop: 20 },
  resultCard: { borderRadius: 12, marginBottom: 12, padding: 18 },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  body: { flex: 1, fontSize: 14, lineHeight: 21 },
  equation: { fontFamily: "monospace", fontSize: 14, lineHeight: 23 },
  listItem: { fontSize: 14, lineHeight: 23 },
  note: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 12,
    padding: 16,
  },
});

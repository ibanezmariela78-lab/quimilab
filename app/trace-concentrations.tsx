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
    calculateDiluteAqueousTrace,
    calculateMassMassTrace,
    type TraceConcentrationResult,
    type TraceMassUnit,
    type TraceMode,
    type TraceUnit,
    type TraceVolumeUnit,
} from "@/chemistry/traceConcentration";
import { formatMass } from "@/chemistry/traceConversions";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

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

const modeLabels: Record<TraceMode, string> = {
  "mass-mass": "Masa/masa",
  "dilute-aqueous": "Solución acuosa diluida",
};

export default function TraceConcentrationsScreen() {
  const [traceUnit, setTraceUnit] = useState<TraceUnit>("ppm");
  const [mode, setMode] = useState<TraceMode>("mass-mass");
  const [component, setComponent] = useState("");
  const [concentration, setConcentration] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [amountUnit, setAmountUnit] = useState<TraceMassUnit | TraceVolumeUnit>(
    "kg",
  );
  const [result, setResult] = useState<TraceConcentrationResult | null>(null);
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
  const isMassMode = mode === "mass-mass";

  function handleModeChange(nextMode: TraceMode) {
    setMode(nextMode);
    setAmountUnit(nextMode === "mass-mass" ? "kg" : "mL");
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    const calculation = isMassMode
      ? calculateMassMassTrace(
          component,
          concentration,
          finalAmount,
          amountUnit as TraceMassUnit,
          traceUnit,
        )
      : calculateDiluteAqueousTrace(
          component,
          concentration,
          finalAmount,
          amountUnit as TraceVolumeUnit,
          traceUnit,
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
                name="analytics-outline"
                size={25}
                color={colors.accent}
              />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Concentraciones de trazas
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              ppm y ppb se utilizan para expresar cantidades muy pequeñas de una
              sustancia dentro de una preparación.
            </ThemedText>
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Unidad de concentración
            </ThemedText>
            <Segment
              options={["ppm", "ppb"]}
              value={traceUnit}
              onChange={setTraceUnit}
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Tipo de cálculo
            </ThemedText>
            <View style={styles.modeList}>
              {(["mass-mass", "dilute-aqueous"] as const).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => handleModeChange(option)}
                  style={[
                    styles.modeOption,
                    {
                      backgroundColor:
                        mode === option ? colors.soft : colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText style={{ color: colors.text, fontWeight: "700" }}>
                    {modeLabels[option]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <Field
              label="Nombre o fórmula del componente"
              value={component}
              onChangeText={setComponent}
              placeholder="Componente"
              colors={colors}
            />
            <Field
              label="Concentración deseada"
              value={concentration}
              onChangeText={setConcentration}
              placeholder={traceUnit === "ppm" ? "100" : "50"}
              keyboardType="decimal-pad"
              suffix={traceUnit}
              colors={colors}
            />
            <Field
              label={
                isMassMode ? "Masa final de la preparación" : "Volumen final"
              }
              value={finalAmount}
              onChangeText={setFinalAmount}
              placeholder={isMassMode ? "2" : "500"}
              keyboardType="decimal-pad"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              {isMassMode ? "Unidad de masa" : "Unidad de volumen"}
            </ThemedText>
            <Segment
              options={isMassMode ? ["g", "kg"] : ["mL", "L"]}
              value={amountUnit}
              onChange={(value) =>
                setAmountUnit(value as TraceMassUnit & TraceVolumeUnit)
              }
              colors={colors}
            />
            <Pressable
              onPress={handleCalculate}
              accessibilityRole="button"
              accessibilityLabel="Calcular concentración de trazas"
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
          {result ? <TraceResult result={result} colors={colors} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Segment<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  colors: Colors;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[
            styles.segment,
            {
              backgroundColor: value === option ? colors.accent : colors.input,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText
            style={{
              color: value === option ? "#FFFFFF" : colors.text,
              fontWeight: "700",
            }}
          >
            {option}
          </ThemedText>
        </Pressable>
      ))}
    </View>
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

function TraceResult({
  result,
  colors,
}: {
  result: TraceConcentrationResult;
  colors: Colors;
}) {
  const outputUnit = result.unit === "ppm" ? "mg" : "µg";
  const outputValue =
    result.unit === "ppm"
      ? result.componentMass.milligrams
      : result.componentMass.micrograms;
  const isVerySmall = result.componentMassGrams < 0.001;
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          {result.concentration} {result.unit} de {result.component}
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          {result.mode === "mass-mass"
            ? `Preparación final: ${formatNumber(result.finalAmount)} ${result.finalUnit}`
            : `Volumen final: ${formatNumber(result.finalAmount)} ${result.finalUnit}`}
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Cálculo
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          {result.calculation}
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Resultado
        </ThemedText>
        <ThemedText style={[styles.finalValue, { color: colors.text }]}>
          {result.approximation ? "≈ " : ""}
          {formatNumber(outputValue)} {outputUnit}
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          {result.approximation
            ? "Cantidad aproximada de componente para la solución acuosa diluida."
            : "Cantidad de componente en la preparación final."}
        </ThemedText>
        {result.mode === "mass-mass" ? (
          <ThemedText
            style={[styles.body, { color: colors.muted, marginTop: 6 }]}
          >
            {formatMass(
              result.unit === "ppm"
                ? result.componentMass.grams
                : result.componentMass.milligrams,
              result.unit === "ppm" ? "g" : "mg",
            )}
          </ThemedText>
        ) : null}
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
          1 {result.unit} significa una parte de componente por cada{" "}
          {result.unit === "ppm" ? "1.000.000" : "1.000.000.000"} partes de
          preparación. En masa/masa: 1 {result.unit} ={" "}
          {result.unit === "ppm" ? "1 mg/kg" : "1 µg/kg"}.{" "}
          {result.approximation
            ? "En agua diluida se usa ≈ mg/L o ≈ µg/L, no una igualdad exacta."
            : "Esta equivalencia masa/masa es exacta."}
        </ThemedText>
      </View>
      {result.warning ? (
        <View
          style={[
            styles.warning,
            { backgroundColor: colors.surface, borderColor: colors.warning },
          ]}
        >
          <Ionicons name="warning-outline" size={22} color={colors.warning} />
          <ThemedText style={[styles.body, { color: colors.text }]}>
            {result.warning}
          </ThemedText>
        </View>
      ) : null}
      {isVerySmall ? (
        <View
          style={[
            styles.warning,
            { backgroundColor: colors.surface, borderColor: colors.warning },
          ]}
        >
          <Ionicons name="scale-outline" size={22} color={colors.warning} />
          <ThemedText style={[styles.body, { color: colors.text }]}>
            Esta cantidad puede ser demasiado pequeña para pesar directamente
            con el equipamiento habitual. En laboratorio suele prepararse
            primero una solución madre y luego realizar una dilución.
          </ThemedText>
        </View>
      ) : null}
      <ThemedText
        style={[styles.body, { color: colors.muted, marginBottom: 20 }]}
      >
        Los cálculos de ppm y ppb se presentan para concentraciones bajas. No se
        aplican automáticamente a líquidos densos, soluciones concentradas,
        mezclas viscosas, aceites, solventes orgánicos o semisólidos.
      </ThemedText>
    </View>
  );
}

function formatNumber(value: number): string {
  return value
    .toFixed(6)
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
  label: { fontSize: 15, fontWeight: "700", marginBottom: 8, marginTop: 6 },
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
  modeList: { gap: 8, marginBottom: 8 },
  modeOption: {
    borderRadius: 9,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
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
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 27,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  body: { flex: 1, fontSize: 14, lineHeight: 21 },
  equation: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 12,
  },
  finalValue: { fontSize: 27, fontWeight: "800", marginBottom: 5 },
  note: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 12,
    padding: 16,
  },
  warning: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 12,
    padding: 16,
  },
});

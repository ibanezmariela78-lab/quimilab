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
    calculateCommercialDilution,
    type CommercialConcentrationType,
    type CommercialResult,
    type CommercialVolumeUnit,
} from "@/chemistry/commercial";
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

const procedure = [
  "Este módulo no genera un procedimiento autónomo de manipulación.",
  "Trabajá únicamente bajo supervisión docente y con el equipamiento adecuado.",
  "Verificá los datos de la etiqueta y las normas de seguridad del laboratorio.",
];

export default function CommercialReagentScreen() {
  const [formula, setFormula] = useState("");
  const [percentage, setPercentage] = useState("");
  const [density, setDensity] = useState("");
  const [type, setType] = useState<CommercialConcentrationType>("molarity");
  const [finalConcentration, setFinalConcentration] = useState("");
  const [finalVolume, setFinalVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState<CommercialVolumeUnit>("mL");
  const [result, setResult] = useState<CommercialResult | null>(null);
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
        pressed: "#E8F3E0",
        text: "#17343A",
        muted: "#5A7375",
        accent: "#087F73",
        soft: "#DDF2EC",
        border: "#D6E5E0",
        input: "#FFFFFF",
        warning: "#9A6815",
      };
  const concentrationUnit = type === "molarity" ? "M" : "N";

  function handleCalculate() {
    const calculation = calculateCommercialDilution(
      formula,
      percentage,
      density,
      type,
      finalConcentration,
      finalVolume,
      volumeUnit,
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
              <Ionicons name="flask-outline" size={25} color={colors.accent} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Preparar desde reactivo comercial
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Usá los datos de la etiqueta del reactivo para calcular su
              concentración y la cantidad necesaria.
            </ThemedText>
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Field
              label="Fórmula química"
              value={formula}
              onChangeText={setFormula}
              placeholder="HCl"
              colors={colors}
            />
            <Field
              label="Porcentaje comercial (% m/m)"
              value={percentage}
              onChangeText={setPercentage}
              placeholder="37"
              keyboardType="decimal-pad"
              suffix="% m/m"
              colors={colors}
            />
            <Field
              label="Densidad"
              value={density}
              onChangeText={setDensity}
              placeholder="1,19"
              keyboardType="decimal-pad"
              suffix="g/mL"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Concentración final deseada
            </ThemedText>
            <View style={styles.segmented}>
              {(["molarity", "normality"] as const).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setType(option)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor:
                        type === option ? colors.accent : colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: type === option ? "#FFFFFF" : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {option === "molarity" ? "Molaridad" : "Normalidad"}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <Field
              label={`Concentración final (${concentrationUnit})`}
              value={finalConcentration}
              onChangeText={setFinalConcentration}
              placeholder="0,1"
              keyboardType="decimal-pad"
              suffix={concentrationUnit}
              colors={colors}
            />
            <Field
              label="Volumen final"
              value={finalVolume}
              onChangeText={setFinalVolume}
              placeholder="500"
              keyboardType="decimal-pad"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Unidad de volumen
            </ThemedText>
            <View style={styles.segmented}>
              {(["mL", "L"] as const).map((unit) => (
                <Pressable
                  key={unit}
                  onPress={() => setVolumeUnit(unit)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor:
                        volumeUnit === unit ? colors.accent : colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: volumeUnit === unit ? "#FFFFFF" : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {unit}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={handleCalculate}
              accessibilityRole="button"
              accessibilityLabel="Calcular desde reactivo comercial"
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
          <ThemedText style={[styles.sourceNote, { color: colors.muted }]}>
            Verificá los datos en la etiqueta del reactivo utilizado.
          </ThemedText>
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
          {result ? <Result result={result} colors={colors} /> : null}
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

function Result({
  result,
  colors,
}: {
  result: CommercialResult;
  colors: Colors;
}) {
  const unit = result.concentrationType === "molarity" ? "M" : "N";
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Concentración comercial aproximada
        </ThemedText>
        <ThemedText style={[styles.finalValue, { color: colors.text }]}>
          {format(result.commercialConcentration)} {unit}
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Fórmula: {result.formula} · {format(result.percentage)} % m/m ·{" "}
          {format(result.density)} g/mL
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Cálculo de concentración
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          M = (densidad × 10 × porcentaje) / masa molar{`\n`}M = (
          {format(result.density)} × 10 × {format(result.percentage)}) /{" "}
          {format(result.molarMass.molarMass ?? 0)}
          {`\n`}M ≈ {format(result.commercialMolarity)} M
        </ThemedText>
        {result.concentrationType === "normality" ? (
          <ThemedText style={[styles.equation, { color: colors.text }]}>
            N = M × factor{`\n`}N = {format(result.commercialMolarity)} ×{" "}
            {result.equivalenceFactor} ={" "}
            {format(result.commercialConcentration)} N
          </ThemedText>
        ) : null}
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Dilución
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          C1 × V1 = C2 × V2{`\n`}V1 = (C2 × V2) / C1{`\n`}V1 = (
          {format(result.finalConcentration)} × {format(result.finalVolume)}) /{" "}
          {format(result.commercialConcentration)}
          {`\n`}V1 = {format(result.stockVolume)} {result.volumeUnit}
        </ThemedText>
      </View>
      <View style={[styles.resultCard, { backgroundColor: colors.accent }]}>
        <ThemedText style={{ color: "#FFFFFF", fontWeight: "800" }}>
          RESULTADO TEÓRICO
        </ThemedText>
        <ThemedText style={[styles.finalMass, { color: "#FFFFFF" }]}>
          El cálculo teórico indica aproximadamente {format(result.stockVolume)}{" "}
          {result.volumeUnit} de la solución comercial.
        </ThemedText>
        <ThemedText style={{ color: "#FFFFFF" }}>
          para preparar {format(result.finalVolume)} {result.volumeUnit} a{" "}
          {format(result.finalConcentration)} {unit}.
        </ThemedText>
      </View>
      {result.safetyWarning ? (
        <View
          style={[
            styles.warning,
            { backgroundColor: colors.surface, borderColor: colors.warning },
          ]}
        >
          <Ionicons name="warning-outline" size={22} color={colors.warning} />
          <ThemedText style={[styles.body, { color: colors.text }]}>
            {result.safetyWarning}
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
          Datos de la etiqueta
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          {format(result.percentage)} % m/m significa que hay una fracción de
          masa del reactivo indicada por el porcentaje en cada 100 g de solución
          comercial.
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          La densidad de {format(result.density)} g/mL significa que cada
          mililitro de esta solución tiene una masa aproximada de{" "}
          {format(result.density)} g.
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.text, marginTop: 8 }]}>
          El porcentaje y la densidad deben verificarse en la etiqueta del
          reactivo utilizado.
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Preparación
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
      <View
        style={[
          styles.disabled,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.muted }]}>
          Preparar desde reactivo comercial
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Próximamente: datos ampliados de porcentaje, densidad y concentración
          del reactivo.
        </ThemedText>
      </View>
    </View>
  );
}

function format(value: number): string {
  return value
    .toFixed(4)
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
  sourceNote: { fontSize: 13, lineHeight: 19, marginTop: 12 },
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
  finalValue: { fontSize: 27, fontWeight: "800", marginBottom: 6 },
  resultTitle: { fontSize: 20, fontWeight: "800", marginBottom: 10 },
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
  finalMass: {
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 26,
    marginVertical: 8,
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
  listItem: { fontSize: 14, lineHeight: 23 },
  disabled: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    opacity: 0.7,
    padding: 16,
  },
  mass: { fontSize: 24, fontWeight: "800" },
});

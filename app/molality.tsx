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
    calculateMolalityPreparation,
    type MolalityPreparationResult,
    type SolventMassUnit,
} from "@/chemistry/molality";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

const materials = [
  "Balanza",
  "Espátula",
  "Recipiente para pesar",
  "Vaso de precipitados o recipiente adecuado",
  "Varilla de vidrio",
  "Solvente correspondiente",
];

const procedure = [
  "Reuní los materiales.",
  "Pesá la cantidad indicada de solvente.",
  "Tará la balanza cuando corresponda.",
  "Pesá la cantidad calculada de soluto.",
  "Colocá el solvente en un recipiente adecuado.",
  "Agregá el soluto.",
  "Mezclá hasta homogeneizar cuando sea químicamente posible.",
  "Rotulá la preparación.",
];

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

export default function MolalityScreen() {
  const [formula, setFormula] = useState("");
  const [molality, setMolality] = useState("");
  const [solventMass, setSolventMass] = useState("");
  const [unit, setUnit] = useState<SolventMassUnit>("g");
  const [result, setResult] = useState<MolalityPreparationResult | null>(null);
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

  function handleCalculate() {
    const calculation = calculateMolalityPreparation(
      formula,
      molality,
      solventMass,
      unit,
    );
    if ("error" in calculation) {
      setResult(null);
      setError(calculation.error);
    } else {
      setError("");
      setResult(calculation);
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
              <Ionicons name="water-outline" size={25} color={colors.accent} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Preparar por molalidad
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              La molalidad expresa cuántos moles de soluto hay por cada
              kilogramo de solvente.
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
              placeholder="NaCl"
              colors={colors}
            />
            <Field
              label="Molalidad deseada"
              value={molality}
              onChangeText={setMolality}
              placeholder="0,5"
              suffix="mol/kg"
              keyboardType="decimal-pad"
              colors={colors}
            />
            <Field
              label="Masa del solvente"
              value={solventMass}
              onChangeText={setSolventMass}
              placeholder="500"
              keyboardType="decimal-pad"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Unidad de masa
            </ThemedText>
            <View style={styles.segmented}>
              {(["g", "kg"] as const).map((option) => (
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
              accessibilityLabel="Calcular preparación por molalidad"
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
  result: MolalityPreparationResult;
  colors: Colors;
}) {
  const lightText = colors.accent === "#087F73";
  const observation = result.molarMass.substanceInfo?.observations;
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Sustancia
        </ThemedText>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          {result.molarMass.substanceName ?? result.formula}
        </ThemedText>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Fórmula
        </ThemedText>
        <ThemedText style={[styles.resultFormula, { color: colors.text }]}>
          {result.formula}
        </ThemedText>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Masa molar
        </ThemedText>
        <ThemedText style={[styles.mass, { color: colors.text }]}>
          {format(result.molarMass.molarMass ?? 0)} g/mol
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Datos
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Molalidad = {format(result.molality)} mol/kg
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          Masa de solvente = {format(result.solventMass)}{" "}
          {result.solventMassUnit} = {format(result.solventMassKg, 3)} kg
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 1: Convertir la masa del solvente a kg
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          {format(result.solventMass)} {result.solventMassUnit} ={" "}
          {format(result.solventMassKg, 3)} kg
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 2: Calcular moles de soluto
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          n = m × kg de solvente{`\n`}n = {format(result.molality)} ×{" "}
          {format(result.solventMassKg, 3)}
          {`\n`}n = {format(result.molesNeeded, 3)} mol
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 3: Convertir moles a gramos
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          masa = n × MM{`\n`}masa = {format(result.molesNeeded, 3)} ×{" "}
          {format(result.molarMass.molarMass ?? 0)}
          {`\n`}masa = {format(result.gramsNeeded, 3)} g
        </ThemedText>
      </View>
      <View style={[styles.resultCard, { backgroundColor: colors.accent }]}>
        <ThemedText
          style={{
            color: lightText ? "#FFFFFF" : "#10242A",
            fontWeight: "800",
          }}
        >
          RESULTADO
        </ThemedText>
        <ThemedText
          style={[
            styles.finalMass,
            { color: lightText ? "#FFFFFF" : "#10242A" },
          ]}
        >
          Necesitás aproximadamente {format(result.gramsNeeded, 2)} g de{" "}
          {result.formula}
        </ThemedText>
        <ThemedText style={{ color: lightText ? "#FFFFFF" : "#10242A" }}>
          para {format(result.solventMass)} {result.solventMassUnit} de solvente
          y obtener {format(result.molality)} mol/kg.
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
          La masa indicada corresponde solamente al SOLVENTE, no a la masa total
          de la mezcla. A diferencia de la molaridad, la molalidad se basa en
          masa y no en volumen. Por eso es menos sensible a cambios de
          temperatura que las concentraciones basadas en volumen.
        </ThemedText>
      </View>
      {observation ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Observaciones de la sustancia
          </ThemedText>
          {observation.map((item) => (
            <ThemedText
              key={item}
              style={[styles.body, { color: colors.text }]}
            >
              • {item}
            </ThemedText>
          ))}
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
        {materials.map((item) => (
          <ThemedText
            key={item}
            style={[styles.listItem, { color: colors.muted }]}
          >
            • {item}
          </ThemedText>
        ))}
      </View>
      {!result.molarMass.substanceInfo?.requiresTeacherSupervision ? (
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
      ) : null}
    </View>
  );
}

function format(value: number, decimals = 3): string {
  return value
    .toFixed(decimals)
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
    marginTop: 2,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  resultFormula: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  mass: { fontSize: 24, fontWeight: "800", marginTop: 4 },
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
  note: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginBottom: 12,
    padding: 16,
  },
  listItem: { fontSize: 14, lineHeight: 23 },
});

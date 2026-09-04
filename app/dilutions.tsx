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
    calculateDilution,
    type DilutionConcentrationType,
    type DilutionResult,
    type DilutionVolumeUnit,
} from "@/chemistry/dilution";
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

const materials = [
  "Pipeta o material volumétrico adecuado",
  "Propipeta cuando corresponda",
  "Matraz aforado",
  "Piseta",
  "Solvente correspondiente",
  "Elementos de protección requeridos",
];

const procedure = [
  "Reuní el material de laboratorio indicado.",
  "Medí el volumen calculado de solución madre utilizando material volumétrico adecuado.",
  "Transferilo al recipiente volumétrico correspondiente.",
  "Agregá solvente hasta acercarte al volumen final.",
  "Ajustá cuidadosamente hasta la marca final.",
  "Homogeneizá.",
  "Rotulá la solución preparada.",
];

export default function DilutionsScreen() {
  const [substance, setSubstance] = useState("");
  const [type, setType] = useState<DilutionConcentrationType>("molarity");
  const [initialConcentration, setInitialConcentration] = useState("");
  const [finalConcentration, setFinalConcentration] = useState("");
  const [finalVolume, setFinalVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState<DilutionVolumeUnit>("mL");
  const [result, setResult] = useState<DilutionResult | null>(null);
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
  const unitLabel = type === "molarity" ? "M" : "N";

  function handleCalculate() {
    const calculation = calculateDilution(
      substance,
      type,
      initialConcentration,
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
              <Ionicons name="beaker-outline" size={25} color={colors.accent} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Preparar una dilución
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Calculá cuánto volumen de una solución madre necesitás para
              obtener una solución más diluida.
            </ThemedText>
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Field
              label="Fórmula o nombre de la sustancia"
              value={substance}
              onChangeText={setSubstance}
              placeholder="HCl"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Tipo de concentración
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
              label={`Concentración de la solución madre (C1) · ${unitLabel}`}
              value={initialConcentration}
              onChangeText={setInitialConcentration}
              placeholder={type === "molarity" ? "1" : "2"}
              keyboardType="decimal-pad"
              colors={colors}
            />
            <Field
              label={`Concentración deseada (C2) · ${unitLabel}`}
              value={finalConcentration}
              onChangeText={setFinalConcentration}
              placeholder={type === "molarity" ? "0,5" : "0,5"}
              keyboardType="decimal-pad"
              colors={colors}
            />
            <Field
              label="Volumen final deseado"
              value={finalVolume}
              onChangeText={setFinalVolume}
              placeholder="500"
              keyboardType="decimal-pad"
              colors={colors}
            />
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Unidad del volumen
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
              accessibilityLabel="Calcular dilución"
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
  colors: Colors;
};
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  colors,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={[styles.label, { color: colors.text }]}>
        {label}
      </ThemedText>
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
    </View>
  );
}

function Result({
  result,
  colors,
}: {
  result: DilutionResult;
  colors: Colors;
}) {
  const unit = result.concentrationType === "molarity" ? "M" : "N";
  const lightText = colors.accent === "#087F73";
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Sustancia
        </ThemedText>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          {result.substanceName ?? result.substance}
        </ThemedText>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Concentración
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.text }]}>
          Solución madre: {format(result.initialConcentration)} {unit}
          {`\n`}Solución final: {format(result.finalConcentration)} {unit}
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Explicación paso a paso
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 1: Identificar los datos
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          C1 = {format(result.initialConcentration)} {unit}
          {`\n`}C2 = {format(result.finalConcentration)} {unit}
          {`\n`}V2 = {format(result.finalVolume)} {result.volumeUnit}
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 2: Relación de dilución
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          C1 × V1 = C2 × V2
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 3: Despejar V1
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          V1 = (C2 × V2) / C1{`\n`}V1 = ({format(result.finalConcentration)} ×{" "}
          {format(result.finalVolume)}) / {format(result.initialConcentration)}
          {`\n`}V1 = {format(result.stockVolume)} {result.volumeUnit}
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
          Se necesitan {format(result.stockVolume)} {result.volumeUnit}
          {result.volumeUnit === "L"
            ? ` (${format(result.stockVolumeMilliliters)} mL)`
            : ""}{" "}
          de solución madre
        </ThemedText>
        <ThemedText style={{ color: lightText ? "#FFFFFF" : "#10242A" }}>
          de {result.substance} {format(result.initialConcentration)} {unit}{" "}
          para preparar {format(result.finalVolume)} {result.volumeUnit} finales
          de {format(result.finalConcentration)} {unit}.
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
          El volumen indicado corresponde al volumen FINAL de la solución. Se
          mide el volumen calculado de solución madre y luego se completa con
          solvente hasta alcanzar el volumen final. No se calcula
          automáticamente un volumen de solvente como V2 - V1.
        </ThemedText>
      </View>
      {result.concentrationType === "normality" ? (
        <View
          style={[
            styles.note,
            { backgroundColor: colors.soft, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.body, { color: colors.text }]}>
            La normalidad depende de la reacción considerada. C1 y C2 deben
            estar expresadas bajo el mismo criterio de equivalencia.
          </ThemedText>
        </View>
      ) : null}
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
      {!result.safetyWarning ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Materiales y procedimiento
          </ThemedText>
          {materials.map((item) => (
            <ThemedText
              key={item}
              style={[styles.listItem, { color: colors.muted }]}
            >
              • {item}
            </ThemedText>
          ))}
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
          Próximamente: cálculo a partir de porcentaje, densidad y concentración
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
  input: {
    borderRadius: 9,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputRow: { alignItems: "center", flexDirection: "row" },
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
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 4,
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

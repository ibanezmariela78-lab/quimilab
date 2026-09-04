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
    calculateMolarityPreparation,
    type MolarityPreparationResult,
    type VolumeUnit,
} from "@/chemistry/molarity";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

const materials = [
  "Balanza",
  "Espátula",
  "Vidrio reloj o recipiente para pesar",
  "Vaso de precipitados",
  "Varilla de vidrio",
  "Embudo",
  "Matraz aforado",
  "Piseta",
  "Agua destilada",
];

function getProcedure(volume: number, volumeUnit: VolumeUnit): string[] {
  const volumeLabel = `${format(volume)} ${volumeUnit}`;

  return [
    "Reuní los materiales necesarios.",
    "Colocá un vidrio reloj o recipiente adecuado sobre la balanza.",
    "Tará la balanza.",
    "Pesá la cantidad de soluto calculada.",
    "Colocá en un vaso de precipitados una cantidad de agua destilada menor al volumen final de la solución.",
    "Agregá el soluto.",
    "Mezclá hasta lograr la disolución cuando sea químicamente posible.",
    `Transferí la solución a un matraz aforado de ${volumeLabel}.`,
    "Enjuagá el vaso y agregá los lavados al matraz.",
    "Agregá agua destilada hasta acercarte a la marca.",
    "Ajustá cuidadosamente el menisco al volumen final.",
    "Tapá y homogeneizá.",
    "Rotulá la preparación.",
  ];
}

export default function MolarityScreen() {
  const [formula, setFormula] = useState("");
  const [molarity, setMolarity] = useState("");
  const [volume, setVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("mL");
  const [result, setResult] = useState<MolarityPreparationResult | null>(null);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark
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
    const calculation = calculateMolarityPreparation(
      formula,
      molarity,
      volume,
      volumeUnit,
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
              <Ionicons name="flask" size={25} color={colors.accent} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Preparar solución por molaridad
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Indicá qué solución querés preparar y QuimiLab calculará la
              cantidad necesaria.
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
              placeholder="CaCl2"
              colors={colors}
            />
            <Field
              label="Molaridad deseada"
              value={molarity}
              onChangeText={setMolarity}
              placeholder="0,5"
              keyboardType="decimal-pad"
              suffix="mol/L"
              colors={colors}
            />
            <Field
              label="Volumen final"
              value={volume}
              onChangeText={setVolume}
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
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${unit}`}
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
                      color:
                        volumeUnit === unit
                          ? isDark
                            ? "#10242A"
                            : "#FFFFFF"
                          : colors.text,
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
              accessibilityLabel="Calcular preparación por molaridad"
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
              <ThemedText style={[styles.messageText, { color: colors.text }]}>
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

type Colors = {
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
  result: MolarityPreparationResult;
  colors: Colors;
}) {
  const { molarMass } = result;
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.detailLabel, { color: colors.accent }]}>
          Sustancia
        </ThemedText>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          {molarMass.substanceName ?? result.formula}
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
          M = {format(result.molarity)} mol/L
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          V = {format(result.volume)} {result.volumeUnit} ={" "}
          {format(result.volumeLiters, 3)} L
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 1: Calcular los moles necesarios
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          n = M × V{`\n`}n = {format(result.molarity)} ×{" "}
          {format(result.volumeLiters, 3)}
          {`\n`}n = {format(result.molesNeeded, 3)} mol
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 2: Convertir moles a gramos
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          m = n × MM{`\n`}m = {format(result.molesNeeded, 3)} ×{" "}
          {format(result.molarMass.molarMass ?? 0)}
          {`\n`}m = {format(result.gramsNeeded, 4)} g
        </ThemedText>
      </View>
      <View style={[styles.resultCard, { backgroundColor: colors.accent }]}>
        <ThemedText
          style={[
            styles.resultOverline,
            { color: isLightText(colors.accent) ? "#FFFFFF" : "#10242A" },
          ]}
        >
          RESULTADO
        </ThemedText>
        <ThemedText
          style={{
            color: isLightText(colors.accent) ? "#FFFFFF" : "#10242A",
            fontSize: 16,
          }}
        >
          Necesitás aproximadamente:
        </ThemedText>
        <ThemedText
          style={[
            styles.finalMass,
            { color: isLightText(colors.accent) ? "#FFFFFF" : "#10242A" },
          ]}
        >
          {format(result.gramsNeeded, 2)} g de {result.formula}
        </ThemedText>
        <ThemedText
          style={{ color: isLightText(colors.accent) ? "#FFFFFF" : "#10242A" }}
        >
          para preparar:
        </ThemedText>
        <ThemedText
          style={[
            styles.finalText,
            { color: isLightText(colors.accent) ? "#FFFFFF" : "#10242A" },
          ]}
        >
          {format(result.volume)} {result.volumeUnit} de solución{" "}
          {format(result.molarity)} M
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
          Este volumen es el volumen FINAL de la solución. No significa agregar
          el soluto a ese volumen de agua. Primero se disuelve en una cantidad
          menor de solvente y luego se completa hasta alcanzar el volumen final.
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
      {molarMass.substanceInfo?.observations ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Observaciones de la sustancia
          </ThemedText>
          {molarMass.substanceInfo.observations.map((observation) => (
            <ThemedText
              key={observation}
              style={[styles.body, { color: colors.text }]}
            >
              • {observation}
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
      {!result.safetyWarning ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Procedimiento guiado
          </ThemedText>
          {getProcedure(result.volume, result.volumeUnit).map((step, index) => (
            <ThemedText
              key={step}
              style={[styles.listItem, { color: colors.muted }]}
            >
              {index + 1}. {step}
            </ThemedText>
          ))}
        </View>
      ) : null}
      <View style={[styles.limit, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.body, { color: colors.text }]}>
          Este cálculo corresponde a una preparación a partir de un soluto puro.
          {`\n\n`}Las preparaciones a partir de soluciones concentradas o
          soluciones madre se calcularán mediante el módulo de diluciones.
        </ThemedText>
      </View>
    </View>
  );
}

function format(value: number, decimals = 3): string {
  return value
    .toFixed(decimals)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}
function isLightText(hex: string): boolean {
  return hex.toUpperCase() !== "#087F73";
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
  suffix: { fontSize: 14, marginLeft: 9 },
  segmented: { flexDirection: "row", gap: 10 },
  segment: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    minHeight: 45,
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 9,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 5,
    minHeight: 48,
  },
  resultArea: { marginTop: 8 },
  resultCard: { borderRadius: 12, marginBottom: 12, padding: 18 },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginTop: 2,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 4,
  },
  resultFormula: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  mass: { fontSize: 25, fontWeight: "800", marginTop: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 5,
  },
  body: { fontSize: 14, lineHeight: 21 },
  equation: { fontSize: 15, lineHeight: 25, marginBottom: 9 },
  resultOverline: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  finalMass: { fontSize: 23, fontWeight: "800", marginVertical: 8 },
  finalText: { fontSize: 17, fontWeight: "700", marginTop: 8 },
  note: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    padding: 16,
  },
  warning: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    padding: 16,
  },
  listItem: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  limit: { borderRadius: 12, marginBottom: 12, padding: 16 },
  message: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    padding: 16,
  },
  messageText: { flex: 1, fontSize: 14, lineHeight: 21 },
});

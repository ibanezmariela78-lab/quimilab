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
    calculateMoleFractions,
    type MoleFractionComponentInput,
    type MoleFractionResult,
} from "@/chemistry/moleFraction";
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

type ComponentState = MoleFractionComponentInput;

export default function MoleFractionScreen() {
  const [components, setComponents] = useState<ComponentState[]>([
    { identifier: "", amount: "", unit: "mol" },
    { identifier: "", amount: "", unit: "mol" },
  ]);
  const [result, setResult] = useState<MoleFractionResult | null>(null);
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

  function updateComponent(index: number, update: Partial<ComponentState>) {
    setComponents((current) =>
      current.map((component, componentIndex) =>
        componentIndex === index ? { ...component, ...update } : component,
      ),
    );
  }

  function handleCalculate() {
    const calculation = calculateMoleFractions(components);
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
              Fracción molar
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              La fracción molar indica qué proporción de los moles totales
              corresponde a cada componente de una mezcla.
            </ThemedText>
          </View>

          {components.map((component, index) => (
            <ComponentCard
              key={index}
              index={index}
              component={component}
              onUpdate={(update) => updateComponent(index, update)}
              colors={colors}
            />
          ))}
          <Pressable
            onPress={handleCalculate}
            accessibilityRole="button"
            accessibilityLabel="Calcular fracción molar"
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

function ComponentCard({
  index,
  component,
  onUpdate,
  colors,
}: {
  index: number;
  component: ComponentState;
  onUpdate: (update: Partial<ComponentState>) => void;
  colors: Colors;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
        Componente {index + 1}
      </ThemedText>
      <ThemedText style={[styles.label, { color: colors.text }]}>
        Fórmula o nombre
      </ThemedText>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(identifier) => onUpdate({ identifier })}
        placeholder={index === 0 ? "NaCl" : "H2O"}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={component.identifier}
      />
      <ThemedText style={[styles.label, { color: colors.text }]}>
        Cantidad
      </ThemedText>
      <View style={styles.inputRow}>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={(amount) => onUpdate({ amount })}
          placeholder={index === 0 ? "1" : "9"}
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={component.amount}
        />
        <ThemedText style={[styles.suffix, { color: colors.muted }]}>
          {component.unit}
        </ThemedText>
      </View>
      <View style={styles.segmented}>
        {(["mol", "g"] as const).map((unit) => (
          <Pressable
            key={unit}
            accessibilityRole="button"
            accessibilityLabel={`Seleccionar ${unit}`}
            onPress={() => onUpdate({ unit })}
            style={[
              styles.segment,
              {
                backgroundColor:
                  component.unit === unit ? colors.accent : colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText
              style={{
                color: component.unit === unit ? "#FFFFFF" : colors.text,
                fontWeight: "700",
              }}
            >
              {unit}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Result({
  result,
  colors,
}: {
  result: MoleFractionResult;
  colors: Colors;
}) {
  return (
    <View style={styles.resultArea}>
      <View style={[styles.resultCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
          Resultado de la mezcla
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.muted }]}>
          ntotal ={" "}
          {result.components
            .map((component) => format(component.moles))
            .join(" + ")}{" "}
          = {format(result.totalMoles)} mol
        </ThemedText>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 1: Calcular o convertir a moles
        </ThemedText>
        {result.components.map((component) => (
          <View key={component.identifier} style={styles.resultRow}>
            <ThemedText style={[styles.body, { color: colors.text }]}>
              {component.name ?? component.identifier}:{" "}
              {format(component.moles)} mol
            </ThemedText>
            {component.molesCalculation ? (
              <ThemedText style={[styles.equation, { color: colors.muted }]}>
                {component.molesCalculation}
              </ThemedText>
            ) : null}
          </View>
        ))}
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 2: Moles totales
        </ThemedText>
        <ThemedText style={[styles.equation, { color: colors.text }]}>
          ntotal = n1 + n2 = {format(result.totalMoles)} mol
        </ThemedText>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Paso 3: Fracción molar de cada componente
        </ThemedText>
        {result.components.map((component, index) => (
          <ThemedText
            key={component.identifier}
            style={[styles.equation, { color: colors.text }]}
          >
            X{index + 1} ({component.identifier}) = {format(component.moles)} /{" "}
            {format(result.totalMoles)} = {format(result.fractions[index])}
          </ThemedText>
        ))}
      </View>
      <View style={[styles.resultCard, { backgroundColor: colors.accent }]}>
        <ThemedText style={{ color: "#FFFFFF", fontWeight: "800" }}>
          FRACCIONES MOLARES
        </ThemedText>
        {result.fractions.map((fraction, index) => (
          <ThemedText
            key={result.components[index].identifier}
            style={[styles.finalFraction, { color: "#FFFFFF" }]}
          >
            X{index + 1} = {format(fraction)}
          </ThemedText>
        ))}
        <ThemedText style={{ color: "#FFFFFF" }}>
          Comprobación: {result.fractions.map(format).join(" + ")} ≈{" "}
          {format(
            result.fractions.reduce((sum, fraction) => sum + fraction, 0),
          )}
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
          La fracción molar es una relación entre cantidades de sustancia, por
          eso no tiene unidades. Una fracción molar de 0,25 significa que el 25
          % de los moles totales corresponde a ese componente. No significa
          necesariamente 25 % en masa ni 25 % en volumen.
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
  segmented: { flexDirection: "row", gap: 8, marginTop: 10 },
  segment: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
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
  resultTitle: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  body: { flex: 1, fontSize: 14, lineHeight: 21 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  equation: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 8,
  },
  resultRow: {
    borderBottomColor: "#D6E5E0",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 8,
  },
  finalFraction: { fontSize: 21, fontWeight: "800", marginTop: 7 },
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

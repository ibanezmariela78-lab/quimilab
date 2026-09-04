import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
    gramsToMoles,
    molesToGrams,
    parsePositiveNumber,
} from "@/chemistry/conversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function MolarMassScreen() {
  const router = useRouter();
  const [formula, setFormula] = useState("");
  const [calculatedFormula, setCalculatedFormula] = useState("");
  const [grams, setGrams] = useState("");
  const [moles, setMoles] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark
    ? {
        background: "#10242A",
        surface: "#18363D",
        surfacePressed: "#21454D",
        text: "#F1FAF8",
        muted: "#B7D1CD",
        accent: "#5DD3B6",
        accentSoft: "#214D4A",
        border: "#2C5559",
        input: "#0D1D22",
        warning: "#F2C879",
      }
    : {
        background: "#F4F8F7",
        surface: "#FFFFFF",
        surfacePressed: "#E8F3F0",
        text: "#17343A",
        muted: "#5A7375",
        accent: "#087F73",
        accentSoft: "#DDF2EC",
        border: "#D6E5E0",
        input: "#FFFFFF",
        warning: "#9A6815",
      };
  const result = calculatedFormula
    ? calculateMolarMass(calculatedFormula)
    : null;

  function handleCalculate() {
    setCalculatedFormula(formula.trim());
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={[styles.mark, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="calculator" size={24} color={colors.accent} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Calculadora de masa molar
            </ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Escribí una fórmula química y QuimiLab hará el cálculo paso a
              paso.
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Preparar solución por molaridad"
              onPress={() => router.push("/molarity")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="flask-outline" size={18} color={colors.accent} />
              <ThemedText
                style={[styles.secondaryButtonText, { color: colors.accent }]}
              >
                Molaridad
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Preparar por molalidad"
              onPress={() => router.push("/molality")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="water-outline" size={18} color={colors.accent} />
              <ThemedText
                style={[styles.secondaryButtonText, { color: colors.accent }]}
              >
                Molalidad
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Preparar por porcentajes"
              onPress={() => router.push("/percentages")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="pie-chart-outline"
                size={18}
                color={colors.accent}
              />
              <ThemedText
                style={[styles.secondaryButtonText, { color: colors.accent }]}
              >
                Porcentajes
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Preparar por normalidad"
              onPress={() => router.push("/normality")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: pressed ? colors.surfacePressed : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="flash-outline" size={18} color={colors.accent} />
              <ThemedText style={[styles.secondaryButtonText, { color: colors.accent }]}>Normalidad</ThemedText>
            </Pressable>
          </View>

          <View
            style={[
              styles.inputCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Fórmula química
            </ThemedText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setFormula}
              onSubmitEditing={handleCalculate}
              placeholder="CaCl2"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={formula}
            />
            <ThemedText style={[styles.hint, { color: colors.muted }]}>
              También podés escribir hidratos, por ejemplo: CaCl2·2H2O
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Calcular masa molar"
              disabled={!formula.trim()}
              onPress={handleCalculate}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.accent,
                  opacity: formula.trim() ? 1 : 0.5,
                },
              ]}
            >
              <Ionicons
                name="flask-outline"
                size={19}
                color={isDark ? "#10242A" : "#FFFFFF"}
              />
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: isDark ? "#10242A" : "#FFFFFF" },
                ]}
              >
                CALCULAR
              </ThemedText>
            </Pressable>
          </View>

          {result && (
            <View style={styles.resultArea}>
              {result.error ? (
                <View
                  style={[
                    styles.message,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={22}
                    color={colors.warning}
                  />
                  <ThemedText
                    style={[styles.messageText, { color: colors.text }]}
                  >
                    {result.error}
                  </ThemedText>
                </View>
              ) : result.warnings.length > 0 ? (
                <View
                  style={[
                    styles.message,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="warning-outline"
                    size={22}
                    color={colors.warning}
                  />
                  <View style={styles.messageCopy}>
                    <ThemedText
                      style={[styles.sectionTitle, { color: colors.text }]}
                    >
                      No se puede calcular todavía
                    </ThemedText>
                    {result.warnings.map((warning) => (
                      <ThemedText
                        key={warning}
                        style={[styles.messageText, { color: colors.muted }]}
                      >
                        {warning}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  <View
                    style={[
                      styles.resultCard,
                      { backgroundColor: colors.accentSoft },
                    ]}
                  >
                    <ThemedText
                      style={[styles.detailLabel, { color: colors.accent }]}
                    >
                      Sustancia
                    </ThemedText>
                    {result.substanceName ? (
                      <ThemedText
                        style={[styles.substanceName, { color: colors.text }]}
                      >
                        {result.substanceName}
                      </ThemedText>
                    ) : null}
                    <ThemedText
                      style={[styles.detailLabel, { color: colors.accent }]}
                    >
                      Fórmula
                    </ThemedText>
                    <ThemedText
                      style={[styles.formulaValue, { color: colors.text }]}
                    >
                      {result.formula}
                    </ThemedText>
                    <ThemedText
                      style={[styles.resultLabel, { color: colors.accent }]}
                    >
                      MASA MOLAR DE {result.formula}
                    </ThemedText>
                    <ThemedText
                      style={[styles.resultValue, { color: colors.text }]}
                    >
                      {formatNumber(result.molarMass ?? 0)} g/mol
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.detailsCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.sectionTitle, { color: colors.text }]}
                    >
                      Composición y cálculo
                    </ThemedText>
                    {result.elements.map((element) => (
                      <View
                        key={element.symbol}
                        style={[
                          styles.calculationRow,
                          { borderBottomColor: colors.border },
                        ]}
                      >
                        <View style={styles.elementCopy}>
                          <ThemedText
                            style={[styles.elementName, { color: colors.text }]}
                          >
                            {element.symbol} · {element.spanishName}
                          </ThemedText>
                          <ThemedText
                            style={[
                              styles.elementCount,
                              { color: colors.muted },
                            ]}
                          >
                            {element.count}{" "}
                            {element.count === 1 ? "átomo" : "átomos"}
                          </ThemedText>
                        </View>
                        <ThemedText
                          style={[styles.calculation, { color: colors.text }]}
                        >
                          {element.count} × {formatNumber(element.atomicWeight)}{" "}
                          = {formatNumber(element.contribution)}
                        </ThemedText>
                      </View>
                    ))}
                    <ThemedText
                      style={[styles.explanation, { color: colors.muted }]}
                    >
                      Esto significa que un mol de {result.formula} tiene una
                      masa aproximada de {formatNumber(result.molarMass ?? 0)}{" "}
                      gramos. La masa molar permite convertir entre gramos y
                      moles.
                    </ThemedText>
                  </View>
                  <ConversionCard
                    title="Convertir gramos a moles"
                    label="Masa en gramos"
                    formula="n = m / MM"
                    description="n = cantidad de sustancia en moles · m = masa en gramos · MM = masa molar en g/mol"
                    value={grams}
                    onChangeText={setGrams}
                    placeholder="25"
                    result={
                      grams.trim() && parsePositiveNumber(grams) !== null
                        ? gramsToMoles(
                            parsePositiveNumber(grams)!,
                            result.molarMass ?? 0,
                          )
                        : null
                    }
                    error={
                      grams.trim() && parsePositiveNumber(grams) === null
                        ? "Ingresá un número mayor que cero."
                        : undefined
                    }
                    resultLabel="Resultado"
                    resultSuffix="mol"
                    colors={colors}
                  />
                  <ConversionCard
                    title="Convertir moles a gramos"
                    label="Cantidad de moles"
                    formula="m = n × MM"
                    description="m = masa en gramos · n = cantidad de sustancia en moles · MM = masa molar en g/mol"
                    value={moles}
                    onChangeText={setMoles}
                    placeholder="0,5"
                    result={
                      moles.trim() && parsePositiveNumber(moles) !== null
                        ? molesToGrams(
                            parsePositiveNumber(moles)!,
                            result.molarMass ?? 0,
                          )
                        : null
                    }
                    error={
                      moles.trim() && parsePositiveNumber(moles) === null
                        ? "Ingresá un número mayor que cero."
                        : undefined
                    }
                    resultLabel="Resultado"
                    resultSuffix="g"
                    colors={colors}
                  />
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ConversionCardProps = {
  title: string;
  label: string;
  formula: string;
  description: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  result: { value: number; calculation: string } | null;
  error?: string;
  resultLabel: string;
  resultSuffix: string;
  colors: {
    surface: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    input: string;
    warning: string;
  };
};

function ConversionCard({
  title,
  label,
  formula,
  description,
  value,
  onChangeText,
  placeholder,
  result,
  error,
  resultLabel,
  resultSuffix,
  colors,
}: ConversionCardProps) {
  return (
    <View
      style={[
        styles.conversionCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.formula, { color: colors.accent }]}>
        {formula}
      </ThemedText>
      <ThemedText
        style={[styles.conversionDescription, { color: colors.muted }]}
      >
        {description}
      </ThemedText>
      <ThemedText style={[styles.label, { color: colors.text }]}>
        {label}
      </ThemedText>
      <TextInput
        keyboardType="decimal-pad"
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
      {error ? (
        <ThemedText style={[styles.validationError, { color: colors.warning }]}>
          {error}
        </ThemedText>
      ) : null}
      {result ? (
        <View
          style={[
            styles.conversionResult,
            { backgroundColor: colors.accentSoft },
          ]}
        >
          <ThemedText
            style={[styles.conversionCalculation, { color: colors.text }]}
          >
            {resultLabel}: {result.calculation} {resultSuffix}
          </ThemedText>
          <ThemedText style={[styles.conversionValue, { color: colors.text }]}>
            {formatNumber(result.value)} {resultSuffix}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

function formatNumber(value: number): string {
  return value
    .toFixed(3)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
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
  secondaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: "700" },
  inputCard: { borderRadius: 12, borderWidth: 1, padding: 16 },
  label: { fontSize: 16, fontWeight: "700", marginBottom: 9 },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    fontSize: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hint: { fontSize: 12, lineHeight: 18, marginTop: 8 },
  button: {
    alignItems: "center",
    borderRadius: 9,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 48,
  },
  buttonText: { fontSize: 14, fontWeight: "800", letterSpacing: 0.5 },
  resultArea: { marginTop: 20 },
  resultCard: { borderRadius: 12, padding: 18 },
  resultLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  resultValue: { fontSize: 28, fontWeight: "800" },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginTop: 2,
    textTransform: "uppercase",
  },
  substanceName: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  formulaValue: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 14,
    marginTop: 4,
  },
  detailsCard: { borderRadius: 12, borderWidth: 1, marginTop: 12, padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  calculationRow: {
    alignItems: "flex-start",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  elementCopy: { flex: 1 },
  elementName: { fontSize: 15, fontWeight: "700" },
  elementCount: { fontSize: 13, marginTop: 3 },
  calculation: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "right",
  },
  explanation: { fontSize: 14, lineHeight: 21, marginTop: 16 },
  conversionCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  formula: { fontSize: 17, fontWeight: "700", marginBottom: 3 },
  conversionDescription: { fontSize: 12, lineHeight: 18, marginBottom: 14 },
  validationError: { fontSize: 13, marginTop: 7 },
  conversionResult: { borderRadius: 9, marginTop: 12, padding: 12 },
  conversionCalculation: { fontSize: 13, lineHeight: 19 },
  conversionValue: { fontSize: 21, fontWeight: "800", marginTop: 5 },
  message: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    padding: 16,
  },
  messageCopy: { flex: 1 },
  messageText: { flex: 1, fontSize: 14, lineHeight: 21 },
});

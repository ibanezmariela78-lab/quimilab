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
    ConcentrationUnit,
    convertConcentration,
    getConcentrationUnitLabel,
} from "@/chemistry/concentrationConversions";
import { calculateMolarMass } from "@/chemistry/molarMass";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

const concentrationUnits: ConcentrationUnit[] = [
  "molarity",
  "molality",
  "normality",
  "percentMassMass",
  "percentMassVolume",
  "gPerLiter",
  "ppmMass",
  "ppbMass",
];

export default function ConcentrationConversionsScreen() {
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
        dangerSoft: "#473A2A",
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
        dangerSoft: "#FFF5DE",
      };

  const [value, setValue] = useState("");
  const [from, setFrom] = useState<ConcentrationUnit>("molarity");
  const [to, setTo] = useState<ConcentrationUnit>("gPerLiter");

  const [formula, setFormula] = useState("");
  const [density, setDensity] = useState("");
  const [equivalenceFactor, setEquivalenceFactor] = useState("");

  const [calculated, setCalculated] = useState(false);

  const numericValue = parseDecimal(value);
  const numericDensity = parseDecimal(density);
  const numericEquivalenceFactor = parseDecimal(equivalenceFactor);

  const molarMassResult = formula.trim()
    ? calculateMolarMass(formula.trim())
    : null;

  const molarMass =
    molarMassResult &&
    !molarMassResult.error &&
    molarMassResult.warnings.length === 0
      ? (molarMassResult.molarMass ?? undefined)
      : undefined;

  const conversionResult =
    calculated && numericValue !== null
      ? convertConcentration({
          value: numericValue,
          from,
          to,
          molarMass,
          solutionDensity: numericDensity !== null ? numericDensity : undefined,
          equivalenceFactor:
            numericEquivalenceFactor !== null
              ? numericEquivalenceFactor
              : undefined,
        })
      : null;

  function handleCalculate() {
    setCalculated(true);
  }

  function handleValueChange(text: string) {
    setValue(text);
    setCalculated(false);
  }

  function handleFormulaChange(text: string) {
    setFormula(text);
    setCalculated(false);
  }

  function handleDensityChange(text: string) {
    setDensity(text);
    setCalculated(false);
  }

  function handleEquivalenceChange(text: string) {
    setEquivalenceFactor(text);
    setCalculated(false);
  }

  function selectFrom(unit: ConcentrationUnit) {
    setFrom(unit);
    setCalculated(false);
  }

  function selectTo(unit: ConcentrationUnit) {
    setTo(unit);
    setCalculated(false);
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
              <Ionicons
                name="swap-horizontal"
                size={24}
                color={colors.accent}
              />
            </View>

            <ThemedText style={[styles.title, { color: colors.text }]}>
              Conversiones de concentración
            </ThemedText>

            <ThemedText style={[styles.intro, { color: colors.muted }]}>
              Convertí entre distintas formas de expresar una concentración.
              QuimiLab solicitará los datos adicionales solamente cuando sean
              necesarios.
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              1. Concentración inicial
            </ThemedText>

            <ThemedText style={[styles.label, { color: colors.text }]}>
              Valor
            </ThemedText>

            <TextInput
              keyboardType="decimal-pad"
              onChangeText={handleValueChange}
              placeholder="1"
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

            <ThemedText style={[styles.optionLabel, { color: colors.text }]}>
              Unidad de origen
            </ThemedText>

            <View style={styles.options}>
              {concentrationUnits.map((unit) => {
                const selected = from === unit;

                return (
                  <Pressable
                    key={`from-${unit}`}
                    accessibilityRole="button"
                    onPress={() => selectFrom(unit)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : pressed
                            ? colors.surfacePressed
                            : colors.surface,
                        borderColor: selected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.optionButtonText,
                        {
                          color: selected ? colors.accent : colors.text,
                        },
                      ]}
                    >
                      {getConcentrationUnitLabel(unit)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              2. Convertir a
            </ThemedText>

            <View style={styles.options}>
              {concentrationUnits.map((unit) => {
                const selected = to === unit;

                return (
                  <Pressable
                    key={`to-${unit}`}
                    accessibilityRole="button"
                    onPress={() => selectTo(unit)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : pressed
                            ? colors.surfacePressed
                            : colors.surface,
                        borderColor: selected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.optionButtonText,
                        {
                          color: selected ? colors.accent : colors.text,
                        },
                      ]}
                    >
                      {getConcentrationUnitLabel(unit)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              3. Datos adicionales
            </ThemedText>

            <ThemedText style={[styles.help, { color: colors.muted }]}>
              No siempre se necesitan todos estos datos. Podés dejarlos vacíos y
              QuimiLab te indicará si alguno es necesario para la conversión.
            </ThemedText>

            <ThemedText style={[styles.label, { color: colors.text }]}>
              Fórmula del soluto
            </ThemedText>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleFormulaChange}
              placeholder="NaCl"
              placeholderTextColor={colors.muted}
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

            {formula.trim() && molarMassResult ? (
              molarMassResult.error || molarMassResult.warnings.length > 0 ? (
                <ThemedText
                  style={[styles.smallWarning, { color: colors.warning }]}
                >
                  QuimiLab no pudo obtener una masa molar válida para esta
                  fórmula.
                </ThemedText>
              ) : (
                <View
                  style={[
                    styles.dataResult,
                    { backgroundColor: colors.accentSoft },
                  ]}
                >
                  <ThemedText
                    style={[styles.dataResultText, { color: colors.text }]}
                  >
                    Masa molar: {formatNumber(molarMass ?? 0)} g/mol
                  </ThemedText>

                  {molarMassResult.substanceName ? (
                    <ThemedText
                      style={[
                        styles.dataResultSubtext,
                        { color: colors.muted },
                      ]}
                    >
                      {molarMassResult.substanceName}
                    </ThemedText>
                  ) : null}
                </View>
              )
            ) : null}

            <ThemedText style={[styles.label, { color: colors.text }]}>
              Densidad de la solución (g/mL)
            </ThemedText>

            <TextInput
              keyboardType="decimal-pad"
              onChangeText={handleDensityChange}
              placeholder="1,05"
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={density}
            />

            <ThemedText style={[styles.label, { color: colors.text }]}>
              Factor de equivalencia
            </ThemedText>

            <TextInput
              keyboardType="decimal-pad"
              onChangeText={handleEquivalenceChange}
              placeholder="1"
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={equivalenceFactor}
            />

            <ThemedText style={[styles.help, { color: colors.muted }]}>
              El factor de equivalencia se utiliza solamente en conversiones
              relacionadas con normalidad y depende de la reacción química.
            </ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Convertir concentración"
            disabled={numericValue === null}
            onPress={handleCalculate}
            style={({ pressed }) => [
              styles.calculateButton,
              {
                backgroundColor: pressed
                  ? colors.surfacePressed
                  : colors.accent,
                opacity: numericValue !== null ? 1 : 0.5,
              },
            ]}
          >
            <Ionicons
              name="calculator-outline"
              size={20}
              color={isDark ? "#10242A" : "#FFFFFF"}
            />

            <ThemedText
              style={[
                styles.calculateButtonText,
                { color: isDark ? "#10242A" : "#FFFFFF" },
              ]}
            >
              CONVERTIR
            </ThemedText>
          </Pressable>

          {value.trim() && numericValue === null ? (
            <View
              style={[
                styles.message,
                {
                  backgroundColor: colors.dangerSoft,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color={colors.warning}
              />
              <ThemedText style={[styles.messageText, { color: colors.text }]}>
                Ingresá una concentración válida mayor o igual que cero.
              </ThemedText>
            </View>
          ) : null}

          {conversionResult ? (
            conversionResult.success ? (
              <View
                style={[
                  styles.resultCard,
                  { backgroundColor: colors.accentSoft },
                ]}
              >
                <ThemedText
                  style={[styles.resultLabel, { color: colors.accent }]}
                >
                  RESULTADO
                </ThemedText>

                <ThemedText
                  style={[styles.resultConversion, { color: colors.muted }]}
                >
                  {formatNumber(numericValue ?? 0)}{" "}
                  {getConcentrationUnitLabel(from)}
                </ThemedText>

                <Ionicons
                  name="arrow-down"
                  size={22}
                  color={colors.accent}
                  style={styles.resultArrow}
                />

                <ThemedText
                  style={[styles.resultValue, { color: colors.text }]}
                >
                  {formatNumber(conversionResult.value)}{" "}
                  {getConcentrationUnitLabel(to)}
                </ThemedText>

                {conversionResult.explanation.length > 0 ? (
                  <View style={styles.explanationBlock}>
                    <ThemedText
                      style={[styles.explanationTitle, { color: colors.text }]}
                    >
                      ¿Cómo se obtuvo?
                    </ThemedText>

                    {conversionResult.explanation.map((line) => (
                      <ThemedText
                        key={line}
                        style={[
                          styles.explanationText,
                          { color: colors.muted },
                        ]}
                      >
                        • {line}
                      </ThemedText>
                    ))}
                  </View>
                ) : null}

                {conversionResult.warnings.length > 0 ? (
                  <View style={styles.warningBlock}>
                    <ThemedText
                      style={[styles.warningTitle, { color: colors.warning }]}
                    >
                      Atención
                    </ThemedText>

                    {conversionResult.warnings.map((warning) => (
                      <ThemedText
                        key={warning}
                        style={[styles.explanationText, { color: colors.text }]}
                      >
                        • {warning}
                      </ThemedText>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : (
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
                  name="information-circle-outline"
                  size={23}
                  color={colors.warning}
                />

                <View style={styles.messageCopy}>
                  <ThemedText
                    style={[styles.messageTitle, { color: colors.text }]}
                  >
                    No se puede realizar todavía
                  </ThemedText>

                  {conversionResult.explanation.map((line) => (
                    <ThemedText
                      key={line}
                      style={[styles.messageText, { color: colors.muted }]}
                    >
                      {line}
                    </ThemedText>
                  ))}

                  {conversionResult.requiredData.length > 0 ? (
                    <>
                      <ThemedText
                        style={[styles.requiredTitle, { color: colors.text }]}
                      >
                        Datos necesarios:
                      </ThemedText>

                      {conversionResult.requiredData.map((item) => (
                        <ThemedText
                          key={item}
                          style={[
                            styles.requiredItem,
                            { color: colors.warning },
                          ]}
                        >
                          • {item}
                        </ThemedText>
                      ))}
                    </>
                  ) : null}

                  {conversionResult.warnings.map((warning) => (
                    <ThemedText
                      key={warning}
                      style={[styles.warningText, { color: colors.warning }]}
                    >
                      {warning}
                    </ThemedText>
                  ))}
                </View>
              </View>
            )
          ) : null}

          <View
            style={[
              styles.note,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="school-outline" size={20} color={colors.accent} />

            <ThemedText style={[styles.noteText, { color: colors.muted }]}>
              QuimiLab no supone automáticamente densidades, masas molares ni
              factores de equivalencia. Si una conversión necesita un dato que
              no fue proporcionado, lo indicará antes de calcular.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function parseDecimal(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const absoluteValue = Math.abs(value);

  if (
    absoluteValue !== 0 &&
    (absoluteValue < 0.001 || absoluteValue >= 1000000)
  ) {
    return value.toExponential(4).replace(".", ",");
  }

  return value
    .toFixed(6)
    .replace(/\.?0+$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 22,
  },
  mark: {
    alignItems: "center",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginBottom: 18,
    width: 52,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 37,
    marginBottom: 10,
  },
  intro: {
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 16,
  },
  options: {
    gap: 8,
  },
  optionButton: {
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  help: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  dataResult: {
    borderRadius: 9,
    marginTop: 10,
    padding: 11,
  },
  dataResultText: {
    fontSize: 15,
    fontWeight: "700",
  },
  dataResultSubtext: {
    fontSize: 13,
    marginTop: 3,
  },
  smallWarning: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  calculateButton: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 50,
  },
  calculateButtonText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  resultCard: {
    borderRadius: 12,
    marginTop: 16,
    padding: 18,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  resultConversion: {
    fontSize: 15,
  },
  resultArrow: {
    marginVertical: 8,
  },
  resultValue: {
    fontSize: 25,
    fontWeight: "800",
    lineHeight: 32,
  },
  explanationBlock: {
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  warningBlock: {
    marginTop: 16,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 7,
  },
  message: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginTop: 16,
    padding: 16,
  },
  messageCopy: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  requiredTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12,
  },
  requiredItem: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 3,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  note: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    padding: 15,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});

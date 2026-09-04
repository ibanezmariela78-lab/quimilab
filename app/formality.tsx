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
  calculateFormalityPreparation,
  type FormalityPreparationResult,
  type FormalityVolumeUnit,
} from "@/chemistry/formality";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

const materials = [
  "Balanza",
  "Espátula",
  "Recipiente para pesar",
  "Vaso de precipitados",
  "Varilla de vidrio",
  "Embudo",
  "Matraz aforado",
  "Piseta",
  "Agua destilada o solvente correspondiente",
];

const procedure = [
  "Reuní los materiales indicados.",
  "Colocá el recipiente para pesar sobre la balanza.",
  "Tará la balanza.",
  "Pesá la cantidad de soluto calculada.",
  "Disolvé el soluto en una cantidad menor de solvente.",
  "Transferí la preparación al matraz aforado.",
  "Enjuagá el recipiente y agregá los lavados al matraz.",
  "Completá con solvente hasta el volumen final.",
  "Tapá y homogeneizá.",
  "Rotulá la preparación.",
];

type Colors = {
  background: string; surface: string; pressed: string; text: string; muted: string;
  accent: string; soft: string; border: string; input: string; warning: string;
};

export default function FormalityScreen() {
  const [formula, setFormula] = useState("");
  const [formality, setFormality] = useState("");
  const [volume, setVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState<FormalityVolumeUnit>("mL");
  const [result, setResult] = useState<FormalityPreparationResult | null>(null);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors: Colors = isDark
    ? { background: "#10242A", surface: "#18363D", pressed: "#21454D", text: "#F1FAF8", muted: "#B7D1CD", accent: "#5DD3B6", soft: "#214D4A", border: "#2C5559", input: "#0D1D22", warning: "#F2C879" }
    : { background: "#F4F8F7", surface: "#FFFFFF", pressed: "#E8F3F0", text: "#17343A", muted: "#5A7375", accent: "#087F73", soft: "#DDF2EC", border: "#D6E5E0", input: "#FFFFFF", warning: "#9A6815" };

  function handleCalculate() {
    const calculation = calculateFormalityPreparation(formula, formality, volume, volumeUnit);
    if ("error" in calculation) {
      setResult(null);
      setError(calculation.error);
    } else {
      setResult(calculation);
      setError("");
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={[styles.mark, { backgroundColor: colors.soft }]}><Ionicons name="layers-outline" size={25} color={colors.accent} /></View>
            <ThemedText style={[styles.title, { color: colors.text }]}>Preparar por formalidad</ThemedText>
            <ThemedText style={[styles.intro, { color: colors.muted }]}>La formalidad expresa cuántos moles fórmula de una sustancia se utilizaron por litro de solución.</ThemedText>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Field label="Fórmula química" value={formula} onChangeText={setFormula} placeholder="NaCl" colors={colors} />
            <Field label="Formalidad deseada" value={formality} onChangeText={setFormality} placeholder="1" keyboardType="decimal-pad" suffix="mol fórmula/L" colors={colors} />
            <Field label="Volumen final" value={volume} onChangeText={setVolume} placeholder="500" keyboardType="decimal-pad" colors={colors} />
            <ThemedText style={[styles.label, { color: colors.text }]}>Unidad de volumen</ThemedText>
            <View style={styles.segmented}>{(["mL", "L"] as const).map((unit) => <Pressable key={unit} accessibilityRole="button" accessibilityLabel={`Seleccionar ${unit}`} onPress={() => setVolumeUnit(unit)} style={[styles.segment, { backgroundColor: volumeUnit === unit ? colors.accent : colors.input, borderColor: colors.border }]}><ThemedText style={{ color: volumeUnit === unit ? "#FFFFFF" : colors.text, fontWeight: "700" }}>{unit}</ThemedText></Pressable>)}</View>
            <Pressable onPress={handleCalculate} accessibilityRole="button" accessibilityLabel="Calcular preparación por formalidad" style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.pressed : colors.accent }]}><Ionicons name="calculator-outline" size={19} color={isDark ? "#10242A" : "#FFFFFF"} /><ThemedText style={{ color: isDark ? "#10242A" : "#FFFFFF", fontWeight: "800" }}>CALCULAR</ThemedText></Pressable>
          </View>
          {error ? <View style={[styles.message, { backgroundColor: colors.surface, borderColor: colors.border }]}><Ionicons name="alert-circle-outline" size={22} color={colors.warning} /><ThemedText style={[styles.body, { color: colors.text }]}>{error}</ThemedText></View> : null}
          {result ? <Result result={result} colors={colors} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "decimal-pad"; suffix?: string; colors: Colors };
function Field({ label, value, onChangeText, placeholder, keyboardType = "default", suffix, colors }: FieldProps) {
  return <View style={styles.field}><ThemedText style={[styles.label, { color: colors.text }]}>{label}</ThemedText><View style={styles.inputRow}><TextInput autoCapitalize="none" autoCorrect={false} keyboardType={keyboardType} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={value} />{suffix ? <ThemedText style={[styles.suffix, { color: colors.muted }]}>{suffix}</ThemedText> : null}</View></View>;
}

function Result({ result, colors }: { result: FormalityPreparationResult; colors: Colors }) {
  const lightText = colors.accent === "#087F73";
  return <View style={styles.resultArea}>
    <View style={[styles.resultCard, { backgroundColor: colors.soft }]}><ThemedText style={[styles.detailLabel, { color: colors.accent }]}>Sustancia</ThemedText><ThemedText style={[styles.resultTitle, { color: colors.text }]}>{result.molarMass.substanceName ?? result.formula}</ThemedText><ThemedText style={[styles.detailLabel, { color: colors.accent }]}>Fórmula</ThemedText><ThemedText style={[styles.resultFormula, { color: colors.text }]}>{result.formula}</ThemedText><ThemedText style={[styles.detailLabel, { color: colors.accent }]}>Masa molar</ThemedText><ThemedText style={[styles.body, { color: colors.text }]}>{format(result.molarMass.molarMass ?? 0)} g/mol</ThemedText></View>
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Explicación paso a paso</ThemedText><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Paso 1: Convertir volumen a litros</ThemedText><ThemedText style={[styles.equation, { color: colors.text }]}>{format(result.volume)} {result.volumeUnit} = {format(result.volumeLiters, 3)} L</ThemedText><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Paso 2: Calcular moles fórmula</ThemedText><ThemedText style={[styles.equation, { color: colors.text }]}>n fórmula = F × V{`\n`}n fórmula = {format(result.formality)} × {format(result.volumeLiters, 3)}{`\n`}n fórmula = {format(result.formulaMoles, 3)} mol fórmula</ThemedText><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Paso 3: Convertir moles fórmula a gramos</ThemedText><ThemedText style={[styles.equation, { color: colors.text }]}>masa = n fórmula × MM{`\n`}masa = {format(result.formulaMoles, 3)} × {format(result.molarMass.molarMass ?? 0)}{`\n`}masa = {format(result.gramsNeeded, 4)} g</ThemedText></View>
    <View style={[styles.resultCard, { backgroundColor: colors.accent }]}><ThemedText style={{ color: lightText ? "#FFFFFF" : "#10242A", fontWeight: "800" }}>RESULTADO</ThemedText><ThemedText style={[styles.finalMass, { color: lightText ? "#FFFFFF" : "#10242A" }]}>{format(result.gramsNeeded, 2)} g de {result.formula}</ThemedText><ThemedText style={{ color: lightText ? "#FFFFFF" : "#10242A" }}>para preparar {format(result.volume)} {result.volumeUnit} de solución {format(result.formality)} F</ThemedText></View>
    <View style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}><Ionicons name="information-circle-outline" size={22} color={colors.accent} /><ThemedText style={[styles.body, { color: colors.text }]}>El volumen indicado corresponde al volumen FINAL de la solución. No significa agregar el soluto a ese volumen completo de agua. Primero se disuelve en una cantidad menor de solvente y posteriormente se completa hasta alcanzar el volumen final.</ThemedText></View>
    <View style={[styles.note, { backgroundColor: colors.soft, borderColor: colors.border }]}><ThemedText style={[styles.body, { color: colors.text }]}>Un mol fórmula representa una cantidad de sustancia basada en la fórmula química utilizada para preparar la solución. En compuestos que se disocian, la formalidad describe lo que se agregó inicialmente y no necesariamente las especies presentes después de la disolución.</ThemedText></View>
    {result.molarMass.substanceInfo?.observations ? <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Observaciones de la sustancia</ThemedText>{result.molarMass.substanceInfo.observations.map((item) => <ThemedText key={item} style={[styles.body, { color: colors.text }]}>• {item}</ThemedText>)}</View> : null}
    {result.safetyWarning ? <View style={[styles.warning, { backgroundColor: colors.surface, borderColor: colors.warning }]}><Ionicons name="warning-outline" size={22} color={colors.warning} /><ThemedText style={[styles.body, { color: colors.text }]}>{result.safetyWarning}</ThemedText></View> : <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Materiales y procedimiento</ThemedText>{materials.map((item) => <ThemedText key={item} style={[styles.listItem, { color: colors.muted }]}>• {item}</ThemedText>)}{procedure.map((step, index) => <ThemedText key={step} style={[styles.listItem, { color: colors.muted }]}>{index + 1}. {step}</ThemedText>)}</View>}
  </View>;
}

function format(value: number, decimals = 3): string { return value.toFixed(decimals).replace(/\.?(0+)$/u, "").replace(".", ","); }

const styles = StyleSheet.create({ safeArea: { flex: 1 }, flex: { flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 }, header: { marginBottom: 22 }, mark: { alignItems: "center", borderRadius: 14, height: 52, justifyContent: "center", marginBottom: 18, width: 52 }, title: { fontSize: 30, fontWeight: "800", lineHeight: 37, marginBottom: 10 }, intro: { fontSize: 15, lineHeight: 23 }, card: { borderRadius: 12, borderWidth: 1, marginBottom: 12, padding: 16 }, field: { marginBottom: 14 }, label: { fontSize: 15, fontWeight: "700", marginBottom: 8 }, inputRow: { alignItems: "center", flexDirection: "row" }, input: { borderRadius: 9, borderWidth: 1, flex: 1, fontSize: 17, paddingHorizontal: 14, paddingVertical: 12 }, suffix: { fontSize: 14, marginLeft: 8 }, segmented: { flexDirection: "row", gap: 8, marginBottom: 16 }, segment: { alignItems: "center", borderRadius: 9, borderWidth: 1, flex: 1, minHeight: 44, justifyContent: "center" }, button: { alignItems: "center", borderRadius: 9, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 48 }, message: { alignItems: "flex-start", borderRadius: 12, borderWidth: 1, flexDirection: "row", gap: 11, marginTop: 20, padding: 16 }, resultArea: { marginTop: 20 }, resultCard: { borderRadius: 12, marginBottom: 12, padding: 18 }, detailLabel: { fontSize: 12, fontWeight: "800", letterSpacing: 0.7, marginTop: 2, textTransform: "uppercase" }, resultTitle: { fontSize: 20, fontWeight: "800", lineHeight: 28, marginBottom: 10, marginTop: 4 }, resultFormula: { fontSize: 19, fontWeight: "700", marginBottom: 10, marginTop: 4 }, sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12, marginTop: 4 }, body: { flex: 1, fontSize: 14, lineHeight: 21 }, equation: { fontFamily: "monospace", fontSize: 14, lineHeight: 23, marginBottom: 12 }, finalMass: { fontSize: 20, fontWeight: "800", lineHeight: 27, marginVertical: 8 }, note: { alignItems: "flex-start", borderRadius: 12, borderWidth: 1, flexDirection: "row", gap: 11, marginBottom: 12, padding: 16 }, warning: { alignItems: "flex-start", borderRadius: 12, borderWidth: 1, flexDirection: "row", gap: 11, marginBottom: 12, padding: 16 }, listItem: { fontSize: 14, lineHeight: 23 }, mass: { fontSize: 24, fontWeight: "800" },
});

import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    dissolutionBehaviorLabels,
    formatPreparationTypes,
    physicalStateLabels,
    safetyLevelLabels,
    solubilityLabels,
} from "@/chemistry/labels";
import { calculateMolarMass } from "@/chemistry/molarMass";
import {
    findSubstanceRecords,
    getSubstanceRecords,
    type SubstanceRecord,
} from "@/chemistry/substances";
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

export default function SubstancesScreen() {
  const [query, setQuery] = useState("");
  const [selectedFormula, setSelectedFormula] = useState("CaCl2");
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
  const matches = useMemo(() => findSubstanceRecords(query), [query]);
  const selected =
    getSubstanceRecords().find(
      (substance) => substance.formula === selectedFormula,
    ) ?? null;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.mark, { backgroundColor: colors.soft }]}>
            <Ionicons name="flask-outline" size={25} color={colors.accent} />
          </View>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Sustancias y propiedades
          </ThemedText>
          <ThemedText style={[styles.intro, { color: colors.muted }]}>
            Consultá información química y comportamiento de las sustancias
            utilizadas en el laboratorio.
          </ThemedText>
        </View>
        <View
          style={[
            styles.searchCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.label, { color: colors.text }]}>
            Buscar por nombre o fórmula
          </ThemedText>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={20} color={colors.muted} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="NaCl o Cloruro de sodio"
              placeholderTextColor={colors.muted}
              style={[styles.searchInput, { color: colors.text }]}
              value={query}
            />
          </View>
        </View>
        <View style={styles.matches}>
          {matches.map((substance) => (
            <Pressable
              key={substance.formula}
              onPress={() => setSelectedFormula(substance.formula)}
              style={({ pressed }) => [
                styles.match,
                {
                  backgroundColor: pressed ? colors.pressed : colors.surface,
                  borderColor:
                    substance.formula === selectedFormula
                      ? colors.accent
                      : colors.border,
                },
              ]}
            >
              <View style={styles.matchCopy}>
                <ThemedText
                  style={[styles.matchFormula, { color: colors.text }]}
                >
                  {substance.formula}
                </ThemedText>
                <ThemedText style={[styles.matchName, { color: colors.muted }]}>
                  {substance.name}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.accent}
              />
            </Pressable>
          ))}
        </View>
        {selected ? (
          <SubstanceCard substance={selected} colors={colors} />
        ) : (
          <ThemedText style={[styles.empty, { color: colors.muted }]}>
            No encontramos una ficha con ese nombre o fórmula.
          </ThemedText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SubstanceCard({
  substance,
  colors,
}: {
  substance: SubstanceRecord;
  colors: Colors;
}) {
  const molarMass = calculateMolarMass(substance.formula);
  const safety = substance.safetyClassification
    ? safetyLevelLabels[substance.safetyClassification]
    : null;
  const solubility = substance.waterSolubility;
  const dissolution = substance.dissolutionBehavior ?? "unknown";
  const preparationTypes = formatPreparationTypes(substance.preparationTypes);
  return (
    <View style={styles.detailArea}>
      <View style={[styles.heroCard, { backgroundColor: colors.soft }]}>
        <ThemedText style={[styles.eyebrow, { color: colors.accent }]}>
          FICHA DE SUSTANCIA
        </ThemedText>
        <ThemedText style={[styles.heroTitle, { color: colors.text }]}>
          {substance.name}
        </ThemedText>
        <ThemedText style={[styles.heroFormula, { color: colors.muted }]}>
          {substance.formula}
        </ThemedText>
      </View>
      <InfoBlock title="Identificación" colors={colors}>
        <InfoRow label="Nombre" value={substance.name} colors={colors} />
        <InfoRow label="Fórmula" value={substance.formula} colors={colors} />
        <InfoRow
          label="Estado físico"
          value={
            substance.physicalState
              ? physicalStateLabels[substance.physicalState]
              : null
          }
          colors={colors}
        />
      </InfoBlock>
      <InfoBlock title="Datos químicos" colors={colors}>
        <InfoRow
          label="Masa molar"
          value={
            molarMass.molarMass !== null
              ? `${format(molarMass.molarMass)} g/mol`
              : null
          }
          colors={colors}
        />
        <InfoRow label="Densidad" value={null} colors={colors} />
      </InfoBlock>
      <InfoBlock title="Solubilidad" colors={colors}>
        <InfoRow
          label="En agua"
          value={
            solubility?.classification
              ? solubilityLabels[solubility.classification]
              : null
          }
          colors={colors}
        />
        <InfoRow
          label="Descripción"
          value={solubility?.description}
          colors={colors}
        />
        <InfoRow
          label="Dependencia con temperatura"
          value={solubility?.temperatureDependence}
          colors={colors}
        />
      </InfoBlock>
      <InfoBlock title="Comportamiento frente a la temperatura" colors={colors}>
        <InfoRow
          label="Punto de fusión"
          value={formatOptionalTemperature(substance.meltingPointC)}
          colors={colors}
        />
        <InfoRow
          label="Punto de ebullición"
          value={formatOptionalTemperature(substance.boilingPointC)}
          colors={colors}
        />
        <InfoRow
          label="Advertencia térmica"
          value={substance.thermalWarning}
          colors={colors}
        />
      </InfoBlock>
      <InfoBlock title="Al disolverse" colors={colors}>
        <InfoRow
          label="Comportamiento térmico"
          value={dissolutionBehaviorLabels[dissolution]}
          colors={colors}
        />
      </InfoBlock>
      <InfoBlock title="Uso en preparaciones" colors={colors}>
        <InfoRow
          label="Tipos registrados"
          value={preparationTypes}
          colors={colors}
        />
        <InfoRow
          label="Observaciones"
          value={substance.observations?.join(" ")}
          colors={colors}
        />
      </InfoBlock>
      <InfoBlock
        title="Seguridad"
        colors={colors}
        warning={substance.safetyClassification === "highPrecaution"}
      >
        {<InfoRow label="Nivel" value={safety} colors={colors} />}
      </InfoBlock>
    </View>
  );
}

function InfoBlock({
  title,
  colors,
  children,
  warning = false,
}: {
  title: string;
  colors: Colors;
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoBlock,
        {
          backgroundColor: colors.surface,
          borderColor: warning ? colors.warning : colors.border,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}
function InfoRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string | null | undefined;
  colors: Colors;
}) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={[styles.infoLabel, { color: colors.muted }]}>
        {label}
      </ThemedText>
      <ThemedText
        style={[
          styles.infoValue,
          { color: value ? colors.text : colors.muted },
        ]}
      >
        {value ?? "Dato no disponible en la ficha actual."}
      </ThemedText>
    </View>
  );
}
function formatOptionalTemperature(
  value: number | null | undefined,
): string | null {
  return value === null || value === undefined ? null : `${format(value)} °C`;
}
function format(value: number): string {
  return value
    .toFixed(3)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
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
  searchCard: { borderRadius: 12, borderWidth: 1, padding: 16 },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  searchRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D6E5E0",
    flexDirection: "row",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 10 },
  matches: { gap: 8, marginTop: 12 },
  match: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 13,
  },
  matchCopy: { flex: 1 },
  matchFormula: { fontSize: 16, fontWeight: "700" },
  matchName: { fontSize: 13, marginTop: 3 },
  detailArea: { marginTop: 20 },
  heroCard: { borderRadius: 12, marginBottom: 12, padding: 18 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroTitle: { fontSize: 24, fontWeight: "800", lineHeight: 31 },
  heroFormula: { fontSize: 17, marginTop: 5 },
  infoBlock: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 10 },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D6E5E0",
    paddingVertical: 9,
  },
  infoLabel: { fontSize: 12, fontWeight: "700", marginBottom: 3 },
  infoValue: { fontSize: 14, lineHeight: 21 },
  empty: { marginTop: 24, textAlign: "center" },
});

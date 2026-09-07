import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
    calculateDilution,
    type DilutionConcentrationType,
    type DilutionVolumeUnit,
} from "../chemistry/dilution";

import type { SubstanceRecord } from "../chemistry/substances";

type Props = {
  substance: SubstanceRecord | null;
};

export default function DilutionPreparationCard({ substance }: Props) {
  const [type, setType] = useState<DilutionConcentrationType>("molarity");

  const [initialConcentration, setInitialConcentration] = useState("1");

  const [finalConcentration, setFinalConcentration] = useState("0,5");

  const [finalVolume, setFinalVolume] = useState("500");

  const [volumeUnit, setVolumeUnit] = useState<DilutionVolumeUnit>("mL");

  const calculation = useMemo(() => {
    if (!substance) {
      return null;
    }

    return calculateDilution(
      substance.formula,
      type,
      initialConcentration,
      finalConcentration,
      finalVolume,
      volumeUnit,
    );
  }, [
    substance,
    type,
    initialConcentration,
    finalConcentration,
    finalVolume,
    volumeUnit,
  ]);

  if (!substance) {
    return (
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>Falta identificar la sustancia</Text>

        <Text style={styles.warningText}>
          QuimiLab necesita saber qué sustancia contiene la solución madre antes
          de calcular la dilución.
        </Text>
      </View>
    );
  }

  const concentrationUnit = type === "molarity" ? "M" : "N";

  return (
    <View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Diluir una solución madre</Text>

        <Text style={styles.body}>
          QuimiLab utiliza la relación C₁ × V₁ = C₂ × V₂ para calcular cuánto
          volumen de la solución madre debe medirse.
        </Text>
      </View>

      <Text style={styles.label}>Tipo de concentración</Text>

      <View style={styles.row}>
        <OptionButton
          label="Molaridad"
          active={type === "molarity"}
          onPress={() => setType("molarity")}
        />

        <OptionButton
          label="Normalidad"
          active={type === "normality"}
          onPress={() => setType("normality")}
        />
      </View>

      <Text style={styles.label}>Concentración de la solución madre C₁</Text>

      <View style={styles.valueRow}>
        <TextInput
          value={initialConcentration}
          onChangeText={setInitialConcentration}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="1"
        />

        <Text style={styles.unit}>{concentrationUnit}</Text>
      </View>

      <Text style={styles.label}>Concentración deseada C₂</Text>

      <View style={styles.valueRow}>
        <TextInput
          value={finalConcentration}
          onChangeText={setFinalConcentration}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="0,5"
        />

        <Text style={styles.unit}>{concentrationUnit}</Text>
      </View>

      <Text style={styles.label}>Volumen final V₂</Text>

      <TextInput
        value={finalVolume}
        onChangeText={setFinalVolume}
        keyboardType="decimal-pad"
        style={styles.fullInput}
        placeholder="500"
      />

      <View style={styles.row}>
        <OptionButton
          label="mL"
          active={volumeUnit === "mL"}
          onPress={() => setVolumeUnit("mL")}
        />

        <OptionButton
          label="L"
          active={volumeUnit === "L"}
          onPress={() => setVolumeUnit("L")}
        />
      </View>

      {calculation ? (
        "error" in calculation ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>No se puede calcular</Text>

            <Text style={styles.warningText}>{calculation.error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.calculationCard}>
              <Text style={styles.sectionTitle}>Cálculo</Text>

              <Text style={styles.equation}>C₁ × V₁ = C₂ × V₂</Text>

              <Text style={styles.equation}>V₁ = (C₂ × V₂) / C₁</Text>

              <Text style={styles.body}>
                V₁ = ({formatNumber(calculation.finalConcentration)} ×{" "}
                {formatNumber(calculation.finalVolume)}) /{" "}
                {formatNumber(calculation.initialConcentration)}
              </Text>

              <Text style={styles.resultValue}>
                V₁ = {formatNumber(calculation.stockVolume)}{" "}
                {calculation.volumeUnit}
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>RESULTADO</Text>

              <Text style={styles.resultText}>
                Medir {formatNumber(calculation.stockVolume)}{" "}
                {calculation.volumeUnit} de solución madre de {substance.name}
              </Text>

              <Text style={styles.resultSecondary}>
                y completar con el solvente hasta un volumen final de{" "}
                {formatNumber(calculation.finalVolume)} {calculation.volumeUnit}
                .
              </Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Importante</Text>

              <Text style={styles.body}>
                El volumen final no significa agregar automáticamente V₂ − V₁ de
                solvente. Primero se mide la solución madre y después se
                completa hasta la marca de volumen final.
              </Text>
            </View>

            {type === "normality" ? (
              <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>Normalidad</Text>

                <Text style={styles.body}>
                  C₁ y C₂ deben estar expresadas con el mismo criterio de
                  equivalencia, porque la normalidad depende de la reacción
                  considerada.
                </Text>
              </View>
            ) : null}

            {calculation.safetyWarning ? (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Seguridad</Text>

                <Text style={styles.warningText}>
                  {calculation.safetyWarning}
                </Text>
              </View>
            ) : null}
          </>
        )
      ) : null}
    </View>
  );
}

function OptionButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionButton, active && styles.optionButtonActive]}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function formatNumber(value: number, decimals = 4): string {
  return value
    .toFixed(decimals)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#e0f4f0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
  },

  infoTitle: {
    color: "#173b40",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },

  body: {
    color: "#4f696b",
    fontSize: 15,
    lineHeight: 22,
  },

  label: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 16,
    marginTop: 13,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 5,
  },

  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: "center",
  },

  optionButtonActive: {
    backgroundColor: "#0d887d",
    borderColor: "#0d887d",
  },

  optionText: {
    color: "#173b40",
    fontWeight: "700",
  },

  optionTextActive: {
    color: "#ffffff",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: "#173b40",
    backgroundColor: "#ffffff",
  },

  fullInput: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: "#173b40",
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },

  unit: {
    color: "#617a7b",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 10,
  },

  calculationCard: {
    backgroundColor: "#f4f9f8",
    borderRadius: 14,
    padding: 15,
    marginTop: 18,
  },

  sectionTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 8,
  },

  equation: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 6,
  },

  resultValue: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 19,
    marginTop: 10,
  },

  resultCard: {
    backgroundColor: "#0d887d",
    borderRadius: 15,
    padding: 17,
    marginTop: 14,
  },

  resultLabel: {
    color: "#d9f4ef",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },

  resultText: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 27,
  },

  resultSecondary: {
    color: "#e6f7f4",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 7,
  },

  noteCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 14,
    padding: 15,
    marginTop: 14,
  },

  noteTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 6,
  },

  warningCard: {
    backgroundColor: "#fff6df",
    borderWidth: 1,
    borderColor: "#ddb85e",
    borderRadius: 14,
    padding: 15,
    marginTop: 14,
  },

  warningTitle: {
    color: "#805a08",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 6,
  },

  warningText: {
    color: "#6c562b",
    lineHeight: 22,
  },
});

import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
    calculateCommercialDilution,
    type CommercialConcentrationType,
    type CommercialVolumeUnit,
} from "../chemistry/commercial";

import type { SubstanceRecord } from "../chemistry/substances";

export type CommercialReportData = {
  concentrationType: CommercialConcentrationType;
  percentage: number;
  density: number;
  commercialMolarity: number;
  commercialConcentration: number;
  finalConcentration: number;
  finalVolume: number;
  stockVolume: number;
  volumeUnit: CommercialVolumeUnit;
  safetyWarning?: string;
};
type Props = {
  substance: SubstanceRecord | null;
  onCalculationChange?: (data: CommercialReportData | null) => void;
};

export default function CommercialReagentPreparationCard({
  substance,
  onCalculationChange,
}: Props) {
  const [percentage, setPercentage] = useState("37");

  const [density, setDensity] = useState("1,19");

  const [type, setType] = useState<CommercialConcentrationType>("molarity");

  const [finalConcentration, setFinalConcentration] = useState("0,1");

  const [finalVolume, setFinalVolume] = useState("500");

  const [volumeUnit, setVolumeUnit] = useState<CommercialVolumeUnit>("mL");

  const calculation = useMemo(() => {
    if (!substance) {
      return null;
    }

    return calculateCommercialDilution(
      substance.formula,
      percentage,
      density,
      type,
      finalConcentration,
      finalVolume,
      volumeUnit,
    );
  }, [
    substance,
    percentage,
    density,
    type,
    finalConcentration,
    finalVolume,
    volumeUnit,
  ]);

  useEffect(() => {
    if (!calculation || "error" in calculation) {
      onCalculationChange?.(null);
      return;
    }

    onCalculationChange?.({
      concentrationType: type,
      percentage: calculation.percentage,
      density: calculation.density,
      commercialMolarity: calculation.commercialMolarity,
      commercialConcentration: calculation.commercialConcentration,
      finalConcentration: calculation.finalConcentration,
      finalVolume: calculation.finalVolume,
      stockVolume: calculation.stockVolume,
      volumeUnit: calculation.volumeUnit,
      safetyWarning: calculation.safetyWarning ?? undefined,
    });
  }, [calculation, onCalculationChange, type]);

  if (!substance) {
    return (
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>Falta identificar el reactivo</Text>

        <Text style={styles.warningText}>
          QuimiLab necesita identificar la sustancia antes de realizar el
          cálculo.
        </Text>
      </View>
    );
  }

  const concentrationUnit = type === "molarity" ? "M" : "N";

  return (
    <View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Preparar desde reactivo comercial</Text>

        <Text style={styles.body}>
          Ingresá los datos reales indicados en la etiqueta del reactivo
          comercial. QuimiLab calculará su concentración aproximada y el volumen
          teórico necesario.
        </Text>
      </View>

      <View style={styles.substanceCard}>
        <Text style={styles.smallLabel}>REACTIVO IDENTIFICADO</Text>

        <Text style={styles.substanceName}>{substance.name}</Text>

        <Text style={styles.formula}>{substance.formula}</Text>
      </View>

      <Text style={styles.label}>Porcentaje comercial</Text>

      <View style={styles.valueRow}>
        <TextInput
          value={percentage}
          onChangeText={setPercentage}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="37"
        />

        <Text style={styles.unit}>% m/m</Text>
      </View>

      <Text style={styles.label}>Densidad</Text>

      <View style={styles.valueRow}>
        <TextInput
          value={density}
          onChangeText={setDensity}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="1,19"
        />

        <Text style={styles.unit}>g/mL</Text>
      </View>

      <Text style={styles.label}>Tipo de concentración final</Text>

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

      <Text style={styles.label}>Concentración final deseada</Text>

      <View style={styles.valueRow}>
        <TextInput
          value={finalConcentration}
          onChangeText={setFinalConcentration}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="0,1"
        />

        <Text style={styles.unit}>{concentrationUnit}</Text>
      </View>

      <Text style={styles.label}>Volumen final</Text>

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
              <Text style={styles.sectionTitle}>Concentración comercial</Text>

              <Text style={styles.equation}>
                M = (densidad × 10 × %) / masa molar
              </Text>

              <Text style={styles.strong}>
                M ≈ {formatNumber(calculation.commercialMolarity, 4)} M
              </Text>

              {type === "normality" ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Conversión a normalidad
                  </Text>

                  <Text style={styles.equation}>
                    N = M × factor de equivalencia
                  </Text>

                  <Text style={styles.strong}>
                    N ≈ {formatNumber(calculation.commercialConcentration, 4)} N
                  </Text>
                </>
              ) : null}

              <Text style={styles.sectionTitle}>Dilución</Text>

              <Text style={styles.equation}>C₁ × V₁ = C₂ × V₂</Text>

              <Text style={styles.equation}>V₁ = (C₂ × V₂) / C₁</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>RESULTADO TEÓRICO</Text>

              <Text style={styles.resultText}>
                {formatNumber(calculation.stockVolume, 4)}{" "}
                {calculation.volumeUnit} de solución comercial
              </Text>

              <Text style={styles.resultSecondary}>
                para preparar {formatNumber(calculation.finalVolume)}{" "}
                {calculation.volumeUnit} a{" "}
                {formatNumber(calculation.finalConcentration)}{" "}
                {concentrationUnit}.
              </Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Datos de la etiqueta</Text>

              <Text style={styles.body}>
                El porcentaje y la densidad deben copiarse de la etiqueta del
                reactivo realmente utilizado. No deben suponerse valores
                estándar.
              </Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Interpretación</Text>

              <Text style={styles.body}>
                {formatNumber(calculation.percentage)} % m/m indica la
                proporción en masa del reactivo dentro de la solución comercial.
                Una densidad de {formatNumber(calculation.density)} g/mL indica
                la masa aproximada de cada mililitro de esa solución.
              </Text>
            </View>

            {calculation.safetyWarning ? (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Seguridad</Text>

                <Text style={styles.warningText}>
                  {calculation.safetyWarning}
                </Text>

                <Text style={[styles.warningText, styles.warningExtra]}>
                  QuimiLab muestra el cálculo teórico, pero no genera un
                  procedimiento autónomo de manipulación para este reactivo.
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

function formatNumber(value: number, decimals = 3): string {
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

  substanceCard: {
    backgroundColor: "#f4f9f8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  smallLabel: {
    color: "#0d887d",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  substanceName: {
    color: "#173b40",
    fontSize: 18,
    fontWeight: "800",
  },

  formula: {
    color: "#0d887d",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 3,
  },

  label: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 16,
    marginTop: 13,
    marginBottom: 8,
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
    marginLeft: 10,
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

  calculationCard: {
    backgroundColor: "#f4f9f8",
    borderRadius: 14,
    padding: 15,
    marginTop: 18,
  },

  sectionTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 17,
    marginTop: 7,
    marginBottom: 7,
  },

  equation: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },

  strong: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
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

  warningExtra: {
    marginTop: 8,
  },
});

import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
    calculateMoleFractionPreparation,
    type MoleFractionPreparationResponse,
} from "../chemistry/moleFractionPreparation";

import type { MoleAmountUnit } from "../chemistry/moleFraction";

import type { SubstanceRecord } from "../chemistry/substances";

type Props = {
  component1: SubstanceRecord | null;
  component2: SubstanceRecord | null;
};

export default function MoleFractionPreparationCard({
  component1,
  component2,
}: Props) {
  const [amount1, setAmount1] = useState("1");
  const [unit1, setUnit1] = useState<MoleAmountUnit>("mol");

  const [amount2, setAmount2] = useState("9");
  const [unit2, setUnit2] = useState<MoleAmountUnit>("mol");

  const calculation = useMemo<MoleFractionPreparationResponse | null>(() => {
    if (!component1 || !component2) {
      return null;
    }

    return calculateMoleFractionPreparation([
      {
        identifier: component1.formula,
        amount: amount1,
        unit: unit1,
      },
      {
        identifier: component2.formula,
        amount: amount2,
        unit: unit2,
      },
    ]);
  }, [component1, component2, amount1, amount2, unit1, unit2]);

  if (!component1 || !component2) {
    return (
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>Faltan componentes</Text>

        <Text style={styles.warningText}>
          QuimiLab necesita identificar los dos componentes para calcular la
          fracción molar.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fracción molar</Text>

        <Text style={styles.body}>
          Indicá la cantidad de cada componente. Podés ingresarla directamente
          en moles o en gramos. Si usás gramos, QuimiLab convierte
          automáticamente la masa a moles.
        </Text>
      </View>

      <ComponentAmountInput
        title={`Componente 1: ${component1.name}`}
        formula={component1.formula}
        value={amount1}
        onChangeText={setAmount1}
        unit={unit1}
        onChangeUnit={setUnit1}
      />

      <ComponentAmountInput
        title={`Componente 2: ${component2.name}`}
        formula={component2.formula}
        value={amount2}
        onChangeText={setAmount2}
        unit={unit2}
        onChangeUnit={setUnit2}
      />

      {calculation ? (
        <MoleFractionResultView
          calculation={calculation}
          component1={component1}
          component2={component2}
        />
      ) : null}
    </View>
  );
}

type ComponentAmountInputProps = {
  title: string;
  formula: string;
  value: string;
  onChangeText: (value: string) => void;
  unit: MoleAmountUnit;
  onChangeUnit: (unit: MoleAmountUnit) => void;
};

function ComponentAmountInput({
  title,
  formula,
  value,
  onChangeText,
  unit,
  onChangeUnit,
}: ComponentAmountInputProps) {
  return (
    <View style={styles.componentCard}>
      <Text style={styles.componentTitle}>{title}</Text>

      <Text style={styles.formula}>{formula}</Text>

      <Text style={styles.label}>Cantidad</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholder="1"
      />

      <View style={styles.unitRow}>
        {(["mol", "g"] as const).map((currentUnit) => (
          <Pressable
            key={currentUnit}
            style={[
              styles.unitButton,
              unit === currentUnit && styles.unitButtonActive,
            ]}
            onPress={() => onChangeUnit(currentUnit)}
          >
            <Text
              style={[
                styles.unitText,
                unit === currentUnit && styles.unitTextActive,
              ]}
            >
              {currentUnit}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MoleFractionResultView({
  calculation,
  component1,
  component2,
}: {
  calculation: MoleFractionPreparationResponse;
  component1: SubstanceRecord;
  component2: SubstanceRecord;
}) {
  if ("error" in calculation) {
    return (
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>No se puede calcular</Text>

        <Text style={styles.warningText}>{calculation.error}</Text>
      </View>
    );
  }

  const result = calculation.result;

  const fraction1 = result.fractions[0];
  const fraction2 = result.fractions[1];

  const fractionSum = result.fractions.reduce(
    (total, fraction) => total + fraction,
    0,
  );

  return (
    <>
      <View style={styles.calculationCard}>
        <Text style={styles.sectionTitle}>Conversión a moles</Text>

        {result.components.map((component, index) => (
          <View
            key={`${component.identifier}-${index}`}
            style={styles.componentResult}
          >
            <Text style={styles.resultName}>
              {index === 0 ? component1.name : component2.name}
            </Text>

            <Text style={styles.body}>
              Cantidad ingresada: {formatNumber(component.amount)}{" "}
              {component.unit}
            </Text>

            {component.molesCalculation ? (
              <Text style={styles.equation}>{component.molesCalculation}</Text>
            ) : null}

            <Text style={styles.strong}>
              Moles: {formatNumber(component.moles, 6)} mol
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Moles totales</Text>

        <Text style={styles.equation}>n total = n₁ + n₂</Text>

        <Text style={styles.strong}>
          {formatNumber(result.totalMoles, 6)} mol
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>FRACCIONES MOLARES</Text>

        <Text style={styles.mainResult}>
          X({component1.formula}) = {formatNumber(fraction1, 6)}
        </Text>

        <Text style={styles.mainResult}>
          X({component2.formula}) = {formatNumber(fraction2, 6)}
        </Text>
      </View>

      <View style={styles.checkCard}>
        <Text style={styles.checkTitle}>Comprobación</Text>

        <Text style={styles.equation}>
          X₁ + X₂ = {formatNumber(fractionSum, 6)}
        </Text>

        <Text style={styles.body}>
          La suma de las fracciones molares debe ser igual a 1.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Qué significa?</Text>

        <Text style={styles.body}>
          La fracción molar indica qué proporción de los moles totales
          corresponde a cada componente. No tiene unidades.
        </Text>
      </View>
    </>
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
    marginTop: 12,
    marginBottom: 15,
  },

  infoTitle: {
    color: "#173b40",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  body: {
    color: "#4f696b",
    fontSize: 15,
    lineHeight: 22,
  },

  componentCard: {
    backgroundColor: "#f4f9f8",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },

  componentTitle: {
    color: "#173b40",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  formula: {
    color: "#0d887d",
    fontWeight: "800",
    marginBottom: 10,
  },

  label: {
    color: "#173b40",
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: "#173b40",
    backgroundColor: "#ffffff",
  },

  unitRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  unitButton: {
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 11,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },

  unitButtonActive: {
    backgroundColor: "#0d887d",
    borderColor: "#0d887d",
  },

  unitText: {
    color: "#173b40",
    fontWeight: "700",
  },

  unitTextActive: {
    color: "#ffffff",
  },

  calculationCard: {
    backgroundColor: "#f4f9f8",
    borderRadius: 15,
    padding: 16,
    marginTop: 14,
  },

  sectionTitle: {
    color: "#173b40",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 8,
  },

  componentResult: {
    marginBottom: 14,
  },

  resultName: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },

  equation: {
    color: "#0d887d",
    fontSize: 16,
    fontWeight: "800",
    marginVertical: 5,
  },

  strong: {
    color: "#173b40",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
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

  mainResult: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
  },

  checkCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d3e2e0",
    borderRadius: 14,
    padding: 15,
    marginTop: 14,
  },

  checkTitle: {
    color: "#173b40",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
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

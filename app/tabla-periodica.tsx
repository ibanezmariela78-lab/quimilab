import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { elements } from "@/data/elements";

export default function PeriodicTableScreen() {
  const [query, setQuery] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(1);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return elements;

    return elements.filter((element) =>
      normalize(
        `${element.atomicNumber} ${element.symbol} ${element.name} ${element.spanishName}`,
      ).includes(q),
    );
  }, [query]);

  const selected =
    elements.find((element) => element.atomicNumber === selectedNumber) ??
    elements[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={styles.title}>Tabla periódica</ThemedText>
        <ThemedText style={styles.intro}>
          Consultá los 118 elementos por nombre, símbolo o número atómico.
        </ThemedText>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setQuery}
          placeholder="Ej.: Na, Sodio o 11"
          style={styles.search}
          value={query}
        />

        <ThemedText style={styles.count}>
          {filtered.length} elemento{filtered.length === 1 ? "" : "s"}
        </ThemedText>

        <View style={styles.grid}>
          {filtered.map((element) => (
            <Pressable
              key={element.atomicNumber}
              onPress={() => setSelectedNumber(element.atomicNumber)}
              style={[
                styles.element,
                selectedNumber === element.atomicNumber && styles.selected,
              ]}
            >
              <ThemedText style={styles.number}>
                {element.atomicNumber}
              </ThemedText>
              <ThemedText style={styles.symbol}>{element.symbol}</ThemedText>
              <ThemedText numberOfLines={1} style={styles.name}>
                {element.spanishName}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              No encontramos ese elemento
            </ThemedText>
            <ThemedText>
              Probá buscar por nombre, símbolo o número atómico.
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.card}>
          <ThemedText style={styles.label}>FICHA DEL ELEMENTO</ThemedText>
          <ThemedText style={styles.detailTitle}>
            {selected.spanishName} ({selected.symbol})
          </ThemedText>

          <Row label="Número atómico" value={String(selected.atomicNumber)} />
          <Row label="Símbolo" value={selected.symbol} />
          <Row
            label="Peso atómico estándar"
            value={
              selected.atomicWeight !== null
                ? `${selected.atomicWeight.toLocaleString("es-AR", {
                    maximumFractionDigits: 6,
                  })} u`
                : "No disponible"
            }
          />

          {selected.atomicWeightInterval ? (
            <Row
              label="Intervalo"
              value={`${selected.atomicWeightInterval.min} – ${selected.atomicWeightInterval.max} u`}
            />
          ) : null}

          {!selected.hasStandardAtomicWeight ? (
            <ThemedText style={styles.note}>
              Este elemento no tiene un peso atómico estándar indicado en la
              base actual.
            </ThemedText>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText style={styles.rowValue}>{value}</ThemedText>
    </View>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F8F7" },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    color: "#17343A",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  intro: {
    color: "#5A7375",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18,
  },
  search: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6E5E0",
    borderRadius: 12,
    borderWidth: 1,
    color: "#17343A",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  count: { color: "#5A7375", fontSize: 13, marginVertical: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
  },
  element: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6E5E0",
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 92,
    padding: 9,
    width: "31.5%",
  },
  selected: { backgroundColor: "#DDF2EC", borderColor: "#087F73" },
  number: { color: "#5A7375", fontSize: 11 },
  symbol: {
    color: "#087F73",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 3,
  },
  name: { color: "#17343A", fontSize: 11, marginTop: 5 },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6E5E0",
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 6,
    padding: 18,
  },
  label: {
    color: "#087F73",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
  cardTitle: { color: "#17343A", fontSize: 18, fontWeight: "800" },
  detailTitle: {
    color: "#17343A",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
  },
  row: {
    borderTopColor: "#E4ECE9",
    borderTopWidth: 1,
    paddingVertical: 11,
  },
  rowLabel: { color: "#5A7375", fontSize: 12 },
  rowValue: {
    color: "#17343A",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  note: { color: "#5A7375", fontSize: 13, lineHeight: 19, marginTop: 8 },
});

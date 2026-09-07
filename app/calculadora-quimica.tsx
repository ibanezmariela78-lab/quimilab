import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function CalculadoraQuimicaScreen() {
  const router = useRouter();
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
      };

  const tools = [
    {
      title: "Masa molar",
      description: "Calculá la masa molar a partir de una fórmula química.",
      icon: "calculator-outline",
      route: "/molar-mass",
    },
    {
      title: "Molaridad",
      description: "Calculá concentraciones expresadas en mol/L.",
      icon: "flask-outline",
      route: "/molarity",
    },
    {
      title: "Molalidad",
      description: "Calculá concentraciones expresadas en mol/kg de solvente.",
      icon: "water-outline",
      route: "/molality",
    },
    {
      title: "Porcentajes",
      description: "Trabajá con % m/m, % m/v y % v/v.",
      icon: "pie-chart-outline",
      route: "/percentages",
    },
    {
      title: "Normalidad",
      description: "Calculá equivalentes por litro según la reacción.",
      icon: "flash-outline",
      route: "/normality",
    },
    {
      title: "Fracción molar",
      description: "Calculá la proporción molar de cada componente.",
      icon: "git-compare-outline",
      route: "/mole-fraction",
    },
    {
      title: "ppm y ppb",
      description: "Calculá concentraciones muy pequeñas.",
      icon: "analytics-outline",
      route: "/trace-concentrations",
    },
    {
      title: "Formalidad",
      description: "Calculá concentración formal en mol de fórmula por litro.",
      icon: "layers-outline",
      route: "/formality",
    },
    {
      title: "Diluciones",
      description: "Calculá diluciones de una solución madre.",
      icon: "swap-vertical-outline",
      route: "/dilutions",
    },
    {
      title: "Reactivo comercial",
      description: "Calculá preparaciones a partir de porcentaje y densidad.",
      icon: "beaker-outline",
      route: "/commercial-reagent",
    },
    {
      title: "Conversiones",
      description: "Convertí entre distintas formas de concentración.",
      icon: "swap-horizontal-outline",
      route: "/concentration-conversions",
    },
  ] as const;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.mark, { backgroundColor: colors.accentSoft }]}>
            <Ionicons
              name="calculator"
              size={25}
              color={colors.accent}
            />
          </View>

          <ThemedText style={[styles.title, { color: colors.text }]}>
            Calculadora química
          </ThemedText>

          <ThemedText style={[styles.intro, { color: colors.muted }]}>
            Elegí qué cálculo querés realizar.
          </ThemedText>
        </View>

        <View style={styles.list}>
          {tools.map((tool) => (
            <Pressable
              key={tool.title}
              accessibilityRole="button"
              accessibilityLabel={tool.title}
              onPress={() => router.push(tool.route)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.accentSoft },
                ]}
              >
                <Ionicons
                  name={tool.icon}
                  size={22}
                  color={colors.accent}
                />
              </View>

              <View style={styles.copy}>
                <ThemedText
                  style={[styles.cardTitle, { color: colors.text }]}
                >
                  {tool.title}
                </ThemedText>

                <ThemedText
                  style={[styles.cardDescription, { color: colors.muted }]}
                >
                  {tool.description}
                </ThemedText>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.accent}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    marginBottom: 8,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: 10,
  },
  card: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  iconBox: {
    alignItems: "center",
    borderRadius: 10,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
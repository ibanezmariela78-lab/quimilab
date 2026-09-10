import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
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

  const actions = [
    {
      title: "PREPARACIÓN DE LABORATORIO",
      description:
        "Soluciones, mezclas, sólidos, líquidos y preparaciones guiadas paso a paso.",
      icon: "flask-outline" as const,
      route: "/preparacion-laboratorio" as const,
    },
    {
      title: "CALCULADORA QUÍMICA",
      description:
        "Molaridad, molalidad, normalidad, porcentajes, fracción molar, ppm, ppb y más.",
      icon: "calculator-outline" as const,
      route: "/calculadora-quimica" as const,
    },
    {
      title: "TABLA PERIÓDICA",
      description: "Elementos, símbolos, números atómicos y masas atómicas.",
      icon: "grid-outline" as const,
      route: "/tabla-periodica" as const,
    },
    {
      title: "SUSTANCIAS Y MATERIALES",
      description:
        "Fórmulas, propiedades, comportamiento y elementos de laboratorio.",
      icon: "water-outline" as const,
      route: "/sustancias-materiales" as const,
    },
  ];

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
            <Ionicons name="flask" size={25} color={colors.accent} />
          </View>
          <ThemedText style={[styles.eyebrow, { color: colors.accent }]}>
            QUIMICA Y LABORATORIO
          </ThemedText>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            QuimiLab EDU
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
            Química y laboratorio, paso a paso
          </ThemedText>
          <ThemedText style={[styles.intro, { color: colors.muted }]}>
            Calculá, comprendé y realizá preparaciones de laboratorio con
            explicaciones claras, materiales adecuados y procedimientos guiados.
          </ThemedText>
        </View>

        <View style={styles.actionsGrid}>
          {actions.map((action) => (
            <Pressable
              key={action.title}
              accessibilityRole="button"
              accessibilityLabel={action.title}
              onPress={() => router.push(action.route)}
              style={({ pressed }) => [
                styles.action,
                {
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[styles.iconBox, { backgroundColor: colors.accentSoft }]}
              >
                <Ionicons name={action.icon} size={24} color={colors.accent} />
              </View>
              <ThemedText style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </ThemedText>
              <ThemedText
                style={[styles.actionDescription, { color: colors.muted }]}
              >
                {action.description}
              </ThemedText>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.accent}
                style={styles.arrow}
              />
            </Pressable>
          ))}
        </View>

        <View style={[styles.learningNote, { borderColor: colors.border }]}>
          <Ionicons name="sparkles-outline" size={19} color={colors.accent} />
          <View style={styles.noteCopy}>
            <ThemedText style={[styles.noteText, { color: colors.text }]}>
              Aprender haciendo
            </ThemedText>
            <ThemedText
              style={[styles.noteDescription, { color: colors.muted }]}
            >
              QuimiLab acompaña al estudiante desde el cálculo hasta la
              experiencia de laboratorio.
            </ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.footer, { color: colors.muted }]}>
          Proyecto educativo{`\n`}Autora: Mariela Ibañez
        </ThemedText>
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
    paddingBottom: 28,
  },
  header: {
    marginBottom: 24,
  },
  mark: {
    alignItems: "center",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginBottom: 20,
    width: 52,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 14,
  },
  intro: {
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 500,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  action: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 188,
    padding: 16,
    width: "48%",
  },
  iconBox: {
    alignItems: "center",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    marginBottom: 14,
    width: 42,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 7,
  },
  actionDescription: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    bottom: 15,
    position: "absolute",
    right: 15,
  },
  learningNote: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    padding: 15,
  },
  noteCopy: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  noteDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  footer: {
    fontSize: 12,
    marginTop: 24,
    textAlign: "center",
  },
});

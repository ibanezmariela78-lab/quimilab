import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

type Report = {
  nombre: string;
  curso: string;
  integrantes: string;
  titulo: string;
  objetivo: string;
  fundamentacion: string;
  resultadoExperimental: string;
  observaciones: string;
  conclusion: string;
};

const initial: Report = {
  nombre: "",
  curso: "",
  integrantes: "",
  titulo : "",
  objetivo: "",
  fundamentacion: "",
  resultadoExperimental: "",
  observaciones: "",
  conclusion: "",
};

export default function InformeFinalScreen() {
  const [report, setReport] = useState<Report>(initial);

  function set<K extends keyof Report>(key: K, value: Report[K]) {
    setReport((current) => ({ ...current, [key]: value }));
  }

  async function guardar() {
    await AsyncStorage.setItem("quimilab:informe-final", JSON.stringify(report));
    Alert.alert("Borrador guardado", "El informe quedó guardado en este dispositivo.");
  }

  async function generarPdf() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;color:#17343A;padding:28px;line-height:1.5}
      h1{color:#087F73}h2{margin-top:22px;border-bottom:1px solid #ddd;padding-bottom:5px}
      .dato{margin:5px 0}.label{font-weight:700}
    </style></head><body>
      <h1>Informe de experiencia de laboratorio</h1>
      <div class="dato"><span class="label">Nombre:</span> ${e(report.nombre)}</div>
      <div class="dato"><span class="label">Curso:</span> ${e(report.curso)}</div>
      <div class="dato"><span class="label">Integrantes:</span> ${e(report.integrantes || "Trabajo individual")}</div>
      <div class="dato"><span class="label">Título*</span> ${e(report.titulo)}</div>
      <h2>Objetivo</h2><p>${e(report.objetivo)}</p>
      <h2>Fundamentación</h2><p>${e(report.fundamentacion)}</p>
      <h2>Resultado experimental</h2><p>${e(report.resultadoExperimental)}</p>
      <h2>Observaciones</h2><p>${e(report.observaciones)}</p>
      <h2>Conclusión</h2><p>${e(report.conclusion)}</p>
      <h2>Datos automáticos de QuimiLab</h2>
      <p>En el próximo paso se vincularán aquí las sustancias, cálculos, materiales, procedimiento, resultado teórico y seguridad de la última preparación.</p>
      <hr><p style="font-size:11px;color:#5A7375">Informe generado con QuimiLab EDU.</p>
    </body></html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
      } else {
        Alert.alert("PDF generado", "El dispositivo no permite compartirlo desde la app.");
      }
    } catch {
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText style={styles.title}>Informe Final de Laboratorio</ThemedText>
        <ThemedText style={styles.intro}>Completá el informe para entregarlo al profesor. QuimiLab incorporará automáticamente los datos de la preparación en el próximo paso.</ThemedText>

        <Section title="Datos del trabajo">
          <Field label="Nombre y Apellido" value={report.nombre} onChangeText={(v) => set("nombre", v)} />
          <Field label="Curso" value={report.curso} onChangeText={(v) => set("curso", v)} />
          <Field label="Integrantes del grupo" value={report.integrantes} onChangeText={(v) => set("integrantes", v)} placeholder="Dejalo vacío si el trabajo es individual" />
          <Field label="Título de la experiencia" value={report.titulo} onChangeText={(v) => set("titulo", v)} />
        </Section>

        <Section title="Desarrollo">
          <Field label="Objetivo" value={report.objetivo} onChangeText={(v) => set("objetivo", v)} multiline />
          <Field label="Fundamentación" value={report.fundamentacion} onChangeText={(v) => set("fundamentacion", v)} multiline placeholder="Explicá por qué se realizó la experiencia y qué conceptos químicos intervienen." />
        </Section>

        <Section title="Resultados y Cierre">
          <Field label="Resultado experimental obtenido" value={report.resultadoExperimental} onChangeText={(v) => set("resultadoExperimental", v)} multiline />
          <Field label="Observaciones" value={report.observaciones} onChangeText={(v) => set("observaciones", v)} multiline placeholder="Color, aspecto, fases, precipitado, temperatura, dificultades u otros cambios." />
          <Field label="Conclusión" value={report.conclusion} onChangeText={(v) => set("conclusion", v)} multiline />
        </Section>

        <View style={styles.autoBox}>
          <ThemedText style={styles.autoTitle}>Datos automáticos de QuimiLab</ThemedText>
          <ThemedText style={styles.autoText}>
            Sustancias, cálculos, materiales, procedimiento, resultado teórico y seguridad se vincularán automáticamente desde Preparación de laboratorio.
          </ThemedText>
        </View>

        <Pressable onPress={guardar} style={styles.secondary}>
          <ThemedText style={styles.secondaryText}>GUARDAR BORRADOR</ThemedText>
        </Pressable>
        <Pressable onPress={generarPdf} style={styles.primary}>
          <ThemedText style={styles.primaryText}>GENERAR Y COMPARTIR PDF</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#718487"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

function e(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br>");
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F8F7" },
  content: { padding: 20, paddingBottom: 44 },
  title: { color: "#17343A", fontSize: 31, fontWeight: "800", marginBottom: 8 },
  intro: { color: "#5A7375", fontSize: 16, lineHeight: 23, marginBottom: 20 },
  section: { backgroundColor: "#FFFFFF", borderColor: "#D6E5E0", borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 16 },
  sectionTitle: { color: "#17343A", fontSize: 19, fontWeight: "800", marginBottom: 14 },
  field: { marginBottom: 14 },
  label: { color: "#17343A", fontSize: 14, fontWeight: "700", marginBottom: 7 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#D6E5E0", borderRadius: 11, borderWidth: 1, color: "#17343A", fontSize: 16, minHeight: 48, paddingHorizontal: 13, paddingVertical: 11 },
  multiline: { minHeight: 96 },
  autoBox: { backgroundColor: "#DDF2EC", borderRadius: 14, marginBottom: 16, padding: 15 },
  autoTitle: { color: "#087F73", fontSize: 16, fontWeight: "800", marginBottom: 6 },
  autoText: { color: "#17343A", lineHeight: 21 },
  secondary: { alignItems: "center", borderColor: "#087F73", borderRadius: 12, borderWidth: 1, marginBottom: 10, paddingVertical: 14 },
  secondaryText: { color: "#087F73", fontWeight: "800" },
  primary: { alignItems: "center", backgroundColor: "#087F73", borderRadius: 12, paddingVertical: 15 },
  primaryText: { color: "#FFFFFF", fontWeight: "800" },
});

import { router, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SustanciasMaterialesScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sustancias y materiales",
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sustancias y materiales</Text>

          <Text style={styles.subtitle}>
            Consultá información química de las sustancias y conocé los
            instrumentos utilizados en el laboratorio.
          </Text>
        </View>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/substances")}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>⚗️</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Sustancias</Text>

            <Text style={styles.cardDescription}>
              Fórmulas, propiedades, solubilidad, comportamiento frente a la
              temperatura y observaciones de seguridad.
            </Text>

            <Text style={styles.linkText}>Consultar sustancias →</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/materiales")}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🧪</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Materiales de laboratorio</Text>

            <Text style={styles.cardDescription}>
              Conocé para qué sirve cada instrumento, cuándo utilizarlo y qué
              nivel de precisión ofrece.
            </Text>

            <Text style={styles.linkText}>Ver materiales →</Text>
          </View>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Por qué están relacionados?</Text>

          <Text style={styles.infoText}>
            Una preparación de laboratorio no depende solamente del cálculo.
            También importa qué sustancia se utiliza, su estado físico, sus
            propiedades y qué material es adecuado para trabajar con ella.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f8",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: "#617a7b",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d5e4e2",
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#daf1ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  icon: {
    fontSize: 28,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 7,
  },

  cardDescription: {
    color: "#617a7b",
    fontSize: 16,
    lineHeight: 24,
  },

  linkText: {
    color: "#0d887d",
    fontWeight: "800",
    marginTop: 12,
    fontSize: 15,
  },

  infoBox: {
    backgroundColor: "#e0f4f0",
    borderRadius: 18,
    padding: 20,
    marginTop: 12,
  },

  infoTitle: {
    color: "#173b40",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 8,
  },

  infoText: {
    color: "#4f696b",
    fontSize: 16,
    lineHeight: 25,
  },
});

import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { labEquipment, LabEquipment } from "../data/labEquipment";

export default function MaterialesScreen() {
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<LabEquipment | null>(null);

  const materialesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return labEquipment;
    }

    return labEquipment.filter((material) => {
      const contenido = [
        material.nombre,
        material.categoria,
        material.descripcion,
        ...material.usos,
      ]
        .join(" ")
        .toLowerCase();

      return contenido.includes(texto);
    });
  }, [busqueda]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Materiales",
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.intro}>
          <Text style={styles.title}>Materiales de laboratorio</Text>

          <Text style={styles.subtitle}>
            Conocé los instrumentos utilizados en el laboratorio, para qué
            sirven y cuándo conviene utilizar cada uno.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar material o categoría"
          placeholderTextColor="#6f8584"
        />

        <Text style={styles.resultCount}>
          {materialesFiltrados.length}{" "}
          {materialesFiltrados.length === 1
            ? "material encontrado"
            : "materiales encontrados"}
        </Text>

        {seleccionado && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={styles.detailTitleContainer}>
                <Text style={styles.label}>MATERIAL</Text>
                <Text style={styles.detailTitle}>{seleccionado.nombre}</Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setSeleccionado(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>CATEGORÍA</Text>
            <Text style={styles.text}>{seleccionado.categoria}</Text>

            <Text style={styles.label}>¿PARA QUÉ SIRVE?</Text>
            <Text style={styles.text}>{seleccionado.descripcion}</Text>

            <Text style={styles.label}>¿CUÁNDO SE UTILIZA?</Text>
            {seleccionado.usos.map((uso) => (
              <Text key={uso} style={styles.listItem}>
                • {uso}
              </Text>
            ))}

            <Text style={styles.label}>¿CUÁNDO NO CONVIENE UTILIZARLO?</Text>
            {seleccionado.noRecomendadoPara.map((uso) => (
              <Text key={uso} style={styles.listItem}>
                • {uso}
              </Text>
            ))}

            <Text style={styles.label}>PRECISIÓN</Text>
            <Text style={styles.text}>{seleccionado.precision === "No aplica" ? "No corresponde: no es un instrumento de medición" : seleccionado.precision}</Text>

            {seleccionado.estadosFisicos.length > 0 && (
              <>
                <Text style={styles.label}>ESTADOS FÍSICOS</Text>
                <Text style={styles.text}>
                  {seleccionado.estadosFisicos.join(", ")}
                </Text>
              </>
            )}

            <Text style={styles.label}>EJEMPLO</Text>
            <Text style={styles.text}>{seleccionado.ejemplo}</Text>

            <View style={styles.whyBox}>
              <Text style={styles.whyTitle}>¿Por qué usar este material?</Text>
              <Text style={styles.whyText}>{seleccionado.porqueUsarlo}</Text>
            </View>

            {seleccionado.seguridad && (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Seguridad</Text>
                <Text style={styles.warningText}>{seleccionado.seguridad}</Text>
              </View>
            )}

            {seleccionado.requiereSupervision && (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>
                  Requiere supervisión docente
                </Text>
                <Text style={styles.warningText}>
                  Este material debe utilizarse siguiendo las normas de
                  seguridad del laboratorio y bajo supervisión cuando
                  corresponda.
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Biblioteca de materiales</Text>

        {materialesFiltrados.map((material) => (
          <Pressable
            key={material.id}
            style={styles.card}
            onPress={() => setSeleccionado(material)}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{material.nombre}</Text>

              <View style={styles.precisionBadge}>
                <Text style={styles.precisionText}>{material.precision === "No aplica" ? "No corresponde" : material.precision}</Text>
              </View>
            </View>

            <Text style={styles.category}>{material.categoria}</Text>

            <Text style={styles.description}>{material.descripcion}</Text>

            <Text style={styles.openText}>Ver ficha completa →</Text>
          </Pressable>
        ))}

        {materialesFiltrados.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No encontramos ese material</Text>
            <Text style={styles.emptyText}>
              Probá buscando por nombre, categoría o función. Por ejemplo:
              matraz, balanza, volumen o mezclar.
            </Text>
          </View>
        )}
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

  intro: {
    marginBottom: 24,
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

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cddfdd",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    color: "#173b40",
  },

  resultCount: {
    marginTop: 10,
    marginBottom: 22,
    color: "#617a7b",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#173b40",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d5e4e2",
    padding: 20,
    marginBottom: 16,
  },

  cardTop: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#173b40",
  },

  precisionBadge: {
    backgroundColor: "#daf1ed",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  precisionText: {
    color: "#0d887d",
    fontWeight: "700",
    fontSize: 12,
  },

  category: {
    color: "#0d887d",
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 10,
  },

  description: {
    color: "#617a7b",
    fontSize: 16,
    lineHeight: 24,
  },

  openText: {
    marginTop: 15,
    color: "#0d887d",
    fontWeight: "800",
  },

  detailCard: {
    backgroundColor: "#e0f4f0",
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
  },

  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  detailTitleContainer: {
    flex: 1,
    marginRight: 10,
  },

  detailTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#173b40",
  },

  closeButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  closeButtonText: {
    color: "#0d887d",
    fontWeight: "700",
  },

  label: {
    color: "#0d887d",
    fontWeight: "800",
    fontSize: 14,
    marginTop: 18,
    marginBottom: 7,
  },

  text: {
    color: "#27484c",
    fontSize: 17,
    lineHeight: 25,
  },

  listItem: {
    color: "#27484c",
    fontSize: 17,
    lineHeight: 27,
  },

  whyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 17,
    marginTop: 22,
  },

  whyTitle: {
    color: "#173b40",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 7,
  },

  whyText: {
    color: "#4f696b",
    fontSize: 16,
    lineHeight: 24,
  },

  warningBox: {
    backgroundColor: "#fff7e7",
    borderRadius: 16,
    padding: 17,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2bd6d",
  },

  warningTitle: {
    color: "#875d0a",
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 6,
  },

  warningText: {
    color: "#6c562b",
    fontSize: 16,
    lineHeight: 24,
  },

  emptyBox: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 18,
  },

  emptyTitle: {
    color: "#173b40",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    color: "#617a7b",
    fontSize: 16,
    lineHeight: 24,
  },
});

import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explorar
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Esta aplicación incluye código de ejemplo para ayudarte a comenzar.
      </ThemedText>
      <Collapsible title="Navegación basada en archivos">
        <ThemedText>
          Esta aplicación tiene dos pantallas:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> y{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          El archivo de diseño{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          configura el navegador de pestañas.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Saber más</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Compatibilidad con Android, iOS y web">
        <ThemedText>
          Podés abrir este proyecto en Android, iOS y la web. Para abrir la
          versión web, presioná{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> en la terminal donde
          se ejecuta este proyecto.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Imágenes">
        <ThemedText>
          Para imágenes estáticas, podés usar los sufijos{" "}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> y{" "}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> para ofrecer
          archivos con diferentes densidades de pantalla.
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Saber más</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Componentes para modo claro y oscuro">
        <ThemedText>
          Esta plantilla admite modo claro y oscuro. El hook{" "}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText>{" "}
          permite consultar el esquema de colores actual y adaptar la interfaz.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Saber más</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animaciones">
        <ThemedText>
          Esta plantilla incluye un componente animado de ejemplo. El componente{" "}
          <ThemedText type="defaultSemiBold">
            components/HelloWave.tsx
          </ThemedText>{" "}
          usa la potente{" "}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{" "}
          biblioteca para crear una animación de mano saludando.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              El componente{" "}
              <ThemedText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </ThemedText>{" "}
              proporciona un efecto de paralaje para la imagen de encabezado.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

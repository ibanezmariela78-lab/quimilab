import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen name="molar-mass" options={{ title: "Masa molar" }} />
        <Stack.Screen name="molarity" options={{ title: "Molaridad" }} />
        <Stack.Screen name="molality" options={{ title: "Molalidad" }} />
        <Stack.Screen name="percentages" options={{ title: "Porcentajes" }} />
        <Stack.Screen name="normality" options={{ title: "Normalidad" }} />
        <Stack.Screen
          name="mole-fraction"
          options={{ title: "Fracción molar" }}
        />
        <Stack.Screen
          name="trace-concentrations"
          options={{ title: "ppm y ppb" }}
        />
        <Stack.Screen name="formality" options={{ title: "Formalidad" }} />
        <Stack.Screen name="dilutions" options={{ title: "Diluciones" }} />
        <Stack.Screen
          name="commercial-reagent"
          options={{ title: "Reactivo comercial" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

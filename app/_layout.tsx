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
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

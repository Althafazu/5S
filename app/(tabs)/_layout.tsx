import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useColorScheme } from "react-native";
import "react-native-reanimated";

export default function TabsLayout() {
//   const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="seiri" options={{ headerShown: false }} />
          <Stack.Screen name="seiton" options={{ headerShown: false }} />
          <Stack.Screen name="seiso" options={{ headerShown: false }} />
          <Stack.Screen name="seiketsu" options={{ headerShown: false }} />
          <Stack.Screen name="shitsuke" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    // </ThemeProvider>
  );
}
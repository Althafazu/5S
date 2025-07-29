import { Stack, Link } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Link href={"/"} style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, color: "blue" }}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{ 
                headerShown: false,
            }}>
            <Tabs.Screen name='login' options={{ title: 'Login' }}/>
        </Tabs>
    )
}

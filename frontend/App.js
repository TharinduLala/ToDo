import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { NavigationContainer,DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ToDoDashboard from "./src/screens/ToDoDashboard";
import AddEditTodoScreen from "./src/screens/AddEditTodoScreen";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Dashboard'>
          <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name='Register'
            component={RegisterScreen}
          />
          <Stack.Screen
            name='Dashboard'
            component={ToDoDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AddEditTodo'
            component={AddEditTodoScreen}
            options={{ title: "Back to List" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

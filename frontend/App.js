import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ToDoDashboard from "./src/screens/ToDoDashboard";
import AddEditTodoScreen from "./src/screens/AddEditTodoScreen";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createNativeStackNavigator();
export default function App({ navigation }) {
  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen
          name='Dashboard'
          component={ToDoDashboard}
          options={{
            headerShown: true,
            title: "Tasks Dashboard",
            headerRight: () =><LogoutButton/>,
          }}
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

function LogoutButton() {
  const navigation = useNavigation();
  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <IconButton
      icon='logout'
      size={30}
      onPress={() => logout(navigation)} // Pass navigation to logout
    />
  );
}

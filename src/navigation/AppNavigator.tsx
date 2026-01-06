import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import React from "react";
import { navigationRef } from "./NavigationService";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen, LoginScreen, SignupScreen, Splash } from "../screens";
import SplashScreen from 'react-native-splash-screen';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'#007AFF'}
      />

      <NavigationContainer
      onReady={() => SplashScreen.hide()}
      fallback={<Splash />}
      ref={navigationRef}
      >
        {isAuthenticated ? (
          <MainNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </View>
  );
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export type MainStackParamList = {
  Home: undefined;
};

const StackNavigator = createStackNavigator<MainStackParamList>();
export const MainNavigator: React.FC = () => {
  return (
    <StackNavigator.Navigator>
      <StackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Welcome",
        }}
      />
    </StackNavigator.Navigator>
  );
};


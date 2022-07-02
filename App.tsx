import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { ContactList } from "./screens/ContactList";
import * as ScreenOrientation from "expo-screen-orientation";
import { ContactEdit } from "./screens/ContactEdit";
import { Timers } from "./screens/Timers";
import {
  Provider,
  DefaultTheme,
  DarkTheme,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Login } from "./screens/Login";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "react-query";
import axios from "axios";
import { getLogOutMutation, getUser, useGetUser } from "./api/api";
import { UserSettings } from "./screens/UserSettings";
export const queryClient = new QueryClient();

ScreenOrientation.getPlatformOrientationLockAsync().then((orientation) => {
  if (!orientation.screenOrientationLockWeb) {
    ScreenOrientation.unlockAsync();
  }
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function TimersScreen() {
  return <Timers></Timers>;
}

function SettingsTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="UserSettings" component={UserSettings} />
      <TopTab.Screen name="ServerSettings" component={Profile} />
    </TopTab.Navigator>
  );
}

function Profile() {
  const logOutMutation = getLogOutMutation();

  return (
    <View>
      <Button onPress={() => logOutMutation.mutate()}>Test</Button>
    </View>
  );
}


function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Timers"
        component={TimersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsTabs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {},
  },
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3F51B5',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3'
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider theme={theme}>
        <NavigationContainer linking={{ enabled: true, prefixes: [] }}>
          <AuthGuard></AuthGuard>
          <StatusBar style="auto" />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}

function AuthGuard() {
  const { status, data, error, isSuccess, isLoading, isError } = useGetUser();

  return (
    <Stack.Navigator>
      {isSuccess && data ? (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ContactEdit" component={ContactEdit} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

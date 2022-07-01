import { NavigationContainer } from "@react-navigation/native";
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
} from "react-native-paper";
import { Login } from "./screens/Login";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getUser } from "./api/api";
export const queryClient = new QueryClient();

ScreenOrientation.getPlatformOrientationLockAsync().then((orientation) => {
  if (!orientation.screenOrientationLockWeb) {
    ScreenOrientation.unlockAsync();
  }
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function Feed() {
  return <Timers></Timers>;
}

function Messages() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Home" component={Profile} />
      <TopTab.Screen name="Settings" component={Settings} />
    </TopTab.Navigator>
  );
}

function Profile() {
  return (
    <View>
      <Text>Test3</Text>
    </View>
  );
}

function Settings({ navigation }: { navigation: any }) {
  return (
    <View>
      <Button
        title="Test button"
        onPress={() => navigation.navigate("TestScreen")}
      />
    </View>
  );
}

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={Feed}
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
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const TestScreen = () => {
  return (
    <View>
      <Link to={{ screen: "TestScreena", params: { id: "jane" } }}>
        Go to Jane's profile
      </Link>
    </View>
  );
};

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {},
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
          <Provider theme={DefaultTheme}>
            <NavigationContainer linking={{ enabled: true, prefixes: [] }}>
              <AuthGuard></AuthGuard>
              <StatusBar style="auto" />
            </NavigationContainer>
          </Provider>
    </QueryClientProvider>
  );
}

function AuthGuard() {
  const queryClient = useQueryClient();
  const { status, data, error, isSuccess } = useQuery("user", getUser)
  return (
    <Stack.Navigator>
      {!isSuccess ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="ContactEdit" component={ContactEdit} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

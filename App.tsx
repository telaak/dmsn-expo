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
import { AuthContext, AuthProvider, Login } from "./screens/Login";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
export const queryClient = new QueryClient();

ScreenOrientation.getPlatformOrientationLockAsync().then((orientation) => {
  if (!orientation.screenOrientationLockWeb) {
    ScreenOrientation.unlockAsync();
  }
});

const contacts = [
  {
    name: "Test Name",
    phoneNumber: "05120519512",
    email: "test@test.com",
    emailEnabled: true,
    smsEnabled: false,
    messages: [
      {
        content: "Test content",
        duration: 1000 * 60 * 60 * 24,
      },
      {
        content: "Test content 2",
        duration: 1000 * 60 * 60 * 24 * 2,
      },
    ],
  },
  {
    name: "Test Name 2",
    phoneNumber: "05120519512",
    email: "test@test.com",
    emailEnabled: true,
    smsEnabled: true,
    messages: [
      {
        content: "Test content 3",
        duration: 1000 * 60 * 60 * 24,
      },
      {
        content: "Test content 4",
        duration: 1000 * 60 * 60 * 24 * 7 * 6,
      },
    ],
  },
];

export interface IContact {
  name: string;
  phoneNumber: string;
  email: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  messages: IMessage[];
}

export interface ITimerMessage extends IMessage {
  recipient: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

export interface IMessage {
  content: string;
  duration: number;
}

export const ContactContext = React.createContext(contacts);

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
      <ContactContext.Provider value={contacts}>
        <AuthProvider>
          <Provider theme={DefaultTheme}>
            <NavigationContainer linking={{ enabled: true, prefixes: [] }}>
              <AuthGuard></AuthGuard>
              <StatusBar style="auto" />
            </NavigationContainer>
          </Provider>
        </AuthProvider>
      </ContactContext.Provider>
    </QueryClientProvider>
  );
}

function AuthGuard() {
  const { state } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      {state.userToken == null ? (
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

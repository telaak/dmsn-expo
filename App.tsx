import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
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
import { Provider, DefaultTheme } from "react-native-paper";

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

export const ContactContext = React.createContext(contacts);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function Feed() {
  return (
    <View>
      <Timers></Timers>
    </View>
  );
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

function Profile2() {
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
}

function Settings({ navigation }) {
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
  prefixes: [],
  config: {
    screens: {
      Home: "/Home",
    },
  },
};

export default function App() {
  return (
    <ContactContext.Provider value={contacts}>
      <Provider theme={DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="TestScreen" component={TestScreen} />
            <Stack.Screen
              name="ContactEdit"
              options={({ route }) => ({ title: route.params.data.name })}
              component={ContactEdit}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </Provider>
    </ContactContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

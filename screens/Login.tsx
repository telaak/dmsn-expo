const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import * as LocalAuthentication from "expo-local-authentication";

//SecureStore.setItemAsync("username", "teemu");
//SecureStore.setItemAsync("password", "seppo");

import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

export function Login({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getCredentials = async () => {
    const [username, password] = await Promise.all([
        SecureStore.getItemAsync("username"),
        SecureStore.getItemAsync("password"),
      ]);
    return [username, password]
  }

  const loginFn = async () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    SecureStore.isAvailableAsync().then(async (isAvailable) => {
      if (isAvailable) {
        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          loginFn();
        }
      }
    });
  });

  return (
    <View style={styles.container}>
      <View style={{ height: 200, width: 200 }}>
        <TextInput mode="outlined" label="Username" value={username} />
        <TextInput
          mode="outlined"
          secureTextEntry
          label="Password"
          right={<TextInput.Icon name="eye" />}
          value={password}
        />
        <Button icon="login" mode="contained" onPress={() => loginFn()}>
          Login
        </Button>
      </View>
    </View>
  );
}

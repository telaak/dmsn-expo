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

//SecureStore.setItemAsync("username", "Test");
//SecureStore.setItemAsync("password", "Kys");

import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { login } from "../api/api";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation(login, {
    onSuccess: (data: any) => {
      queryClient.setQueryData(["user"], data.data);
    },
  });

  const getCredentials = async () => {
    const [username, password] = await Promise.all([
      SecureStore.getItemAsync("username"),
      SecureStore.getItemAsync("password"),
    ]);
    return [username, password];
  };

  const loginFn = async () => {
    const loginResult = await mutation.mutateAsync({ username, password });
  };

  const fingerPrintLogin = useEffect(() => {
    SecureStore.isAvailableAsync().then(async (isAvailable) => {
      if (isAvailable) {
        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          const [username, password] = await getCredentials();
          await mutation.mutateAsync({ username, password });
        }
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ height: 200, width: 200 }}>
        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          mode="outlined"
          secureTextEntry
          label="Password"
          right={<TextInput.Icon name="eye" />}
          value={password}
          onChangeText={setPassword}
        />
        <Button icon="login" mode="contained" onPress={() => loginFn()}>
          Login
        </Button>
      </View>
    </View>
  );
}

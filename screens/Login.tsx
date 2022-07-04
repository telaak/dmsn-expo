const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";

//SecureStore.setItemAsync("username", "Test");
//SecureStore.setItemAsync("password", "Kys");

import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getLoginMutation, useGetUser } from "../api/api";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const mutation = getLoginMutation();

  const getCredentials = async () => {
    const [username, password] = await Promise.all([
      SecureStore.getItemAsync("username") as Promise<string>,
      SecureStore.getItemAsync("password") as Promise<string>,
    ]);
    return { username, password };
  };

  const { status, data, error, isSuccess, isLoading, isError } = useGetUser();

  const checkLogin = useEffect(() => {
    SecureStore.isAvailableAsync().then(async (isAvailable) => {
      if (isAvailable && !isSuccess && isError) {
        const localSettings = (await AsyncStorage.getItem(
          "localSettings"
        )) as string;
        try {
          const parsedLocalSettings = JSON.parse(localSettings);
          if (parsedLocalSettings.useFingerprint) {
            const result = await LocalAuthentication.authenticateAsync();
            if (result.success) {
              const { username, password } = await getCredentials();
              mutation.mutate({ username, password });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, [isError]);

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
        <Button
          icon="login"
          mode="contained"
          onPress={() => mutation.mutate({ username, password })}
        >
          Login
        </Button>
      </View>
    </View>
  );
}

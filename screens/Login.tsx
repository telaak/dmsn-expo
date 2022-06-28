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
import React, { createContext, useEffect, useReducer, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
          switch (action.type) {
            case 'RESTORE_TOKEN':
              return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
              };
            case 'SIGN_IN':
              return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
              };
            case 'SIGN_OUT':
              return {
                ...prevState,
                isSignout: true,
                userToken: null,
              };
          }
        },
        {
          isLoading: true,
          isSignout: false,
          userToken: null,
        }
      );
    
      React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
          let userToken;
    
          try {
            userToken = await SecureStore.getItemAsync('token');
          } catch (e) {
            // Restoring token failed
          }
    
          // After restoring token, we may need to validate it in production apps
    
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
    
        bootstrapAsync();
      }, []);
    
      const authContext = React.useMemo(
        () => ({
          signIn: async (data) => {
            // In a production app, we need to send some data (usually username, password) to server and get a token
            // We will also need to handle errors if sign in failed
            // After getting token, we need to persist the token using `SecureStore`
            // In the example, we'll use a dummy token
    
            dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
          },
          signOut: () => dispatch({ type: 'SIGN_OUT' }),
          signUp: async (data) => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `SecureStore`
            // In the example, we'll use a dummy token
    
            dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
          },
        }),
        []
      );

  return (
    <AuthContext.Provider value={{authContext, state, dispatch}}>{children}</AuthContext.Provider>
  );
};

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { authContext } = React.useContext(AuthContext);


  const getCredentials = async () => {
    const [username, password] = await Promise.all([
        SecureStore.getItemAsync("username"),
        SecureStore.getItemAsync("password"),
      ]);
    return [username, password]
  }

  const loginFn = async () => {
    authContext.signIn({username, password})
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

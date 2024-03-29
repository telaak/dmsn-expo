import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text } from "react-native";
import { ControlledTextField } from "../components/ControlledTextField";
import { ToggleChip } from "../components/ToggleChip";
import { StyleSheet } from "react-native";
import { MaterialListIcon } from "../components/MaterialListIcon";
import { Button, FAB, List } from "react-native-paper";
import { IContact, IUser } from "../api/api";
import { queryClient } from "../App";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const LocalSettings = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    register,
  } = useForm({});

  useEffect(() => {
    AsyncStorage.getItem("localSettings").then((localSettings) => {
      try {
        const parsedLocalSettings = JSON.parse(localSettings as string);
        reset(parsedLocalSettings);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <List.Subheader>Local</List.Subheader>
        <List.Item
          title={() => (
            <View style={styles.chipContainer}>
              <ToggleChip
                control={control}
                text="Send location with ping"
                name="sendLocation"
              />
            </View>
          )}
          left={() => <MaterialListIcon name="location-on" size={32} />}
        />
        <List.Item
          title={() => (
            <View style={styles.chipContainer}>
              <ToggleChip
                control={control}
                text="Fingerprint login"
                name="useFingerprint"
              />
            </View>
          )}
          left={() => <MaterialListIcon name="fingerprint" size={32} />}
        />
      </KeyboardAwareScrollView>
      <FAB
        icon={() => <MaterialIcons name="save" color="white" size={24} />}
        style={styles.fab}
        onPress={handleSubmit(async (valid) => {
          if (valid) {
            try {
              await AsyncStorage.setItem(
                "localSettings",
                JSON.stringify(valid)
              );
            } catch (e) {
              console.log(e);
            }
          }
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chip: { marginRight: 10, marginBottom: 10 },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3F51B5",
  },
});

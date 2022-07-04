import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text, ScrollView } from "react-native";
import { ControlledTextField } from "../components/ControlledTextField";
import { ToggleChip } from "../components/ToggleChip";
import { StyleSheet } from "react-native";
import { MaterialListIcon } from "../components/MaterialListIcon";
import { Button, FAB, List } from "react-native-paper";
import {
  getUpdateUserSettingsMutation,
  getUser,
  IContact,
  IUser,
} from "../api/api";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const UserSettings = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    register,
  } = useForm({});

  const navigation = useNavigation();

  const [snackbarMessage, setSnackBarMessage] = useState("Saved");

  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {});

  return <ExtraSettings />;
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useQuery } from "react-query";

const ExtraSettings = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    register,
  } = useForm({});

  const updateSettingsMutation = getUpdateUserSettingsMutation();

  const { status, data, error, isSuccess } = useQuery("user", getUser);

  useEffect(() => {
    if (isSuccess) {
      const settings = data.settings;
      reset(settings);
    }
  }, [isSuccess]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <List.Subheader>User</List.Subheader>
        <List.Item
          title={() => (
            <ControlledTextField
              required={false}
              control={control}
              label="Email"
              name="email"
              keyboardType="email-address"
            />
          )}
          left={() => <MaterialListIcon name="email" size={32} />}
        />
        <List.Item
          title={() => (
            <ControlledTextField
              required={false}
              control={control}
              label="Phone Nr."
              name="phoneNumber"
              keyboardType="phone-pad"
            />
          )}
          left={() => <MaterialListIcon name="phone" size={32} />}
        />
        <List.Subheader>Notifications</List.Subheader>
        <List.Item
          title={() => (
            <View style={styles.chipContainer}>
              <ToggleChip
                control={control}
                text="Push"
                name="enablePushNotifications"
              />
              <ToggleChip
                control={control}
                text="Email"
                name="enableEmailNotifications"
              />
              <ToggleChip
                control={control}
                text="SMS"
                name="enableSMSNotifications"
              />
            </View>
          )}
          left={() => <MaterialListIcon name="notifications" size={32} />}
        />
        <List.Item
          title={() => (
            <View style={styles.chipContainer}>
              <ToggleChip
                control={control}
                text="Enable DMS"
                name="enableDMS"
              />
            </View>
          )}
          left={() => <MaterialListIcon name="settings" size={32} />}
        />
      </KeyboardAwareScrollView>
      <FAB
        icon={() => <MaterialIcons name="save" color="white" size={24} />}
        style={styles.fab}
        onPress={handleSubmit(async (valid) => {
          if (valid) {
            try {
              (await updateSettingsMutation).mutate(valid);
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

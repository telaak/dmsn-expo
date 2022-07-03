import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text } from "react-native";
import { ControlledTextField } from "../components/ControlledTextField";
import { ToggleChip } from "../components/ToggleChip";
import { StyleSheet } from "react-native";
import { MaterialListIcon } from "../components/MaterialListIcon";
import { Button, List } from "react-native-paper";
import { getUpdateUserSettingsMutation, getUser, IContact, IUser } from "../api/api";
import { queryClient } from "../App";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

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

  return (
    <KeyboardAwareScrollView>
      <ExtraSettings />
    </KeyboardAwareScrollView>
  );
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
        const settings = data.settings
        reset(settings)
    }
  }, [isSuccess])

  return (
    <View>
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
            <Button
              icon={() => <MaterialIcons name="save" size={24} color="white" />}
              mode="contained"
              onPress={handleSubmit(async (valid) => {
                if (valid) {
                  try {
                    (await updateSettingsMutation).mutate(valid);
                  } catch (e) {
                    console.log(e);
                  }
                }
              })}
            >
              Save
            </Button>
          </View>
        )}
        left={() => <MaterialListIcon name="settings" size={32} />}
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
});

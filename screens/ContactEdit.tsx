import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  Checkbox,
  TextInput,
  Text,
  Chip,
  Snackbar,
  Button,
} from "react-native-paper";
import { List } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  FieldValues,
} from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "react-query";
import {
  getCreateContactMutation,
  getUser,
  IContact,
  IUser,
  login,
  updateContact,
  useGetUser,
} from "../api/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import { KeyboardTypeOptions } from "react-native";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";

export function ContactEdit() {
  const route = useRoute();
  const navigation = useNavigation();
  const mount = useEffect(() => {
    if (isSuccess) {
      if (!route.params?.new) {
        const contact = data.contacts.find(
          (c) => c._id === route.params?.id
        ) as IContact;
        reset(contact);
        update();
        navigation.setOptions({
          headerRight: () => (
            <MaterialIcons
              size={32}
              name="save"
              onPress={handleSubmit(
                (valid) => {
                  mutation.mutate(valid, {
                    onSuccess: (response: IUser) => {
                      setSnackBarMessage("Saved succesfully");
                      onToggleSnackBar();
                      queryClient.setQueryData(["user"], response);
                      const updatedContact = response.contacts.find(
                        (c) => c._id === contact._id
                      );
                      navigation.setOptions({
                        title: updatedContact?.name,
                      });
                    },
                    onError: (err: any) => {
                      setSnackBarMessage("Saving failed");
                      onToggleSnackBar();
                    },
                  });
                },
                (invalid) => {
                  setSnackBarMessage("Invalid values (somehow)");
                  onToggleSnackBar();
                }
              )}
            />
          ),
          title: contact.name,
        });
      } else if (route.params?.new) {
        navigation.setOptions({
          headerRight: () => (
            <MaterialIcons
              size={32}
              name="save"
              onPress={handleSubmit(
                (valid) => {
                  newContactMutation.mutate(valid as IContact, {
                    onSuccess: (response: IUser) => {
                      setSnackBarMessage("Saved succesfully");
                      onToggleSnackBar();
                      queryClient.setQueryData(["user"], response);
                    },
                    onError: (err: any) => {
                      setSnackBarMessage("Saving failed");
                      onToggleSnackBar();
                    },
                  });
                },
                (invalid) => {
                  setSnackBarMessage("Invalid values (somehow)");
                  onToggleSnackBar();
                }
              )}
            />
          ),
          title: "New Contact",
        });
      }
    }
  }, [route.params]);

  const addMessage = () => {
    append({
      content: "",
      duration: {
        days: 3,
        hours: 0,
        minutes: 0,
      },
    });
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    register,
  } = useForm({});

  const [snackbarMessage, setSnackBarMessage] = useState("Saved");

  const queryClient = useQueryClient();

  const mutation = useMutation(updateContact);

  const newContactMutation = getCreateContactMutation();

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const { status, data, error, isSuccess } = useQuery("user", getUser);

  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "messages", // unique name for your Field Array
    });

  return isSuccess ? (
    <View style={{ flex: 1 }}>
      <Snackbar
        wrapperStyle={{ zIndex: 999999 }}
        visible={visible}
        onDismiss={onDismissSnackBar}
      >
        {snackbarMessage}
      </Snackbar>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollView>
          <List.Section>
            <List.Subheader>Contact Information</List.Subheader>
            <List.Item
              title={() => (
                <ControlledTextField
                  name="name"
                  control={control}
                  label="Name"
                  keyboardType="default"
                />
              )}
              left={() => <MaterialListIcon name="person" size={32} />}
            />
            <List.Item
              title={() => (
                <ControlledTextField
                  name="email"
                  control={control}
                  label="Email"
                  keyboardType="email-address"
                />
              )}
              left={() => <MaterialListIcon name="email" size={32} />}
            />
            <List.Item
              title={() => (
                <ControlledTextField
                  name="phoneNumber"
                  control={control}
                  label="Phone Nr."
                  keyboardType="phone-pad"
                />
              )}
              left={() => <MaterialListIcon name="phone" size={32} />}
            />
            <List.Item
              title={() => (
                <View style={styles.chipContainer}>
                  <ToggleChip
                    control={control}
                    name="smsEnabled"
                    text="Send SMS"
                  />
                  <ToggleChip
                    control={control}
                    name="emailEnabled"
                    text="Send Email"
                  />

                  <ToggleChip
                    control={control}
                    name="sendLocation"
                    text="Send Location"
                  />
                </View>
              )}
              left={() => <MaterialListIcon name="settings" size={32} />}
            />

            {fields.map((field, index) => {
              return (
                <View key={field.id}>
                  <List.Subheader>{`Message #${index + 1}`}</List.Subheader>
                  <List.Item
                    title={() => (
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            mode="outlined"
                            label={`Content`}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            numberOfLines={5}
                            multiline={true}
                          />
                        )}
                        name={`messages.${index}.content`}
                      />
                    )}
                    left={() => <MaterialListIcon name="message" size={32} />}
                  ></List.Item>

                  <List.Item
                    title={() => (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {Object.entries(field?.duration).map(
                          ([durationKey, durationValue]) => {
                            return (
                              <Controller
                                key={`${durationKey}`}
                                control={control}
                                rules={{
                                  required: true,
                                }}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => {
                                  return (
                                    <TextInput
                                      style={{ minWidth: 65, marginRight: 10 }}
                                      mode="outlined"
                                      label={`${durationKey}`}
                                      onBlur={onBlur}
                                      onChangeText={onChange}
                                      value={value.toString()}
                                      keyboardType={"number-pad"}
                                    />
                                  );
                                }}
                                name={`messages.${index}.duration.${durationKey}`}
                              />
                            );
                          }
                        )}
                      </View>
                    )}
                    left={() => <MaterialListIcon name="schedule" size={32} />}
                  ></List.Item>
                  <List.Item
                    left={() => <MaterialListIcon name="delete" size={32} />}
                    title={() => (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Button
                          color="red"
                          mode="contained"
                          onPress={() => remove(index)}
                        >
                          Delete Message
                        </Button>
                      </View>
                    )}
                  ></List.Item>
                </View>
              );
            })}
            <Button
              icon={() => <MaterialIcons name="add" size={32} />}
              mode="contained"
              onPress={() => addMessage()}
            >
              Add New Message
            </Button>
          </List.Section>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  ) : (
    <View>
      <ActivityIndicator animating={true} />
    </View>
  );
}

function MaterialListIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size: number | undefined;
}) {
  return (
    <List.Icon
      icon={() => <MaterialIcons name={props.name} size={props.size} />}
    />
  );
}

function ToggleChip(props: {
  control: Control<FieldValues, any> | undefined;
  text: string;
  name: string;
}) {
  return (
    <Controller
      control={props.control}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <Chip
          onPress={() => onChange(!value)}
          style={styles.chip}
          icon={() => (
            <MaterialIcons
              size={24}
              name={value ? "check-box" : "check-box-outline-blank"}
            />
          )}
        >
          {props.text}
        </Chip>
      )}
      name={props.name}
    />
  );
}

function ControlledTextField(props: {
  control: Control<FieldValues, any> | undefined;
  label: TextInputLabelProp | undefined;
  keyboardType: KeyboardTypeOptions;
  name: string;
}) {
  return (
    <Controller
      control={props.control}
      rules={{
        required: true,
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          mode="outlined"
          label={props.label}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          keyboardType={props.keyboardType}
        />
      )}
      name={props.name}
    />
  );
}

const styles = StyleSheet.create({
  chip: { marginRight: 10, marginBottom: 10 },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

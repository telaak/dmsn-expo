import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
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
import { useForm, Controller, useFieldArray } from "react-hook-form";
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

const TextInputComponent = (props) => {
  const [text, setText] = React.useState(props.value);

  return (
    <TextInput
      label={props.label}
      value={text}
      onChangeText={(text) => setText(text)}
      multiline={props.multiline}
      numberOfLines={props.numberOfLines}
    />
  );
};

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
        hours: 0,
        days: 3,
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
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="name"
                />
              )}
              left={() => <List.Icon icon="account" />}
            />
            <List.Item
              title={() => (
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="email"
                />
              )}
              left={() => <List.Icon icon="email" />}
            />
            <List.Item
              title={() => (
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Phone Number"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                    />
                  )}
                  name="phoneNumber"
                />
              )}
              left={() => <List.Icon icon="phone" />}
            />

            <List.Item
              title={() => (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      /*   <Checkbox.Android
                      onPress={() => onChange(!value)}
                      status={value ? "checked" : "unchecked"}
                    /> */
                      <Chip
                        onPress={() => onChange(!value)}
                        icon={() => (
                          <MaterialIcons
                            size={24}
                            name={
                              value ? "check-box" : "check-box-outline-blank"
                            }
                          />
                        )}
                      >
                        Enable SMS
                      </Chip>
                    )}
                    name="smsEnabled"
                  />
                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      /*   <Checkbox.Android
                      onPress={() => onChange(!value)}
                      status={value ? "checked" : "unchecked"}
                    /> */
                      <Chip
                        onPress={() => onChange(!value)}
                        icon={() => (
                          <MaterialIcons
                            size={24}
                            name={
                              value ? "check-box" : "check-box-outline-blank"
                            }
                          />
                        )}
                      >
                        Enable Email
                      </Chip>
                    )}
                    name="emailEnabled"
                  />
                </View>
              )}
              left={() => (
                <List.Icon
                  icon={() => <MaterialIcons name="settings" size={32} />}
                />
              )}
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
                    left={() => (
                      <List.Icon
                        icon={() => <MaterialIcons name="message" size={32} />}
                      />
                    )}
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
                    left={() => (
                      <List.Icon
                        icon={() => <MaterialIcons name="schedule" size={32} />}
                      />
                    )}
                  ></List.Item>
                  <List.Item
                    left={() => (
                      <List.Icon
                        icon={() => <MaterialIcons name="delete" size={32} />}
                      />
                    )}
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
      <Text>Asd</Text>
    </View>
  );
}

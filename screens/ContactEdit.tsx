import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { Checkbox, TextInput, Text, Chip, Snackbar } from "react-native-paper";
import { List } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { getUser, IContact, IUser, login, updateContact, useGetUser } from "../api/api";
import { useNavigation } from "@react-navigation/native";

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

export function ContactEdit({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {

  const mount = useEffect(() => {
    if (isSuccess) {
      const contact = data.contacts.find(c => c._id === route.params.id) as IContact
      setTestData(contact);
      reset(contact);
      navigation.setOptions({
        headerRight: () => (
          <MaterialIcons
            size={24}
            name="save"
            onPress={handleSubmit(
              (valid) => {
                mutation.mutate(valid, {
                  onSuccess: (response: IUser) => {
                    setSnackBarMessage("Saved succesfully");
                    onToggleSnackBar();
                    queryClient.setQueryData(["user"], response);
                    const updatedContact = response.contacts.find(c => c._id === contact._id)
                    setTestData(updatedContact);
                    reset(updatedContact);
                    navigation.setOptions({
                      title: updatedContact?.name
                    })
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
    }
    
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({});

  const [testData, setTestData] = useState<IContact>();

  const [snackbarMessage, setSnackBarMessage] = useState("Saved");

  const queryClient = useQueryClient();

  const mutation = useMutation(updateContact)

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const { status, data, error, isSuccess } = useQuery("user", getUser)

  return testData ? (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Snackbar
          wrapperStyle={{ zIndex: 999999 }}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {snackbarMessage}
        </Snackbar>
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

            <List.Subheader>Messages</List.Subheader>
            {testData.messages.map((message, i) => {
              return (
                <List.Item
                  key={i}
                  title={() => (
                    <TextInputComponent
                      label={message.time}
                      value={message.content}
                      multiline
                      numberOfLines={5}
                    />
                  )}
                  left={() => <List.Icon icon="card-text-outline" />}
                />
              );
            })}
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

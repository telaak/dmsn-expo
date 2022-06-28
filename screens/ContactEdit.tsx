import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { List } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";


export interface IContact {
  name: string;
  email: string;
  phoneNumber: string;
  _id: string;
  messages: [
    {
      time: string;
      content: string;
    }
  ];
}

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

export function ContactEdit({ route, navigation }) {
  const data: IContact = JSON.parse(route.params.data)
  navigation.setOptions({ title: data.name })
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons size={24} name="save"/>
      ),
    });
  }, [navigation]);
  return (
    <KeyboardAwareScrollView>
      <ScrollView>
        <List.Section>
          <List.Subheader>Contact Information</List.Subheader>
          <List.Item
            title={() => <TextInputComponent label="Name" value={data.name} />}
            left={() => <List.Icon icon="account" />}
          />
          <List.Item
            title={() => (
              <TextInputComponent label="Email" value={data.email} />
            )}
            left={() => <List.Icon icon="email" />}
          />
          <List.Item
            title={() => (
              <TextInputComponent
                label="Phone Number"
                value={data.phoneNumber}
              />
            )}
            left={() => <List.Icon icon="phone" />}
          />
          <List.Subheader>Messages</List.Subheader>
          {data.messages.map((message, i) => {
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
  );
}

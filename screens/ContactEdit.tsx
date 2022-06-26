import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { List } from "react-native-paper";
import * as ScreenOrientation from "expo-screen-orientation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

interface TextInputProps {
  label: string;
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
  const { data }: { data: IContact } = route.params;
  const [verticalOffset, setVerticalOffset] = React.useState(65);

  /*  const orientationListener = ScreenOrientation.addOrientationChangeListener((listener) => {
    switch (listener.orientationInfo.orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        setVerticalOffset(65);
        console.log(`portrait: ${verticalOffset}`);
        break;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        setVerticalOffset(35);
        console.log(`landscape: ${verticalOffset}`);
        break;
      default:
        break;
    }
  }); */

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
               <List.Item
            title={() => (
              <TextInputComponent
                label="Phone Number"
                value={data.phoneNumber}
              />
            )}
            left={() => <List.Icon icon="phone" />}
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
               <List.Item
            title={() => (
              <TextInputComponent
                label="Phone Number"
                value={data.phoneNumber}
              />
            )}
            left={() => <List.Icon icon="phone" />}
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
               <List.Item
            title={() => (
              <TextInputComponent
                label="Phone Number"
                value={data.phoneNumber}
              />
            )}
            left={() => <List.Icon icon="phone" />}
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

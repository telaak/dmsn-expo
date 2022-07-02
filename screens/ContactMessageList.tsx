import React from "react";
import { useGetUser } from "../api/api";
import {
    LayoutAnimation,
    ScrollView,
    UIManager,
    View,
    StyleSheet,
    Text,
  } from "react-native";
import { List } from "react-native-paper";

export const ContactMessageList = () => {
  const { status, data, error, isSuccess } = useGetUser();

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Section title="Accordions">
      <List.Accordion
        title="Uncontrolled Accordion"
        description={'Test\nTest2'}
        left={props => <List.Icon {...props} icon="folder" />}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>

      <List.Accordion
        title="Controlled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={handlePress}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>
    </List.Section>
  );
};

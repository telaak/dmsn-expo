import React from "react";
import { List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";


export function MaterialListIcon(props: {
    name: React.ComponentProps<typeof MaterialIcons>["name"];
    size: number | undefined;
  }) {
    return (
      <List.Icon
        icon={() => <MaterialIcons name={props.name} size={props.size} />}
      />
    );
  }
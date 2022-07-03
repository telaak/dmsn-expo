import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Chip } from "react-native-paper";
import {
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


export function ToggleChip(props: {
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

const styles = StyleSheet.create({
  chip: { marginRight: 10, marginBottom: 10 },
});

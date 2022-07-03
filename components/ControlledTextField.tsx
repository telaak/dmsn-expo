import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { KeyboardTypeOptions } from "react-native";
import { TextInput } from "react-native-paper";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";

export function ControlledTextField(props: {
    control: Control<FieldValues, any> | undefined;
    label: TextInputLabelProp | undefined;
    keyboardType: KeyboardTypeOptions;
    name: string;
    required: boolean
  }) {
    return (
      <Controller
        control={props.control}
        rules={{
          required: props.required,
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
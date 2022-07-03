import React from "react"
import { useForm } from "react-hook-form";
import { View, Text } from "react-native"

export const UserSettings = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        register,
      } = useForm({});

      
    return <View>

    </View>
}
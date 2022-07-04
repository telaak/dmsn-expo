import { useNavigation } from "@react-navigation/native";
import axios, { AxiosRequestConfig } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export interface IMessage {
  duration: {
    days: number;
    weeks: number;
    months: number;
    years: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  content: string;
  _id?: string;
}

export interface IContact {
  name: string;
  email: string;
  phoneNumber: string;
  smsEnabled: Boolean;
  emailEnabled: Boolean;
  messages: IMessage[];
  pushToken: string;
  _id?: string;
}

export interface IUser {
  username: string;
  password: string;
  contacts: IContact[];
  lastPing: Date;
  lastLocation: ILocation
  settings: IUserSettings
  comparePassword: Function;
  ping: Function;
  setPushToken: Function;
  _id?: string;
}

export interface IUserSettings {
  email: string;
  phoneNumber: string;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
}

export interface ILocation {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timestamp: Date;
}

const apiUrl = `https://devbackend.laaksonen.eu`;

const axiosOptions: AxiosRequestConfig = {
  withCredentials: true,
};

export const getLogOutMutation = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const mutation = useMutation(logout, {
    onSuccess: (res: any) => {
      queryClient.invalidateQueries();
    },
  });
  return mutation;
};

export const getUpdatePushTokenMutation = () => {
  const mutation = useMutation(updatePushToken);
  return mutation;
};

export const updatePushToken = (pushToken: string) => {
  return axios.post(
    `${apiUrl}/api/user/pushToken`,
    { pushToken },
    axiosOptions
  );
};

export const useGetUser = () => {
  const navigation = useNavigation();
  return useQuery("user", getUser, {
    // onError: (err) => navigation.navigate('Login' as never),
    retry: 1,
  });
};

export const getLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation(login, {
    onSuccess: (data: any) => {
      queryClient.setQueryData(["user"], data.data);
      // navigation.navigate('Home' as never)
    },
  });
  return mutation;
};

export const getUser = async (): Promise<IUser> => {
  const res = await axios.get(`${apiUrl}/api/user/current`, axiosOptions);
  return res.data;
};

import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const pingServer = async (): Promise<Date> => {
  const localSettings = await AsyncStorage.getItem("localSettings") as string;
  let location;
  try {
    const parsedSettings = JSON.parse(localSettings)
    if (parsedSettings.sendLocation) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        location = await Location.getCurrentPositionAsync({});
      }
    }
  } catch (error) {
    console.log(error)
  }

  const res = await axios.post(`${apiUrl}/api/user/ping`, location, {
    withCredentials: true,
  });
  return res.data;
};

export const logout = async (): Promise<any> => {
  console.log("logging out");
  return axios.get(`${apiUrl}/api/user/logout`, {
    withCredentials: true,
  });
};

export const login = async (loginDetails: {
  username: string;
  password: string;
}): Promise<IUser> => {
  return axios.post(`${apiUrl}/api/user/login`, loginDetails, {
    withCredentials: true,
  });
};

export const deleteContact = async (id: string) => {
  const res = await axios.delete(`${apiUrl}/api/user/contact/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation(deleteContact, {
    onSuccess: (data: any) => {
      queryClient.setQueryData(["user"], data);
    },
  });
  return mutation;
};

export const getCreateContactMutation = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation(createContact);
  return mutation;
};

export const createContact = async (newContact: IContact) => {
  const res = await axios.post(`${apiUrl}/api/user/contact`, newContact, {
    withCredentials: true,
  });
  return res.data;
};

export const updateContact = async (partialContact: Partial<IContact>) => {
  const res = await axios.patch(
    `${apiUrl}/api/user/contact/${partialContact._id}`,
    partialContact,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const getUpdateUserSettingsMutation = async () => {
  const queryClient = useQueryClient()
  const mutation = useMutation(updateUserSettings, {
    onSuccess: (data: IUser) => {
      queryClient.setQueryData('user', data)
    }
  })
  return mutation
}

export const updateUserSettings = async (
  partialSettings: Partial<IUserSettings>
) => {
  const res = await axios.patch(
    `${apiUrl}/api/user/settings`,
    partialSettings,
    axiosOptions
  );
  return res.data;
};

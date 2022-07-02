import { useNavigation } from "@react-navigation/native";
import axios, { AxiosRequestConfig } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryClient } from "../App";

export interface IMessage {
  duration: number;
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
  comparePassword: Function;
  ping: Function;
  setPushToken: Function;
  _id?: string;
}

const apiUrl = `http://192.168.0.64:3000`;

const axiosOptions: AxiosRequestConfig = {
  withCredentials: true,
};

export const useGetUser = () => {
    const navigation = useNavigation();
    return useQuery("user", getUser, {
        onError: (err) => navigation.navigate('Login' as never),
        retry: 1
    });
};

export const getLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation(login, {
    onSuccess: (data: any) => {
      queryClient.setQueryData(["user"], data.data);
      navigation.navigate('Home' as never)
    },
  });
  return mutation;
};

export const getUser = async (): Promise<IUser> => {
  const res = await axios.get(`${apiUrl}/api/user/current`, axiosOptions);
  return res.data;
};

export const pingServer = async (): Promise<Date> => {
  const res = await axios.get(`${apiUrl}/api/user/ping`, {
    withCredentials: true,
  });
  return res.data;
};

export const login = async (loginDetails: {
  username: string;
  password: string;
}): Promise<IUser> => {
  return axios.post(`${apiUrl}/api/user/login`, loginDetails, {
    withCredentials: true,
  });
};

export const setUserData = (data: IUser) => {
  queryClient.setQueryData(["user"], data);
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

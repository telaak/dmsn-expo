import axios from "axios";

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

export const getUser = async (): Promise<IUser> => {
  const res = await axios.get("http://192.168.0.64:3000/api/user/current", {
    withCredentials: true,
  });
  return res.data;
};

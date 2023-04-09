import axios from "axios";
import authHeader from "./auth-header";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {setMessage} from "../slices/message";

const USER_API_URL = process.env.REACT_APP_API_URL + "/user/";

const getWorkstationList = (clientId) => {
  return axios.get(USER_API_URL + clientId + "/workstation", { headers: authHeader() });
}
const getClientList = () => {
  return axios.get(USER_API_URL + "clients", { headers: authHeader() });
}
const getCpz = () => {
  return axios.get(USER_API_URL + "cpz", { headers: authHeader() });
}
const getPublicContent = () => {
  return axios.get(USER_API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(USER_API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(USER_API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(USER_API_URL + "admin", { headers: authHeader() });
};

const registerClient = createAsyncThunk(
    "client/register",
    async ({ clientName, phone, email, address1, address2, city, province, postCode, country, contactFirstName, contactLastName, createAccount }, thunkAPI) => {
      try {
        const response = await axios.post(USER_API_URL + "registerClient",
            {clientName, phone, email, address1, address2, city, province, postCode, country, contactFirstName, contactLastName, createAccount},
            { headers: authHeader() });
        thunkAPI.dispatch(setMessage("New Client ID: " + response.data));
        return response.data;
      } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue();
      }
    }
);

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getClientList,
  getWorkstationList,
  registerClient,
  getCpz
};

export default userService
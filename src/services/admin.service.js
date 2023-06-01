import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../common/AuthInterceptor";
import authHeader from "./auth-header";
import {setMessage} from "../slices/message";


const ADMIN_API_URL = process.env.REACT_APP_API_URL + "/admin/";

export const createUser = createAsyncThunk(
    "user/create",
    async ({ firstName, lastName, email }, thunkAPI) => {
        try {
            const response = await axios.post(ADMIN_API_URL + "createUser",
                {firstName, lastName, email}, { headers: authHeader() });
            thunkAPI.dispatch(setMessage(response.data));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const getClients = () => axios.get(ADMIN_API_URL + "getClients", { headers: authHeader() });

export const getDiscountSub = () => axios.get(ADMIN_API_URL + "getDiscountSub", { headers: authHeader() });

export const updateDiscount = (clientId, subId, discount) => axios.post(ADMIN_API_URL + "setDiscount", {clientId, subId, discount}, {headers: authHeader()});

const adminService = {
    createUser,
    getClients,
    getDiscountSub,
    updateDiscount
}

export default adminService;

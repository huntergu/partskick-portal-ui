import axios from "../common/AuthInterceptor";
import authHeader from "./auth-header";

const PAYMENT_API_URL = process.env.REACT_APP_API_URL + "/moneris/";

const preLoad = (clientIds, subId, startDate) => {
    return axios.post(PAYMENT_API_URL + "preload",
        {clientIds, subId, startDate},
        { headers: authHeader() });
};

const fetchOrder = (storedOrderId) => {
    return axios.get(PAYMENT_API_URL + "fetchOrder/" + storedOrderId,
        { headers: authHeader() });
};

const monerisService = {
    preLoad,
    fetchOrder
};

export default monerisService;

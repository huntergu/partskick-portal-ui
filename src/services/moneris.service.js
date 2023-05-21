import axios from "../common/AuthInterceptor";
import authHeader from "./auth-header";

const PAYMENT_API_URL = process.env.REACT_APP_API_URL + "/moneris/";
const VALIDATE_API_URL = process.env.REACT_APP_MONERIS_URL_VERIFY;
const preLoad = (clientIds, subId, startDate) => {
    return axios.post(PAYMENT_API_URL + "preload",
        {clientIds, subId, startDate},
        { headers: authHeader() });
};

const fetchOrder = (storedOrderId) => {
    return axios.get(PAYMENT_API_URL + "fetchOrder/" + storedOrderId,
        { headers: authHeader() });
};

const checkOrder = (orderId) => {
    return axios.get(PAYMENT_API_URL + "checkOrder/" + orderId,
        { headers: authHeader() });
};

const validateOrder = (txKey) => {
    const data = new FormData();
    data.append("ps_store_id", process.env.REACT_APP_MONERIS_STORE);
    data.append("hpp_key", process.env.REACT_APP_MONERIS_HPPKEY);
    data.append("transactionKey", txKey);
    return axios.post(VALIDATE_API_URL, data, { headers: authHeader() });
}

const monerisService = {
    preLoad,
    fetchOrder,
    checkOrder,
    validateOrder
};

export default monerisService;

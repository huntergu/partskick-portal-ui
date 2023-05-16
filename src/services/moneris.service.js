import axios from "../common/AuthInterceptor";
import authHeader from "./auth-header";

const USER_API_URL = process.env.REACT_APP_API_URL + "/moneris/";

const preLoad = (clientIds, subId, startDate) => {
    return axios.post(USER_API_URL + "preLoad",
        {clientIds, subId, startDate},
        { headers: authHeader() });
};

const monerisService = {
  preLoad
};

export default monerisService
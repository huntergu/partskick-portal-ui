import axios from "../common/AuthInterceptor";
import authHeader from "./auth-header";

const USER_API_URL = process.env.REACT_APP_API_URL + "/parts/";
const getPartsListInfo = () => {
  return axios.get(USER_API_URL + "plInfo", { headers: authHeader() });
}
const getPartsListInfoWithList = () => {
  return axios.get(USER_API_URL + "plInfoWithList", { headers: authHeader() });
}
const getClientPartsList = (clientId) => {
  return axios.get(USER_API_URL + clientId + "/partsList", { headers: authHeader() });
}

const partsService = {
  getPartsListInfo,
  getPartsListInfoWithList,
  getClientPartsList,
};

export default partsService
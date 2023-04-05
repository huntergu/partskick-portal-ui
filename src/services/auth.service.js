import axios from "axios";
import authHeader from "./auth-header";

const USER_API_URL = process.env.REACT_APP_API_URL + "/user/";
const AUTH_API_URL = process.env.REACT_APP_API_URL + "/api/auth/";

const register = (firstName, lastName, email, password, matchingPassword) => {
  const bodyFormData = new FormData();
  bodyFormData.append("firstName", firstName);
  bodyFormData.append("lastName", lastName);
  bodyFormData.append("email", email);
  bodyFormData.append("password", password);
  bodyFormData.append("", matchingPassword);

  return axios.post(USER_API_URL + "registration", {
    firstName,
    lastName,
    email,
    password,
    matchingPassword
  });
};

const login = (username, password) => {
  return axios
    .post(AUTH_API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};
const forgetPassword = (email) => {
  return axios
    .post(USER_API_URL + "resetPassword?email=" + encodeURIComponent(email))
};

const changePassword = (oldPassword, newPassword) => {
  return axios
    .post(USER_API_URL + "updatePassword", {
      oldPassword,
      newPassword,
    }, { headers: authHeader() });
};

const resetPassword = (newPassword, token) => {
  return axios
    .post(USER_API_URL + "savePassword", {
      newPassword,
      token,
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  forgetPassword,
  changePassword,
  resetPassword,
  login,
  logout,
};

export default authService;

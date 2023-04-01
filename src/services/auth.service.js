import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/user/";

const register = (firstName, lastName, email, password, matchingPassword) => {
  const bodyFormData = new FormData();
  bodyFormData.append("firstName", firstName);
  bodyFormData.append("lastName", lastName);
  bodyFormData.append("email", email);
  bodyFormData.append("password", password);
  bodyFormData.append("matchingPassword", matchingPassword);

  return axios.post(API_URL + "registration", bodyFormData);
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
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

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;

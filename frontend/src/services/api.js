import axios from "axios";
import store from "../store/index";

export default () => {
  return axios.create({
    baseURL: `http://localhost:8080/api/`,
    headers: {
      Authorization: `${store.state.token}`,
    },
  });
};

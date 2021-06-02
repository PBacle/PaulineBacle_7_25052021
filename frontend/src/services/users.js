import api from "../services/api";

export default {
  signup(data) {
    return api().post("users/signup", data);
  },
  login(data) {
    return api().post("users/login", data);
  },
  deleteAccount(id) {
    return api().delete("users/accounts/" + id);
  },

  updateAccount(id, data) {
    return api.put("users/accounts/" + id, data);
  },
  getUsers() {
    return api().get("users/accounts");
  },
  getUserById(id) {
    return api().get("users/accounts/" + id);
  },
};

import api from "../services/api";

export default {
  signup(data) {
    return api().post("users/signup", data);
  },
  login(data) {
    return api().post("users/login", data);
  },
  getUserById(id) {
    return api().get("users/" + id);
  },
  updateAccount(id, data) {
    return api().put("users/" + id, data);
  },
  deleteAccount(id) {
    return api().delete("users/" + id);
  },
};

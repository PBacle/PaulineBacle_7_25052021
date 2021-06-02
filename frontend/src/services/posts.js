import api from "../services/api";

export default {
  getPosts() {
    return api().get("posts");
  },
  getPostById(id) {
    return api().get("posts/" + id);
  },
  createPost(data) {
    return api().post("posts/add", data);
  },
  updatePost(id, data) {
    return api.put("posts/" + id, data);
  },
  deletePost(id) {
    return api().delete("posts/" + id);
  },

  likePost(id) {
    return api().post("posts/" + id) + "/like";
  },

  commentPost(id, data) {
    return api().post("posts/" + id + "/comments", data);
  },
  deleteComment(id) {
    return api().delete("posts/comments/" + id);
  },
};

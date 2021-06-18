import api from "../services/api";

export default {
  getPosts() {
    return api().get("posts");
  },
  getPostById(id) {
    return api().get("posts/" + id);
  },
  getPostsByUserId(id) {
    return api().get("posts/profiles/" + id);
  },
  getLikedPostsByUserId(id) {
    return api().get("posts/profiles/" + id + "/liked");
  },
  deletePost(id) {
    return api().delete("posts/" + id);
  },
  createPost(data) {
    return api().post("posts/add", data);
  },
  updatePost(id, data) { 
    return api().put("posts/" + id, data);
  },
  
  getComments(id) {
    return api().get("posts/" + id + "/comments/");
  },
  deleteComment(id) {
    return api().delete("posts/comments/" + id);
  },


  likePost(id) {
    return api().post("posts/" + id + "/like");
  },

  commentPost(id, data) {
    return api().post("posts/" + id + "/comments/add", data);
  },
};

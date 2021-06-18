import api from "../services/api";

export default {
  getPosts() {
    return api().get("posts");
  },
  
  createPost(data) {
    return api().post("posts/add", data);
  },
  getPostById(id) {
    return api().get("posts/" + id);
  },
  updatePost(id, data) { 
    return api().put("posts/" + id, data);
  },
  deletePost(id) {
    return api().delete("posts/" + id);
  },
  
  commentPost(id, data) {
    return api().post("posts/" + id + "/comments/add", data);
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

};

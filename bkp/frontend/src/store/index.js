import { createStore } from 'vuex'
import axios from "axios";
import Posts from "../services/posts";
import Users from "../services/users";


export default createStore({
  state: {
    token: null,
    isLoggedIn: false,
    isLoading: false,
    message: "",
    error: "",    
    userLoggedIn: {},
    user:{},
    post:{},
    comment:{},
    users:[],
    comments:[],
    posts:[]    
  },

  getters: {
    comments(state) {
      return state.comments;
    },
    posts(state) {
      return state.posts;
    },
    post(state) {
      return state.post;
    },
    users(state) {
      return state.users;
    },
    userLoggedIn(state) {
      return state.userLoggedIn;
    },
    user(state) {
      return state.user;
    },
    message(state) {
      return state.message;
    },
    error(state) {
      return state.error;
    },
    isLogged(state) {
      return state.isLoggedIn;
    },
  },

  mutations: {
    LOG_OUT(state) {
      state.token = null;
      state.userLoggedIn = null;
      state.isLoggedIn = false;
      state.message = "";
      state.error = "";
    },
    LOG_IN(state, user) {
      state.token = user.token;
      if (user.token) {
        state.isLoggedIn = true;
        state.userLoggedIn = user.user;
      } else {
        state.isLoggedIn = false;
      }
    },

    DELETE_TOKEN(state) {
      state.token = null;
      state.user = "";
      state.isLoggedIn = false;
    },

    CLEAR_LOG(state){
      state.message = "";
      state.error = "";
    },

    SET_ERROR(state, error){
      state.error = error;
      state.message = "";
    },
    SET_MESSAGE(state, msg){
      state.error = "";
      state.message = msg;
    },

    // users
    SET_USER(state, user) {
      state.user = user;
    },
    GET_USERS(state, users) {
      state.users = users;
    },
    UPDATE_ACCOUNT(state, id, user) {
      Object.assign(
        state.users.find((element) => element.id === id),
        user
      );
      state.message = "Compte modifié";
    },
    DELETE_ACCOUNT(state, id) {
      state.users = [...state.users.filter((element) => element.id !== id)];
      state.message = "Compte supprimé";
    },
    // end users

    // posts

    GET_POSTS(state, posts) {
     state.posts = posts ;
    },
    GET_POST_BY_ID(state, post) {
      state.post = post;
    },
/*    ADD_POST(state, post) {
      console.log("Post to add", post);
      state.posts = [post, ...state.posts];
      state.message = "Post créé";
    },*/
    UPDATE_POST(state, id, post) {
      Object.assign(
        state.posts.find((element) => element.id === id),
        post
      );     
      state.message = "Le post a été modifié.";
    },
    DELETE_POST(state, id) {
      state.posts = [...state.posts.filter((element) => element.id !== id)];
//      state.message = "Post supprimé";
    },
    // end posts

    // comments
    GET_COMMENTS(state, comments) {
      state.comments = comments
    },    
    COMMENT_POST(state, comment) {
      state.comments = [comment, ...state.comments];
      state.message = "Post commenté";
    },
    UPDATE_COMMENT(state, id, comment) {
      Object.assign(
        state.comments.find((element) => element.id === id),
        comment
      );     
      state.message = "Le commentaire a été modifié.";
    },
    DELETE_COMMENT(state, id) {
      state.comments = [...state.comments.filter((element) => element.id !== id)];
      state.message = "Commentaire supprimé";
    },
    // end comments

    // like
    LIKE_POST(state, like) {
      state.posts = [like, ...state.posts];
    },
    // end like
  },


  actions: {
    //users
    clearLog({ commit }) {
      commit("CLEAR_LOG");
    },
    logIn({ commit }, user) {
      commit("LOG_IN", user);
      console.log('Utilisateur ' + user.user.pseudo+ ' connecté !' );
    },
    logOut({ commit }) {
      commit("LOG_OUT");
      console.log('Utilisateur déconnecté !' );
    },
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    getUsers({ commit }) {
      Users.getUsers().then((response) => {
        const users = response.data;
        commit("GET_USERS", users);
      });
    },
    getUserById({ commit }, id) {
      console.log("POSTID:", id);
      Users.getUserById(id).then((response) => {
        const user = response.data;
        commit("SET_USER", user);
      });
    },
    deleteAccount({ commit }, id) {
      Users.deleteAccount(id).then(() => {       
          commit("DELETE_ACCOUNT", id);
      })      
    },
    updateAccount({ commit }, data) {
      let id = this.state.user.id;
      axios
        .put(`http://localhost:3000/api/users/accounts/${id}`, data, {
          headers: { Authorization: this.state.token },
        })
        .then((response) => {
          const newUser = response.data;
          commit("UPDATE_ACCOUNT", id, newUser);
        })
    },
    // end users

    // posts
    getPosts({ commit }) {
      Posts.getPosts().then((response) => {
        const posts = response.data;
        commit("GET_POSTS", posts);
      });
    },
    getHotPosts({ commit }) {
      Posts.getHotPosts().then((response) => {
        const posts = response.data;
        commit("GET_HOT_POSTS", posts);
      });
    },

    getPostById({ commit }, id) {
      Posts.getPostById(id).then((response) => {
        const post = response.data[0];
        commit("GET_POST_BY_ID", post);
      });
    },
    createPost({ commit }, post) {
      Posts.createPost(post)
        .then((response) => {
          commit("SET_MESSAGE", response.data.messageRetour);
        })
        .catch(error => {
          if (error.response) {
            commit("SET_ERROR", error.response.data.error); 
          }
        })           
        .then(() => {
          Posts.getPosts().then((response) => {
            const posts = response.data;
            commit("GET_POSTS", posts);
          });
        });
    },
    updatePost({ commit }, data) {
      let id = this.state.post.id;
      axios
        .put(`http://localhost:3000/api/posts/${id}`, data, {
          headers: { Authorization: this.state.token },
        })
        .then((response) => {
          const post = response.data;
          commit("UPDATE_POST", id, post);
        });
    },
    deletePost({ commit }, id) {
      Posts.deletePost(id)
        .then((res) => {
          commit("SET_MESSAGE", res.data.messageRetour);
          commit("DELETE_POST", id);
        })
    },

    //like
    likePost({ commit }, payload) {
      axios
        .post(
          `http://localhost:3000/api/posts/${payload.id}/like`,
          payload.data,
          { headers: { Authorization: this.state.token } }
        )
        .then((response) => {
          const like = response.data;
          commit("LIKE_POST", like);
        })
        .then(() => {
          Posts.getPosts().then((response) => {
            const posts = response.data;
            commit("GET_POSTS", posts);
          });
        });
    },
    // end like


    // comment
    commentPost({ commit }, payload) {
      axios
        .post(
          `http://localhost:3000/api/posts/${payload.id}/comments`,
          payload.data,
          { headers: { Authorization: this.state.token } }
        )
        .then((response) => {
          const comment = response.data;
          commit("COMMENT_POST", comment);
        })
        .then(() => {
          Posts.getPosts().then((response) => {
            const posts = response.data;
            commit("GET_POSTS", posts);
          });
        });
    },
    deleteComment({ commit }, id) {
      Posts.deleteComment(id)
        .then(() => {
          commit("DELETE_COMMENT", id);
        })
        .then(() => {
          Posts.getPosts().then((response) => {
            const posts = response.data;
            commit("GET_POSTS", posts);
          });
        });
    },
    // end posts
  }
})

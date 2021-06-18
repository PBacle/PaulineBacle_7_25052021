import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Posts from "../services/posts";
import Users from "../services/users";
import { checkLike } from "../helpers/checkLike"

export default createStore({

  plugins: [createPersistedState({
    storage: window.sessionStorage,
    })],

  state: {
    token: null,
    message: "",
    error: "",    
    isLoggedIn: false,
    userLoggedIn: {},
    user:{},
    posts:[],    
    post:{},
    comments:[]
},

  getters: {

    message(state) { return state.message; },

    error(state) { return state.error; },

    isLogged(state) { return state.isLoggedIn; },
    
    userLoggedIn(state) { return state.userLoggedIn; },

    user(state) { return state.user; },

    posts(state) { return state.posts; },

    postsById : (state) => (userId) => { 
      return state.posts.filter(post => post.userId == userId ) ;
     },

     postsLikedById : (state) => (userId) => { 
      return state.posts.filter(post => checkLike(post.hasLikedList, userId) )  ;
     },

    post(state) { return state.post; },

    comments(state) { return state.comments; }

  },

  mutations: {
    LOG_OUT(state) {
      state.token = null;
      state.userLoggedIn = {};
      state.isLoggedIn = false;
      state.message = "";
      state.error = "";
      state.user={} ;
      state.posts=[] ;    
      state.post={} ;
      state.comments=[];
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

    CLEAR_LOG_MSG(state){
      state.message = "";
    },

    CLEAR_LOG_ERROR(state){
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

    SET_USER(state, user) {
      state.user = user;
    },

    GET_POSTS(state, posts) {
     state.posts = posts ;
    },

    GET_POST_BY_ID(state, post) {
      state.post = post;
    },

    DELETE_POST(state, id) {
      state.posts = [...state.posts.filter((element) => element.id !== id)];
    },

    GET_COMMENTS(state, comments) {
      state.comments = comments
    },    
    
    DELETE_COMMENT(state, id) {
      state.comments = [...state.comments.filter((element) => element.id !== id)];
    },

    LIKE_POST(state, list) {
      state.post.hasLikedList = list ;
    },

  },


  actions: {
    clearLog({ commit }) {
      commit("CLEAR_LOG_ERROR") ;
//      setTimeout(commit("CLEAR_LOG_MSG"), 2000) ;
    },

    setMsg({ commit }, msg) {
      commit("SET_MESSAGE", msg);
    },

    logOut({ commit }) {
      commit("LOG_OUT");
      commit("SET_MESSAGE", "Déconnexion réussie");
      sessionStorage.clear();
    },

    logIn({ commit }, user) {
      commit("LOG_IN", user);
    },

    getUserById({ commit }, id) {
      Users.getUserById(id).then((response) => {
        const user = response.data;
        commit("SET_USER", user);
      });
    },

    updateAccount({ commit }, user) {
      return new Promise((resolve) => {     
        Users.updateAccount(user.id, user.data)
         .then((response) => {
           const messageRetour = response.data.messageRetour ; 
            Users.getUserById(user.id).then((response) => {
              const user = response.data;
              commit("SET_USER", user);
              commit("SET_MESSAGE", messageRetour);
              resolve();
            });
         })
         .catch(error => {
           if (error.response) {
             commit("SET_ERROR", error.response.data.error); 
           }
         })         
       })   
    },

    deleteAccount({ commit }, id) {
      return new Promise((resolve) => { 
        Users.deleteAccount(id)       
          .then((response) => {
            commit("SET_MESSAGE", response.data.messageRetour);
            resolve();
          })
          .catch(error => {
            if (error.response) {
              commit("SET_ERROR", error.response.data.error); 
            }else{
              commit("SET_ERROR", "Une erreur s'est produite."); 
            }
          })           
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

    getPostById({ commit }, id) {
      Posts.getPostById(id).then((response) => {
        const post = response.data[0];
        commit("GET_POST_BY_ID", post);
      });
    },

    createPost({ commit }, post) {
      return new Promise((resolve) => { 
        Posts.createPost(post)
          .then((response) => {
            commit("SET_MESSAGE", response.data.messageRetour);
            Posts.getPosts().then((results) => {
              const posts = results.data;
              commit("GET_POSTS", posts);
              resolve();
            })
          })
          .catch(error => {
            if (error.response) {
              commit("SET_ERROR", error.response.data.error); 
            }else{
              commit("SET_ERROR", "Une erreur s'est produite."); 
            }
          })           
        })
    },

    deletePost({ commit }, id) {
      Posts.deletePost(id)
        .then((res) => {
          commit("SET_MESSAGE", res.data.messageRetour);
          commit("DELETE_POST", id);
        })
    },

    updatePost({ commit }, post) {
      return new Promise((resolve) => {     
        Posts.updatePost(post.id, post.data)
         .then((response) => {
           const messageRetour = response.data.messageRetour ; 
           Posts.getPostById(post.id).then((response) => {
               const post = response.data[0];
               commit("SET_MESSAGE", messageRetour);
               commit("GET_POST_BY_ID", post);
               resolve();
             })
         })
         .catch(error => {
           if (error.response) {
             commit("SET_ERROR", error.response.data.error); 
           }
         })         
       })   
    },
    // end posts

    // comment
    getComments({ commit }, id) {
      Posts.getComments(id).then((response) => {
        const comments = response.data;
        commit("GET_COMMENTS", comments);
      })
    },

    commentPost({ commit }, post) {
      return new Promise((resolve) => {       
       Posts.commentPost(post.id, post.data)
        .then((response) => {
          const messageRetour = response.data.messageRetour ; 
          Posts.getComments(post.id).then((response) => {
              const comments = response.data;
              commit("SET_MESSAGE", messageRetour);
              commit("GET_COMMENTS", comments);
              resolve();
            })
        })
        .catch(error => {
          if (error.response) {
            commit("SET_ERROR", error.response.data.error); 
          }
        })         
      })  
    },

    deleteComment({ commit }, id) {
      Posts.deleteComment(id)
        .then((res) => {
          commit("SET_MESSAGE", res.data.messageRetour);
          commit("DELETE_COMMENT", id);
        })
    },
    // end comments

    //like
    likePost({ commit }, post) {
      Posts.likePost(post.id).then((msg) => {
        const messageRetour = msg.data.messageRetour ; 
        Posts.getPosts().then((response) => {
          commit("SET_MESSAGE", messageRetour);
          commit("GET_POSTS", response.data);
          if(post.isOneVue){
            let updatedPost = response.data.filter(item=> item.id === post.id )[0] ; 
            commit("LIKE_POST", updatedPost.hasLikedList);
          }
        });


     });
    },
    // end like

  }
})

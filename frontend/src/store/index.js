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
    isLoggedIn: false,
    userLoggedIn: {},
    user:{},
    posts:[],    
    post:{},
    comments:[]
},

  getters: {

    message(state) { return state.message; },

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
      state.isLoggedIn = false;
      state.userLoggedIn = {};
      state.message = "";
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
      state.userLoggedIn = {};
    },

    CLEAR_LOG_MSG(state){
      state.message = "";
    },

    SET_MESSAGE(state, msg){
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
    setMsg({ commit }, msg) {
      commit("SET_MESSAGE", msg);
      setTimeout(() => {
        commit("CLEAR_LOG_MSG");
      }, 2500);
      
    },

    logOut({ commit, dispatch }) {
      commit("LOG_OUT");
      dispatch('setMsg', "Déconnexion réussie");
      sessionStorage.clear();
    },

    logIn({ commit }, user) {
      commit("LOG_IN", user);
    },

    getUserById({ commit }, id) {
      return new Promise((resolve,reject) => {
        Users.getUserById(id)
        .then((response) => {
          const user = response.data;
          commit("SET_USER", user);
          resolve();
        })  
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })    

      })
    },

    updateAccount({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {     
        Users.updateAccount(user.id, user.data)
         .then((response) => {
           const messageRetour = response.data.messageRetour ; 
            Users.getUserById(user.id).then((response) => {
              const user = response.data;
              commit("SET_USER", user);
              dispatch('setMsg', messageRetour);
              resolve();
            })
            .catch(error => {
              if (error.response) {
                reject(error.response.data.error);
              }else{
                reject("Une erreur s'est produite");
              }  
            })    
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })     
       })   
    },

    deleteAccount({ dispatch }, id) {
      return new Promise((resolve, reject) => { 
        Users.deleteAccount(id)       
          .then((response) => {
            dispatch('setMsg', response.data.messageRetour);
            resolve();
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.error);
            }else{
              reject("Une erreur s'est produite.");
            }
          })           
        })
    },
    // end users

    // posts
    getPosts({ commit }) {
      return new Promise((resolve,reject) => {
        Posts.getPosts()
        .then((response) => {
          const posts = response.data;
          commit("GET_POSTS", posts);
          resolve();
        })  
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })    
      })
    },

    getPostById({ commit }, id) {
      return new Promise((resolve,reject) => {
        Posts.getPostById(id)
        .then((response) => {
            const post = response.data;
            commit("GET_POST_BY_ID", post);
            resolve();  
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })    
      })
    },

    createPost({ commit, dispatch }, post) {
      return new Promise((resolve, reject) => { 
        Posts.createPost(post)
          .then((response) => {
            Posts.getPosts()
            .then((results) => {
              const posts = results.data;
              commit("GET_POSTS", posts);
              dispatch('setMsg', response.data.messageRetour);
              resolve();
            })
            .catch(error => {
              if (error.response) {
                reject(error.response.data.error);
              }else{
                reject("Une erreur s'est produite");
              }  
            })       
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.error);
            }else{
              reject("Une erreur s'est produite.");
            }
          })           
        })
    },

    deletePost({ commit, dispatch }, id) {
      return new Promise((resolve, reject) => { 
        Posts.deletePost(id)
          .then((res) => {
            dispatch('setMsg', res.data.messageRetour);
            commit("DELETE_POST", id);
            resolve();
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.error);
            }else{
              reject("Une erreur s'est produite");
            }  
          })      
      })
    },

    updatePost({ commit, dispatch }, post) {
      return new Promise((resolve, reject) => {     
        Posts.updatePost(post.id, post.data)
         .then((response) => {
           const messageRetour = response.data.messageRetour ; 
           console.log(messageRetour);
           Posts.getPostById(post.id)
           .then((response) => {
               const post = response.data[0];
               dispatch('setMsg', messageRetour);
               commit("GET_POST_BY_ID", post);
               resolve();
             })
          .catch(error => {
              if (error.response) {
                reject(error.response.data.error);
              }else{
                reject("Une erreur s'est produite");
              }  
            })    
         })
         .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })
       })   
    },
    // end posts

    // comment
    getComments({ commit }, id) {
      return new Promise((resolve,reject) => {
        Posts.getComments(id)
        .then((response) => {
          const comments = response.data;
          commit("GET_COMMENTS", comments);
          resolve();
        })  
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })    
      }) 
    },

    commentPost({ commit, dispatch }, post) {
      return new Promise((resolve, reject) => {       
       Posts.commentPost(post.id, post.data)
        .then((response) => {
          const messageRetour = response.data.messageRetour ; 
          Posts.getComments(post.id).then((response) => {
              const comments = response.data;
              dispatch('setMsg', messageRetour);
              commit("GET_COMMENTS", comments);
              resolve();
            })
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })
      })  
    },

    deleteComment({ commit, dispatch }, id) {
      return new Promise((resolve, reject) => {
        Posts.deleteComment(id)
        .then((res) => {
          dispatch('setMsg', res.data.messageRetour);
          commit("DELETE_COMMENT", id);
          resolve();
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data.error);
          }else{
            reject("Une erreur s'est produite");
          }  
        })
      })
    },
    // end comments

    //like
    likePost({ commit, dispatch }, post) {
      return new Promise((resolve, reject) => {
        Posts.likePost(post.id).then((msg) => {
          const messageRetour = msg.data.messageRetour ; 
          Posts.getPosts()
          .then((response) => {
            dispatch('setMsg', messageRetour);
            commit("GET_POSTS", response.data);
            if(post.isOneVue){
              let updatedPost = response.data.filter(item=> item.id === post.id )[0] ; 
              commit("LIKE_POST", updatedPost.hasLikedList);
            }
            resolve();
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.error);
            }else{
              reject("Une erreur s'est produite");
            }  
          });  
      }) 
     });
    },
    // end like

  }
})

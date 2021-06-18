<template>
  <div id="app">
    <MessagePanel :message="messageRetour" />
    <router-view :key="$route.path" />
  </div>
</template>


<script>
import MessagePanel from '@/components/Message.vue';

export default {
    name: 'OnePost',

    components: {
        MessagePanel,
    }, 

    computed: {
      messageRetour() { return this.$store.getters.message; },
    }
}
</script>

<style>
html{
  box-sizing: border-box;
}

body{
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
  font-weight: bold;
}


a.router-link-exact-active {
  color:red;
}

a:hover{
        color: rgb(117, 117, 117);
    }



ul{
  list-style: none;
}

li a{
  font-weight: normal ;
}


    button{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: #28608f;
        font-weight: bold;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }

    button:hover{
        transform: scale(1.025);
    }

          .button-panel{
        display: flex;
        justify-content: space-evenly;
        margin-top: 10px;
        
      }


    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
        white-space: pre-line;
    }

    .error-message.page404{
      max-width: 50%;
      margin:auto;
      margin-top: 30px;
      background-color: transparent;
      color:black;
      font-weight: bold;
      font-style: italic;
        font-size: 1.5rem;
    }


    .fas{
        font-size: 1.5rem;
    }

    h1{
        font-size: 3rem;
    }


    h2{
        font-size: 1.8rem;
    }


    .italic{
      font-style: italic;
    }

    .center{
      text-align: center;
    }

    @media (max-width: 670px) {
        .button-panel{
            flex-wrap: wrap;
        }
        .button-panel button{
          margin: 10px 10px 0 10px ;
        }
    }


     .icon{
         cursor: pointer;
         margin:0 5px ; 
         font-weight: bold ;
         font-size: 1.2em;
         display: flex;
         line-height: 30px;
         margin-right: 10px;
     }

     .icon::after{
         content:'' ;
        background-color: black;
         display: block;
         height:30px;
         width: 30px;
         margin-left: 10px;
       transition-duration: 0.2s;
      }

     .icon.infos-comments::after{
        -webkit-mask-image: url(./assets/icons/blogging.svg);
        mask-image: url(./assets/icons/blogging.svg);
     }

     .icon.infos-likes::after{
        -webkit-mask-image: url(./assets/icons/like.svg);
        mask-image: url(./assets/icons/like.svg);
     }

     .icon.infos-likes.likedByUser::after{
        background-color:red;
    }
     .icon.infos-likes.likedByUser{
        color:red;
    }

     .icon:hover::after{
        transform: scale(1.15);
     }


</style>

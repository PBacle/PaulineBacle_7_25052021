<template>
  <div class="home">
    <Header />
    <h1>
        <p>Bonjour <span v-if="$store.state.isLoggedIn">{{ user.pseudo }}&nbsp;</span>!</p>
        <p>Bienvenue sur le réseau interne de Groupomania</p>
    </h1>

    <LoginForm v-if="!$store.state.isLoggedIn"/>
    <NewPost v-if="$store.state.isLoggedIn"/>
    <Posts v-if="$store.state.isLoggedIn"/> 
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import Header from '@/components/Header.vue';
import NewPost from '@/components/NewPost.vue';
import Posts from '@/components/Posts.vue';

export default {
  name: 'Home',
  components: {
    LoginForm,
    Posts,
    Header,
    NewPost
  },

  data() { return{ }; },

  computed: {
    user() { return this.$store.getters.userLoggedIn; }
  },

  created(){
      console.log(this.$store.state.isLoggedIn ? 'Utilisateur connecté !': 'Utilisateur non connecté !' );
  },

}
</script>

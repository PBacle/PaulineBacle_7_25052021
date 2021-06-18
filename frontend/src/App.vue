<template>
  <div id="app">
    <MessagePanel :message="messageRetour" />
    <router-view/>
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
}

a.router-link-exact-active {
  color: inherit;
}

ul{
  list-style: none;
}
</style>

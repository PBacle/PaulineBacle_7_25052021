<template>
    <div class="profile">

      <Header />

      <button @click="getBackToFeed">Retour au fil d'actualité</button>

      <UserProfile v-if="$store.state.isLoggedIn && !deleted" @profile-deleted="afterDeleted" />

      <div class="error-message">{{errorMessage}}</div>

    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import UserProfile from '@/components/UserProfile.vue';

export default {
    name: 'Profile',

    components: {
        Header,
        UserProfile,
     },

  data() {
    return {
      deleted:false,
      errorMessage:'',
    };
  },

    methods: {
      getBackToFeed(){
          this.$router.push("/"); 
      },
      afterDeleted(user) {
            this.deleted = true ; 
            if(user.id == this.$store.state.userLoggedIn.userId ){
                this.$store.dispatch("logOut")
                .then(() => this.$router.push("/"))
                .catch((error) => this.errorMessage = error) ;
            }else{
              this.$router.push("/"); 
            }
        }
    }
  }
</script>

<style scoped>


    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
        white-space: pre-line;
    }

</style>
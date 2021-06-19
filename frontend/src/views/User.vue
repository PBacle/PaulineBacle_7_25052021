<template>
    <div class="profile">

      <Header />

      <button @click="getBackToFeed">Retour au fil d'actualité</button>

      <div class="error-message">{{errorMessage}}</div>

      <UserProfile v-if="!deleted" @profile-deleted="afterDeleted" />

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


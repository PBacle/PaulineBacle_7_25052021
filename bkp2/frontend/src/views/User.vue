<template>
    <div class="Profile">

    <Header />

    <button @click="getBackToFeed">Retour au fil d'actualité</button>

    <UserProfile v-if="$store.state.isLoggedIn && !deleted" @profile-deleted="afterDeleted" />

    <p v-if="deleted">{{messageRetour}}</p>
        
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
    };
  },


    computed: {
        messageRetour() { return this.$store.getters.message; },
        errorMessage() { return this.$store.getters.error; },
    },     

    methods: {
        getBackToFeed() { 
            this.$store.dispatch("clearLog");
            this.$router.push("/"); 

        },
        afterDeleted(user) {
            this.deleted = true ; 
            if(user.id == this.$store.state.userLoggedIn.userId ){
                this.$store.dispatch("logOut") ;
            }
            setTimeout(this.getBackToFeed, 1000) ; 
        }
    }
  }
</script>

<style scoped>

</style>
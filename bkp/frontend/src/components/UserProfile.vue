<template>
    <button @click="getBackToFeed">Retour au fil d'actualité</button>

    <div class="UserProfile">
      <section>
        <h1 class="profile-info" v-if=" userDisplayed.userId != user.userId">Profil de {{userDisplayed.pseudo}}</h1>
        <h1 class="profile-info" v-else>Votre profil</h1>
         
        <form  >
            <label for="name">Nom :</label>
            <input type="text" id="name" :disabled="(userDisplayed.userId != user.userId) && user.admin !=1 "  v-model="userDisplayed.name">

            <label for="fname">Prénom :</label>
            <input type="text" id="fname" :disabled="(userDisplayed.userId != user.userId) && user.admin !=1 " v-model="userDisplayed.fname">

            <label for="pseudo">Pseudo :</label>
            <input type="text" id="fname" :disabled="(userDisplayed.userId != user.userId) && user.admin !=1 " v-model="userDisplayed.pseudo">

        </form>


      </section>

        <div v-if="user.admin || userDisplayed.userId === user.userId" class="delete-profile" @click="deleteUser(userDisplayed.userId)">Supprimer le compte</div>

      <section>
        <h3><span v-if=" userDisplayed.userId != user.userId">Les</span><span v-else>Vos</span> posts <span v-if=" userDisplayed.userId != user.userId">de {{userDisplayed.pseudo}}</span>:</h3>

      </section>

      <section>
        <h3>Les posts que <span v-if=" userDisplayed.userId != user.userId">de {{userDisplayed.pseudo}} a</span><span v-else>vous avez</span> likés :</h3>

      </section>

    </div>
</template>

<script>
//import axios from 'axios';

export default {
  name: 'UserProfile',

  data() {
    return {
    };
  },

  computed: {
      user() { return this.$store.getters.user; },
      userDisplayed() { 
        return this.$store.getters.users.find(item => item.userId == this.$route.params.id );
      },
  },

  beforeMount() {
  //  this.$store.dispatch("getUserById");
  },

  methods: {
        getBackToFeed() {
        this.$router.push("/");
        },

    deleteUser(){
      const userId = this.user.userId;
      console.log(userId);
/*
      axios.delete(`${this.$apiUrl}/auth/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          }
      )
      .then(localStorage.removeItem('user'))
      .then(location.href = "/");
*/
    }
  }
}
</script>

<style scoped>

    .profile-info{
        margin: 50px auto;
        max-width: 800px;
        /* text-align: left; */
    }

    .profile-info h2 {
        margin-bottom: 20px;
        font-size: 3rem;
    }

    .profile-info h3 {
        /* text-align: left; */
    }

    .profile-info span {
        font-size: 3rem;
    }

    .delete-profile{
      color: red;
      margin-bottom: 30px;
      font-size: 24px;
      cursor: pointer;
    }
</style>
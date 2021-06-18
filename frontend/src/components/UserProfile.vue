<template>

    <div class="UserProfile">

      <section class="profile-wrapper" >
        <h1 class="profile-title" v-if=" userDisplayed.userId != user.userId">Profil de {{showPseudo(userDisplayed)}}</h1>
        <h1 class="profile-title" v-else>Votre profil</h1>

        <figure class="profile-card">
          <div class="profile-avatar"> 
            <img :src="userDisplayed.avatarUrl"  >
            <div>
                    <div v-if="withImage" >
                        <input
                            @change="uploadImage(userDisplayed.userId)"
                            type="file"
                            accept="image/png, image/jpeg,
                            image/bmp, image/gif"
                            ref="file"
                            id="image"
                            />
                    </div>
              <button id="modify-avatar"  @click.prevent="withImage = !withImage" >Changer l'avatar</button>
              <button  
                v-if="userDisplayed.avatarUrl && userDisplayed.avatarUrl.split('/upload/users/')[1] != 'default.png'"
                id="delete-avatar"  @click.prevent="changeAvatar(userDisplayed.userId)">Supprimer l'avatar</button>
            </div>
          </div> 

          <figcaption class="profile-infos" >
            <form class="modify-wrapper" >

              <fieldset class="profile-infos-id">
                <legend>Informations personnelles</legend>

                <div>
                  <label for="modify-lastname"> Nom :</label>
                  <span v-if="!modify">{{userDisplayed.lastname}}</span>
                  <input v-if="modify" type="text" id="modify-lastname" required v-model="userDisplayed.lastname">
                </div>

                <div>
                  <label for="modify-firstname">Prénom :</label>
                  <span v-if="!modify">{{userDisplayed.firstname}}</span>
                  <input v-if="modify" type="text" id="modify-firstname" required v-model="userDisplayed.firstname">
                </div>

                <div>
                  <label for="modify-pseudo">Pseudo :</label>
                  <span v-if="!modify">{{userDisplayed.pseudo}}</span>
                  <input v-if="modify" type="text" id="modify-pseudo" v-model="userDisplayed.pseudo">
                </div>
              </fieldset>

              <fieldset>
                <legend>Contact</legend>
                <div>
                  <label for="modify-email">Adresse email :</label>
                  <span v-if="!modify">{{userDisplayed.email}}</span>
                  <input v-if="modify" type="email" id="modify-email" required v-model="userDisplayed.email">
                </div>
              </fieldset>

              <fieldset>
                <legend>Biographie</legend>
                <div  class="profile-infos-bio">
                  <label v-if="modify" for="modify-bio">Ajouter quelques mots pour se présenter :</label>
                  <textarea v-if="modify" id="modify-bio" v-model="userDisplayed.bio" rows="5"></textarea>
                  <p v-if="!modify && userDisplayed.bio ">{{userDisplayed.bio}}</p>
                  <p v-else-if="!modify">Malheureusement, pas encore de présentation. </p>
                </div>
              </fieldset>

            </form>


            <p>Profil créé le {{dateFormat(userDisplayed.registerDate)}}.</p>

            <div class="error-message">{{errorMessage}}</div>

            <div>
              <button v-if="(user.admin || userDisplayed.userId === user.userId) && !modify" class="modify-profile" @click="modify = true">Modifier</button>
              <button v-if="modify" @click="cancel()">Annuler</button>
              <button v-if="modify" @click="updateUser(userDisplayed.userId)">Enregistrer les modifications</button>
              <button v-if="user.admin || userDisplayed.userId === user.userId" class="delete-profile" @click="deleteUser(userDisplayed.userId)">Supprimer le compte</button>
            </div>
          </figcaption>
        </figure>

      </section>

      <UserPosts class="profile-posts profile-posts-ownPosts posts-wrapper"
         type-list='postsById'  :user-displayed="showPseudo(userDisplayed)" :is-current-user="userDisplayed.userId == user.userId" />

      <UserPosts class="profile-posts  profile-posts-likedPosts posts-wrapper"
         type-list='postsLikedById'  :user-displayed="showPseudo(userDisplayed)" :is-current-user="userDisplayed.userId == user.userId" />

    </div>

</template>

<script>
import UserPosts from '@/components/UserPosts.vue';

export default {
  name: 'UserProfile',

  components: {
        UserPosts
  },

  data() {
    return {
      modify:false,
      withImage:false,
      isValid:false,
      errorMessage:'',
    };
  },

  computed: {
      user() { return this.$store.getters.userLoggedIn; },
      userDisplayed() { return this.$store.getters.user; },
  },


  mounted() {
    this.$store.dispatch("getUserById", this.$route.params.id);
  },


  methods: {
          checkRequired(user, required){
            const filtered =  Object.keys(user)
              .filter(key => Object.keys(required).includes(key))
              .reduce((obj, key) => {
                obj[key] = user[key] == ''   ;
                return obj;
              }, {})  ;

              return Object.entries(filtered)
              .filter(val => val[1] == true)
              .map( item => required[item[0]] )  ;
          },

    
        cancel() {
            this.$store.dispatch("getUserById", this.$route.params.id);
            this.modify =false;
        },

        showPseudo(user){
            var pseudo = null ; 
            if(user){
                pseudo = user.pseudo ? user.pseudo : user.firstname + " " + user.lastname 
            }
            return pseudo
        },
        
        dateFormat(date){
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        },        

        deleteUser(userId){
              this.$store.dispatch("deleteAccount", userId)
              .then(() => {
                  this.$emit('profile-deleted', { id: userId })
                })
              .catch((error) =>
                  this.errorMessage = error            
              );

        }, 

        uploadImage(userId) {
            const file = this.$refs.file.files[0];
            this.changeAvatar(userId, file)
        },


        changeAvatar(userId, file){
            const formData = new FormData();
            formData.set("typeFile", "user");
            if(this.withImage && file) { 
              formData.set("userId", userId);
              formData.set("image", file);   
            }else{
              formData.set("deleteImage", true); 
            }
            this.$store.dispatch("updateAccount", {
                id : userId, 
                data : formData
                })
            .then(() => {
                this.withImage= false;
            })
            .catch(() =>
              this.errorMessage = "Une erreur s'est produite."            
            );
        },

       updateUser(userId) {
          const areEmpty = this.checkRequired(this.userDisplayed, {
              'firstname' : 'Le prénom', 
              'lastname' : 'Le nom de famille', 
              'email' : 'L\'adresse email'})  ; 
          this.isValid = areEmpty.length != 0 ? false : true ; 

          if(this.isValid){
            const formData = new FormData();    
            formData.set("firstname", this.userDisplayed.firstname);
            formData.set("lastname", this.userDisplayed.lastname);
            formData.set("email", this.userDisplayed.email);
            if(this.userDisplayed.pseudo) formData.set("pseudo", this.userDisplayed.pseudo);
            if(this.userDisplayed.bio) formData.set("bio", this.userDisplayed.bio);
            
            this.$store.dispatch("updateAccount", {
                id : userId, 
                data : formData
                })
            .then(()=>{ 
                this.modify = false;
            })  
            .catch((error) => {
              this.errorMessage = error;
            })
          }else{
              areEmpty.forEach( item => { this.errorMessage += item + " ne doit pas être vide.\n" });
          }
        },
  }
}
</script>

<style scoped>

    .UserProfile{
        margin: 50px auto 30px auto;
        padding: 30px;
        max-width: 800px;
        text-align: center;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
    }

    .profile-wrapper h1 {
        margin-bottom: 20px;
        font-size: 2.5rem;
        color: red;
    }

    .profile-infos {
      width : 90%;
    }

    .profile-card{
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .profile-infos-bio{
      display:flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    }

    textarea{
      width: calc(100% - 40px);
      margin: 20px 0 ;
      resize: vertical;
    }

    .profile-avatar{
      max-width: 100%;
      display: flex; flex-direction: column;
      align-items: center;
    }

    .profile-avatar img{
      height: 200px;
      width: 200px;
      border: red 5pt solid;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .profile-avatar div div{
      margin-bottom: 10px;
    }

    .profile-infos{
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }

    .profile-infos-id{
      display: flex;
      flex-direction: column;
    } 

    button{
      white-space: nowrap;
        margin-top: 20px;
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
        margin: 0px 20px 50px 20px;
    }


    fieldset{
      border : red dashed 2pt ;
      display: flex;
      flex-wrap: wrap;
    }

    fieldset > div {
      margin : 10px 0;
    }

    fieldset + fieldset {
      margin-top : 30px ;
    }

    label{
      padding : 0 20px ;
      line-height: 20px;
      font-weight: bold;
    }
    input{
      line-height: 20px;
    }

    legend {
      color : red ;
        font-weight : bold;
        padding : 0 20px ;
      }

    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
        white-space: pre-line;
    }

</style>
<template>
   <div class="wrapper">
        <form @submit.prevent = signup()>
            <label for="signup-nom">Nom :</label>
            <input id="signup-nom" type="text" v-model="newUser.lastname" placeholder="Nom" required>
            
            <label for="signup-prenom">Prenom :</label>
            <input id="signup-prenom" type="text" v-model="newUser.firstname" placeholder="Prenom" required>

            <label for="signup-pseudo">Pseudo :</label>
            <input id="signup-pseudo" type="text" v-model="newUser.pseudo" placeholder="Pseudo (facultatif)" >

            <label for="signup-password">Mot de passe :</label>
            <input id="signup-password" type="password" v-model="newUser.password" placeholder="Mot de passe" required>

            <label for="signup-password-verification">Vérification du mot de passe :</label>
            <input id="signup-password-verification" v-model="passwordVerif" type="password" placeholder="Vérifier mot de passe" required>

            <label for="signup-email">Email :</label>
            <input id="signup-email" type="email" v-model="newUser.email" placeholder="Email" required>

            <div class="error-message">{{errorMessage}}</div>

            <button id="signup-btn" type="submit">S'inscrire</button>
        </form>
        <div class="log-alternatives">  
            <span>Vous avez déjà un compte ?</span> 
            <router-link to="/">Se connecter</router-link> 
        </div>
    </div>
</template>

<script>
import Users from "../services/users.js";

export default {
    name: 'SignupForm',

    data() {
        return {
            newUser : {
                lastname: "",
                firstname: "",
                pseudo: "",
                email: "",
                password: "",
            },
            passwordVerif: "",
            errorMessage: null
        };
    },

    methods: {
        async signup(){
            try {
                if(this.newUser.password === this.passwordVerif){
                    const response = await Users.signup(this.newUser);
                    this.$store.dispatch("setMsg", response.data.message) ;
                    this.$store.dispatch("logIn", response.data) ;
                    this.$router.push("/");
                }else{
                    throw "Les mots de passe ne correspondent pas" ;
                }
            } catch (error) {
                this.errorMessage = error.response ? error.response.data.error : "Une erreur s'est produite." ;
                this.isValid = false;
            }
        }
    }
}
</script>

<style scoped>
    .wrapper{
        max-width: 500px;
        margin: 90px auto;
    }

    nav{
        font-size: 1.05rem;
        margin: 20px;
    }

    form{
        display: flex;
        flex-direction: column;
    }

    form label{
        color: rgba(0, 0, 0, .5);
        margin: 10px;
    }

    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
    }


    label{
        font-size: 0.8rem;
        font-weight: bold;
        color: rgb(109, 109, 109);
        text-align: left;
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }

    .log-alternatives{
        margin-top:30px;
    }

    .log-alternatives > * {
        padding: 0 5px  ;
    }
        
</style>
<template>
    <div class="wrapper">
        <form @submit.prevent = login()>

            <label for="login-email">Email :</label>
            <input id="login-email" type="text" placeholder="Email" required v-model="email">
            
            <label for="login-password">Mot de passe :</label>
            <input id="login-password" type="password" placeholder="Mot de passe" required v-model="password">

            <div class="error-message">{{message}}</div>

            <button id="login-btn" :disabled="!isValid" type="submit">Connexion</button>
        </form>
        <div> 
            <span>Vous n'avez pas encore de compte ?</span> 
            <router-link to="/signup"  >S'inscrire</router-link>            
        </div>
    </div>
</template>

<script>
import Users from "../services/users.js";

export default {
    name: 'LoginForm',

    data() {
        return {
            email: "",
            password: "",
            isValid: true,
            errorMessage: null,
            message: null,
        };
    },

    methods: {
        async login() {
            try {
                const response = await Users.login({
                    email: this.email,
                    password: this.password,
                });
                this.message = response.data.message;
                this.$store.dispatch("logIn", response.data);
            } catch (error) {
/*                this.errorMessage = error.response.data.error;*/
                this.isValid = false;

                if (error.response.status === 404) {
                    this.errorMessage = "Utilisateur inconnu.";
                }
                if (error.response.status === 401) {
                    this.errorMessage = "Email ou mot de passe invalide.";
                }
                if (error.response.status === 500) {
                    this.errorMessage = "Erreur serveur.";
                }
/*                setTimeout(() => {
                    this.email= "";
                    this.password= "";
                    this.errorMessage = "";
                }, 500);
*/
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

    img{
        width: 100%;
    }

    nav{
        font-size: 1.05rem;
        margin: 20px;
    }

    .active{
        color: red;
        font-weight: bold;
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

    #login-btn{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }

    #login-btn:hover{
        transform: scale(1.025);
    }

    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
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
    
</style>
<template>
    <div class="wrapper">
        <form @submit.prevent = login()>

            <label for="login-email">Email :</label>
            <input id="login-email" type="text" placeholder="Email" required v-model="email">
            
            <label for="login-password">Mot de passe :</label>
            <input id="login-password" type="password" placeholder="Mot de passe" required v-model="password">

            <div class="error-message">{{errorMessage}}</div>

            <button id="login-btn"  type="submit">Connexion</button>
        </form>
        <div class="log-alternatives"> 
            <span>Vous n'avez pas encore de compte ?</span> 
            <router-link to="/signup"  >Créer un compte</router-link>            
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
            errorMessage: null,
        };
    },

    methods: {
        async login() {
            try {
                const response = await Users.login({
                    email: this.email,
                    password: this.password,
                });
                this.$store.dispatch("setMsg", response.data.message) ;
                this.$store.dispatch("logIn", response.data);
            } catch (error) {
                this.errorMessage = error.response.data.error;
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
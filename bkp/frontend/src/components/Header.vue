<template>
    <div class="header">
        <router-link to='/'>
            <img src="/assets/logos/icon-above-font.png" alt="Groupomania logo">
        </router-link>

        <nav v-if="$store.state.isLoggedIn">
            <router-link :to="{ name: 'Profile', params: { id: user.userId } }">
                <div>Mon compte</div>
            </router-link>
            <div id="logOut-btn"  @click = "logOut" >Se déconnecter</div>
        </nav>
        <nav v-else>
            <router-link to="/" class="active">Se connecter</router-link> | <router-link to="/signup"  >S'inscrire</router-link>
        </nav>
    </div> 
 
</template>

<script>
export default {
    name: 'Header',

    computed: {
        user() {
        return this.$store.getters.user;
        }
    },
    
    methods: {
        logOut: function() {
        this.$store.dispatch("logOut");
        },
    }
}
</script>

<style scoped>
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 70px 20px 70px;
    }

    .header img{
        width: 250px;
        height: auto;
    }

    nav{
        display: flex;
    }

    nav div{
        margin-left: 30px;
        font-weight: bold;
        cursor: pointer;
        transition-duration: .2s;
    }

    .fas{
        font-size: 1.5rem;
    }

    nav div:hover{
        color: rgb(117, 117, 117);
    }

    @media (max-width: 670px) {
        .header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>
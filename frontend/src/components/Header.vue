<template>
    <div class="header">
        <router-link to='/'>
            <img src="@/assets/logos/icon-above-font-transparent.png" alt="Groupomania logo">
        </router-link>

        <nav v-if="$store.state.isLoggedIn">
            <router-link :to="{ name: 'User', params: { id: $store.state.userLoggedIn.userId } }">
                <div>Mon compte</div>
            </router-link>
            <div id="logOut-btn"  @click = "logOut" >Se déconnecter</div>
        </nav>
        <nav v-else>
            <router-link to="/" class="active"><div>Se connecter</div></router-link> <router-link to="/signup"  ><div>S'inscrire</div></router-link>
        </nav>
    </div> 
 
</template>

<script>
export default {
    name: 'Header',
    
    methods: {
        logOut: function() { 
            this.$store.dispatch("logOut");
            this.$router.push("/");
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


    @media (max-width: 670px) {
        .header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>
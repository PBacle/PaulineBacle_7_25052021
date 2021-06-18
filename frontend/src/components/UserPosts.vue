<template>
    <div class="posts-wrapper">
        <h2>
            <span v-if="typeList == 'postsLikedById'"> Les posts que <span v-if="!isCurrentUser">{{userDisplayed}} a</span><span v-else>vous</span> likés :</span>
            <span v-else><span v-if="!isCurrentUser">Les</span><span v-else>Vos</span> posts <span v-if="!isCurrentUser">de {{userDisplayed}}</span> :</span>
        </h2>

        <ul v-if="posts.length != 0"> 
            <li v-for = "post in posts" :key="post.id">
                <article class="post" >
                 <router-link :to="{ name: 'OnePost', params: { id: post.id } }"> 
                    <h3 class="post-title">{{post.title}}</h3>
                    <div class="post-content" v-html="characterLimit(post.content)"></div>
                 </router-link> 
                </article>
            </li>
        </ul>
        <p class="italic" v-else>
            <span v-if="typeList == 'postsLikedById'"><span v-if="!isCurrentUser">{{userDisplayed}} n'a</span><span v-else>Vous n'avez</span> pas encore liké de posts.</span>
            <span v-else><span v-if="!isCurrentUser">{{userDisplayed}} n'a</span><span v-else>Vous n'avez</span> pas encore rien posté<span v-if="!isCurrentUser">.</span><span v-else> : cliquez <router-link :to="{ name: 'Home'}">ici</router-link> pour ajouter votre premier post !</span></span>
        </p>
    </div>

</template>

<script>
export default {
    name: 'UserPosts',

    props: {
        typeList: { type: String, required: true, },
        userDisplayed: { type: String, required: true, },
        isCurrentUser: { type: Boolean, required: true, },
    }, 

    computed:{
        posts() {  return this.fetchData()  },
    },

    methods: {
        fetchData(){
            if(this.typeList == "postsById"){
                return this.$store.getters.postsById(parseInt(this.$route.params.id,10))  ;
            }else if(this.typeList == "postsLikedById"){
                return this.$store.getters.postsLikedById(parseInt(this.$route.params.id,10))  ;
            }
        },

        characterLimit(content){
            let text = content;
            const maxLength = 300;
            if(text.length > maxLength){
                return text.substring(0, maxLength - 3) + "...";
            }
            else{
                return text;
            }
        },

    },

}
</script>

<style scoped>

    .posts-wrapper{
        padding: 25px 0;
    }

    .post{
        padding: 20px 20px 20px 30px;
        border-left: 5px solid red;
        margin-top: 20px;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
    }

    .post-title{
        margin-top: 0;
        white-space : nowrap;
        overflow : hidden;
        text-overflow :    ellipsis;
    }

    .post-content{
        margin: auto;
        height: 20px;
        white-space : nowrap;
        overflow : hidden;
        text-overflow :    ellipsis;
    }

    .post:hover{
        box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2);
    }

    ul{
        padding:0
    }

</style>
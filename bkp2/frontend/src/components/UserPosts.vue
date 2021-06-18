<template>
            <ul> 
                <li v-for = "post in posts" :key="post.id">
                    <article class="post" >
                         <router-link :to="{ name: 'OnePost', params: { id: post.id } }"> 
                            <h3 class="post-title">{{post.title}}</h3>
                            <div class="post-content" v-html="characterLimit(post.content)"></div>
                        </router-link> 
                    </article>
                </li>
            </ul>


</template>

<script>
/*import axios from 'axios';*/

export default {
    name: 'UserPosts',

    props: {
        typeList: {
        type: String,
        required: true, 
        }
    }, 

    computed:{
               posts() { return this.fetchData()},
 //       posts() { return this.$store.getters.posts},
//      user() { return this.$store.getters.userLoggedIn; },
//      userDisplayed() { 
//        return this.$store.getters.user;
//        return this.$store.getters.users.find(item => item.userId == this.$route.params.id );
//      },

    },

    mounted() {
 //       this.fetchData();
    },

    methods: {

        fetchData(){

            if(this.typeList == "OwnPosts"){
                return this.$store.getters.posts.filter(post => post.userId == this.$route.params.id ) ;
//                this.$store.dispatch("getPostsByUserId", this.$route.params.id);
            }else if(this.typeList == "LikedPosts"){
//                this.$store.dispatch("getLikedPostsByUserId", this.$route.params.id);
                return this.$store.getters.posts.filter(post => this.checkLike(post.hasLikedList, this.$route.params.id) )  ;

            }
        },

        checkLike(likes,userId){
            userId = parseInt(userId, 10);
            var include = false;
            if(likes) {
                const users = likes.split(",") ;
                for(var i=0; i<users.length; i++) { users[i] = parseInt(users[i], 10); } 
                include =  users.includes(userId) ;
            }
            return include ;
        },

        characterLimit(content){
            let text = content;
            const maxLength = 350;
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
    .UserPost{
        margin: 30px auto;
        max-width: 800px;
    }

    .post{
        padding: 20px 20px 20px 30px;
        border-left: 5px solid red;
        margin-top: 20px;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
        transition-duration: .1s;
    }

    .post:hover{
        box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2);
    }

</style>
<template>

    <div class="feed"  v-if="$store.state.isLoggedIn">
        <div v-if="posts.length != 0" >
            <section class="feed_hot">
                <h2>Les + récents</h2>
                <ul class="posts">
                    <li  v-for = "post in posts.slice(0, 2)" :key="post.id">
                        <article class="post">
                            <router-link :to="{ name: 'OnePost', params: { id: post.id } }"> 
                                <div class="post-header">
                                    <h3 class="post-title">{{post.title}}</h3>
                                    <button class="post-delete" v-if="post.userId == user.userId || user.admin == 1" @click.prevent="deletePost(post.id)">Supprimer</button> 
                                </div>
                                <div class="post-infos italic">Posté le {{dateFormat(post.creationDate)}} par {{showPseudo(post)}}</div>  
                                <div class="post-content" v-html="characterLimit(post.content)"></div>
                                <div class="post-footer">
                                    <div class="infos-likes icon" @click.prevent="likePost(post.id)" v-bind:class="checkLike(post.hasLikedList,user.userId)" >{{ nb(post.hasLikedList) }}</div>
                                    <div class="infos-comments icon disabled"  >{{nb(post.hasCommentedList)}}</div> 
                                </div>
                            </router-link> 
                        </article>
                    </li>
                </ul>
            </section>
            <section class="feed_all">
                <h2>Le fil d'actualité</h2>
                <ul class="posts" v-if="allVisible">
                    <li  v-for = "post in limitPosts" :key="post.id">
                        <article class="post">
                            <router-link :to="{ name: 'OnePost', params: { id: post.id } }"> 
                                <div class="post-header">
                                    <h3 class="post-title">{{post.title}}</h3>
                                    <button class="post-delete" v-if="post.userId == user.userId || user.admin == 1" @click.prevent="deletePost(post.id)">Supprimer</button> 
                                </div>
                                <div class="post-infos italic">Posté le {{dateFormat(post.creationDate)}} par {{showPseudo(post)}}</div>  
                                <div class="post-content" v-html="characterLimit(post.content)"></div>
                                <div class="post-footer">
                                    <div class="infos-likes icon" @click.prevent="likePost(post.id)" v-bind:class="checkLike(post.hasLikedList,user.userId)" >{{ nb(post.hasLikedList) }}</div>
                                    <div class="infos-comments icon disabled"  >{{nb(post.hasCommentedList)}}</div> 
                                </div>
                            </router-link> 
                        </article>
                    </li>
                </ul>
                <button @click="limit += step" v-bind:disabled="limit> posts.length-1">{{showText}}</button>
            </section>
        </div>
        <p class="error-message page404" v-else> Sois le premier à publier un post ! </p>

    </div>

</template>

<script>

export default {
    name: 'Feed',

    data(){
        return {
            limit:2,
            step:2,
            showText:"Voir plus",
        }
    },

    computed: {
        posts() { return this.$store.getters.posts},
        user() { return this.$store.getters.userLoggedIn; },
        limitPosts(){
            return this.limit ? this.posts.slice(0,this.limit) : this.posts
        },
        allVisible(){
            return this.limit ? true : false ; 
        }
    },

    mounted() {
        if(this.$store.state.isLoggedIn) this.$store.dispatch("getPosts");
    },

    methods: {
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

        showPseudo(post){
            var pseudo = null ; 
            if(post){
                pseudo = post.pseudo ? post.pseudo : post.firstname + " " + post.lastname 
            }
            return pseudo
        },

        checkLike(likes,userId){
            var include = false;
            if(likes) {
                const users = likes.split(",") ;
                for(var i=0; i<users.length; i++) { users[i] = parseInt(users[i], 10); } 
                include =  users.includes(userId) ;
            }
            return include ?   'likedByUser post-like-btn' : 'post-like-btn'
        },

        nb(list){
            return list? list.split(",").length : 0;
        },
        
        dateFormat(date){
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        },

        deletePost(id) {
            this.$store.dispatch("deletePost", id);
        },

        likePost(id) {
            this.$store.dispatch("likePost", {
                id:id,
                isOneVue:false});
        },
    },

}
</script>

<style scoped>
section{
    margin: 60px auto;
}

h2{
    margin-bottom: 60px;

}
    .posts{
        margin: 0 auto;
        padding: 20px;
        max-width: 800px;
    }

    .post{
        position: relative;
        padding: 20px 20px 20px 30px;
        margin-bottom: 30px;
        border-left: 5px solid red;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
        transition-duration: .1s;
    }

    .post:hover{
        box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2);
    }

    .post-header{
        display: flex;
        justify-content: space-between;
        color: rgb(0, 0, 0);
        font-size: .8rem;
    }


    .post-footer{
        display: flex;
        justify-content: flex-end;
    }

    .post-title{
        color: red;
        margin-right: 20px;
    }

    .post-content{
        margin: 20px 0;
    }
</style>
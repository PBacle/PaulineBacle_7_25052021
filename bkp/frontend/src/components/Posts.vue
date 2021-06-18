<template>

    <div class="feed" v-if="posts.length != 0" >
        <section class="feed_hot">
            <h2>Les + récents</h2>
            <ul>
                <li>
                    <article class="post" v-for = "post in posts.slice(0, 2)" :key="post.id">
                         <router-link :to="{ name: 'OnePost', params: { id: post.id } }"> 
                            <div class="post-header">
                                <span class="post-info">Posté le {{dateFormat(post.creationDate)}} par {{findPseudo(post.userId)}}</span>
                                 <button class="post-delete" v-if="post.userId == user.userId || user.admin == 1" @click.prevent="deletePost(post.id)">
                                    Supprimer
                                    </button> 
                            </div>  
                            <h3 class="post-title">{{post.title}}</h3>
                            <div class="post-content" v-html="characterLimit(post.content)"></div>
                            <div class="post-footer">
                                <div class="post-footer-likes ">
                                    {{ nb(post.hasLikedList) }}
                                    <button  @click.prevent="likePost(post.id)" 
                                            v-bind:class="checkLike(post.hasLikedList,user.userId)">
                                        J'aime</button> 
                                </div>
                                <div class="post-footer-coments "> <span v-if="nb(post.hasCommentedList) != 0">{{nb(post.hasCommentedList)}}</span><span v-else>Pas de</span> commentaire<span v-if="nb(post.hasCommentedList) > 1 || nb(post.hasCommentedList) == 0 ">s</span> </div>
                            </div>
                        </router-link> 
                    </article>
                </li>
            </ul>
        </section>
        <section class="feed_all">
            <h2>Le fil d'actualité</h2>
            <ul v-if="allVisible">
                <li>
                    <article class="post" v-for = "post in limitPosts" :key="post.id">
                         <router-link :to="{ name: 'OnePost', params: { id: post.id } }">
                            <div class="post-header">
                                <span class="post-info">Posté le {{dateFormat(post.creationDate)}} par {{findPseudo(post.userId)}}</span>
                                 <button class="post-delete" v-if="post.userId == user.userId || user.admin == 1" @click.prevent="deletePost(post.id)">
                                    Supprimer
                                    </button> 
                            </div>  
                            <h3 class="post-title">{{post.title}}</h3>
                            <div class="post-content" v-html="characterLimit(post.content)"></div>
                            <div class="post-footer">
                                <div class="post-footer-likes ">
                                    {{ nb(post.hasLikedList) }}
                                    <button  @click.prevent="likePost(post.id)" 
                                            v-bind:class="checkLike(post.hasLikedList,user.userId)">
                                        J'aime</button> 
                                </div>
                                <div class="post-footer-coments "> <span v-if="nb(post.hasCommentedList) != 0">{{nb(post.hasCommentedList)}}</span><span v-else>Pas de</span> commentaire<span v-if="nb(post.hasCommentedList) > 1 || nb(post.hasCommentedList) == 0 ">s</span> </div>
                            </div>
                        </router-link>
                    </article>
                </li>
            </ul>
            <button @click="increaseLimit()" v-bind:disabled="limit> posts.length-1">{{showText}}</button>
        </section>
    </div>
    <p v-else> Sois le premier à publier un post ! {{ user }} {{ users }}  {{ posts }} </p>
</template>

<script>
export default {
    name: 'Feed',

    data(){
        return {
            limit:null,
            allVisible:false,
            showText:"Voir plus",
        }
    },

    computed: {
        posts() { return this.$store.getters.posts},
        users() { return this.$store.getters.users; },
        user() { return this.$store.getters.userLoggedIn; },
        limitPosts(){
            return this.limit ? this.posts.slice(0,this.limit) : this.posts
        }
    },

    mounted() {
        this.$store.dispatch("getPosts");
        this.$store.dispatch("getUsers");
    },

    methods: {
        increaseLimit(){
            this.limit += 1 ;
            if(this.limit) this.allVisible = true ;
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

        findPseudo(userId){
            var pseudo = null ; 
            if(this.users.length != 0 ){
                pseudo = 
                    this.users.find(item => item.userId === userId ).pseudo ?
                    this.users.find(item => item.userId === userId ).pseudo : 
                    this.users.find(item => item.userId === userId ).firstname + " " + this.users.find(item => item.userId === userId ).lastname 
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
        dateFormat(date){
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        },

        deletePost(id) {
            this.$store.dispatch("deletePost", id);
        },

        nb(list){
            return list? list.split(",").length : 0;
        },

        likePost(id) {
            const data = 1;
            this.$store.dispatch("likePost", {
                id: id,
                data: data,
            });
            this.$store.dispatch("getPosts");
        },
    },

}
</script>

<style scoped>
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

.likedByUser{
    color: blue ;
}

ul{
    list-style: none;
}

    .post:hover{
        box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2);
    }

    .post h2{
        margin-top: 7px;
    }

    .post-header{
        display: flex;
        justify-content: space-between;
        color: rgb(0, 0, 0);
        font-size: .8rem;
    }

    .post-modify{
        color: rgb(219, 17, 17);
        font-size: 1rem;
        font-weight: bold;
    }

    .post-title{
        color: red;
    }

    .post-content{
        font-size: .9rem;
    }
</style>
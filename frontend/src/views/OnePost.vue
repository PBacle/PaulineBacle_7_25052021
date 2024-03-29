<template>
    <Header />

    <button @click="getBackToFeed">Retour au fil d'actualité</button>

    <div class="error-message page404" v-if="!modify" >{{errorMessage}}</div>

    <div class="onePost" v-if="isVisible && $store.state.isLoggedIn ">
         <div class="post-wrapper" v-if="!modify">
            <h2 class="post-title">{{post.title}}</h2>

            <p class="post-infos italic">Posté le {{dateFormat(post.creationDate)}} par <router-link :to="{ name: 'User', params: { id: post.userId } }"> {{showPseudo(post)}}</router-link> </p>

            <figure>
                <img v-if="post.imgUrl" :src="post.imgUrl" >
                <figcaption class="post-content">{{post.content}}</figcaption>
            </figure>
            
            <div class="post-infos-comments">
                    <div class="infos-likes icon" @click.prevent="likePost(post.id)"  v-bind:class="likes.userLiked">{{ likes.nb }}</div>
                    <div class="infos-comments icon" @click="addCommentVisible = true">{{comments.length}}</div> 
            </div>
            
        </div>

        <form class="modify-wrapper" v-if="modify">
            <label for="modify-title">Modifier le titre :</label>
            <input type="text" id="modify-title" required v-model="post.title">

            <label for="modify-content">Modifier le contenu :</label>
            <textarea id="modify-content" required  v-model="post.content"></textarea>
            <div>
                <div class="button-panel" v-if="!post.imgUrl || (post.imgUrl && deleteImg)">
                    <button  @click.prevent="withImage = !withImage" ><span v-if="!withImage">Ajouter une image</span><span v-else>Sans image</span></button>
                </div>
                <div class="button-panel" v-else-if="post.imgUrl && !deleteImg">
                    <button  @click.prevent="withImage = true" >Modifier l'image</button>
                    <button  @click.prevent="deleteImgPost()" >Supprimer l'image</button>
                </div>

                <div v-if="withImage" >
                    <label for="image" class="pr-2">Image</label>
                    <input
                        @change="uploadImage"
                        type="file"
                        accept="image/png, image/jpeg,
                        image/bmp, image/gif"
                        ref="file"
                        id="image"
                    />
                </div>
            </div>
        </form>

        <div class="error-message" >{{errorMessage}}</div>

        <div class="button-panel">
            <button v-if="(post.userId == user.userId || user.admin == 1) && !modify" @click="modify = true">Modifier</button>
            <button v-if="modify" @click="cancelUpdatePost()">Annuler</button>
            <button v-if="modify" @click="updatePost(post.id)">Publier les modifications</button>
            <button v-if="post.userId == user.userId || user.admin == 1"  @click.prevent="deletePost(post.id)">Supprimer le post</button>
            <button v-if="comments.length != 0 && !modify" @click="showComments = !showComments"><span v-if="!showComments">Voir</span><span v-else>Cacher</span> le<span v-if="comments.length != 1">s</span> commentaire<span v-if="comments.length != 1">s</span></button>
        </div>

        <div class="comments-wrapper" >
            <form class="add-comment" v-if="addCommentVisible">
                <div class="dd-comment-content">
                    <label for="add-comment-content">Ecrivez votre commentaire :</label>
                    <textarea required id="add-comment-content" v-model="newComment" placeholder="Merci pour ce post !"></textarea>
                </div>
                <div class="button-panel">
                    <button v-if="addCommentVisible" @click.prevent="addComment()">Publier le commentaire</button>
                    <button v-if="addCommentVisible" @click.prevent="cancelAddComment()">Annuler</button>
                </div>
            </form>

            <ul v-if="!modify && showComments">
                <li v-for = "comment in comments" :key="comment.id">
                    <article class="comment" >
                        <div class="comment-header">
                            <span class="comment-info italic">Posté le {{dateFormat(comment.creationDate)}} par <router-link :to="{ name: 'User', params: { id: comment.userId } }"> {{showPseudo(comment)}}<span v-if="comment.userId == post.userId" class="active"> (auteur)</span></router-link></span>
                            <button class="comment-delete absolute-top-right" v-if="comment.userId == user.userId || user.admin == 1" @click.prevent="deleteComment(comment.id)">Supprimer</button> 
                        </div>  
                        <div class="comment-content">{{comment.content}}</div>
                    </article>
                </li>
            </ul>
        </div>

    </div>
    
</template>

<script>
import Header from '@/components/Header.vue';

export default {
    name: 'OnePost',

    components: {
        Header,
    },

    data(){
        return{
            modify: false,
            withImage: false,
            showComments:false,
            addCommentVisible : false,
            newComment:'',
            file:'',
            deleteImg:false,
            errorMessage:'',
            isValid:false,
            isVisible:true,
        }
    },

    computed: {
        post() { 
            return this.$store.getters.post; },
        user() { return this.$store.getters.userLoggedIn; },
        likes() {
            return {
                nb : this.nb(this.post.hasLikedList),
                userLiked : this.checkLike(this.post.hasLikedList, this.user.userId)
            }
        },
        comments(){ return this.$store.getters.comments;}
    },

    mounted() {
        this.$store.dispatch("getPostById",this.$route.params.id)
            .then(() => {
                this.$store.dispatch("getComments",this.$route.params.id)
                .then(() => {
                    this.isVisible=true;
                })
                .catch((error) => {
                    this.errorMessage = error ;
                    this.isVisible=false;
                } ) ;
            })
            .catch((error) =>{
                this.errorMessage = error;
                this.isVisible=false;
            });
    },

    methods: {
        getBackToFeed() {
            this.$router.push("/");
        },
            
        nb(list){ return list? list.split(",").length : 0; },

        dateFormat(date){
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        },

        showPseudo(post){
            var pseudo = null ; 
            if(post){
                if(!post.firstname && !post.lastname){
                    pseudo = "Utilisateur supprimé"
                }else{
                    pseudo = post.pseudo ? post.pseudo : post.firstname + " " + post.lastname 
                }
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

        likePost(id) {
            this.$store.dispatch("likePost", {
                id:id,
                isOneVue:true})
            .then(() =>{
                this.errorMessage = "";                
            })
            .catch((error) => this.errorMessage = error )
        },

        uploadImage() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },

        deleteImgPost(){
            this.deleteImg = true ;
            this.withImage = false;
        },

        updatePost(postId){
          const areEmpty = this.checkRequired(this.post, {
              'content' : 'Le contenu du post', 
              'title' : 'Le titre du post'})  ;
          this.isValid = areEmpty.length != 0 ? false : true ; 

          if(this.isValid){
            const formData = new FormData();
            formData.set("title", this.post.title);
            formData.set("content", this.post.content);
            if (this.withImage && this.file) {
                formData.set("typeFile", "post");
                formData.set("image", this.file); 
            }else if(this.deleteImg) {
                formData.set("typeFile", "post");
                formData.set("deleteImage", true) 
            }
            
            this.$store.dispatch("updatePost", {
                id : postId, 
                data : formData
                })
            .then(()=>{ 
                this.errorMessage = "";
                this.modify = false;
                this.deleteImg = false;
                this.withImage= false;
            })  
            .catch((error) => this.errorMessage = error )
          }else{
              areEmpty.forEach( item => { this.errorMessage += item + " ne doit pas être vide.\n" });
          }
        },

        cancelUpdatePost() {
            this.$store.dispatch("getPostById",this.$route.params.id)
            .then(() =>{
                this.errorMessage = "";
                this.modify =false;
                this.deleteImg = false ;
            })
            .catch((error) => this.errorMessage = error )
        },

        deletePost(id) {
            this.$store.dispatch("deletePost", id)
            .then(() =>{
                this.getBackToFeed() ; 
            })
            .catch((error) => this.errorMessage = error )
        },

        deleteComment(id) {
            this.$store.dispatch("deleteComment", id)
            .catch((error) => this.errorMessage = error )
        },

        addComment() {
            if(this.newComment != ''){
                this.$store.dispatch("commentPost", {
                    id : this.post.id, 
                    data : {content : this.newComment}
                })
                .then(()=>{ 
                    this.errorMessage = "";
                    this.addCommentVisible = false;
                    this.newComment='';
                    this.showComments = true;
                })
                .catch((error) => this.errorMessage = error )
            }else{
                this.errorMessage = "Le commentaire ne peut pas être vide.";
            }

        },

        cancelAddComment() {
            this.addCommentVisible = false ;
            this.newComment='' ;
            this.errorMessage = "";
        },

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
    }
}
</script>

<style scoped>
    /* Post style */
    .onePost{
        padding: 30px;
        margin: 0 auto ;
        max-width: 800px;
    }
    .post-wrapper{
        margin: 0 auto 30px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }

    .post-title {
        margin: 0;
        color: red;
        font-size: 2rem;
    }

    .post-content{
        font-size: 1.4rem; 
        margin: 30px 0;
        white-space: pre-line;
    }

    img{
        max-width: 100%;
    }

    /* Modify style */

    .modify-wrapper{
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }

    #modify-title {
        margin: 0;
        margin-bottom: 20px;
        color: red;
        font-size: 2rem;
    }

    #modify-content{
        margin-top: 20px;
        height: 200px;
        width: calc(100% - 22px);
        padding: 10px;
        resize: none;
        overflow-y: scroll;
    }

    #image{
        margin-top: 10px;
    }

    .delete-btn{
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

    .post-infos-comments{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .comments-wrapper{
        padding: 25px 0;
    }
    .comments-wrapper ul{
        padding: 0;
    }
    .comment{
        max-width: 80%;
        margin : 0 auto ;
        padding: 20px 20px 20px 30px;
        margin-top: 20px;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
    }

    .comment a{
        font-weight: bold;
    }

    .post-title{
        margin-top: 0;
    }

    .post:hover{
        box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2);
    }

    .comment-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    .comment-content{
        padding-top:10px;
        white-space: pre-line;

    }


    @media (max-width: 670px) {

        .comment-header{
            flex-direction: column-reverse;
        }
        .comment-delete{
            margin-bottom:20px;
        }

        .comment-content{
            text-align: center;
        }

    }

    .add-comment{
        border:1pt red solid;
        padding: 20px;
        margin: auto 30px ;
    }

    #add-comment-content{
        width: calc(100% - 30px - 30px) ;
        margin: 20px 30px   ;
        resize: vertical;

     }

</style>
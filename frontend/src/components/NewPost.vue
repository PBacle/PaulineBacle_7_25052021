<template>
  <div class="newPost">
      
    <div class="newPost-create-btn" @click="isVisible = !isVisible">Ajouter un nouveau post</div>

    <transition name="fade">
      <div class="overlay" v-if="isVisible">
          <div class="form-wrapper">
            <span class="form-close"  @click="clearForm()">Fermer</span>

            <h1> Que veux-tu partager aujourd'hui ?</h1>

            <form class="newPost-form"  @submit.prevent="sendNewPost()">

                <label for="newPost-title">Titre</label>
                <input id="newPost-title" v-model="title" type="text" placeholder="Titre de votre post..." required>

                <label for="newPost-content">Contenu</label>
                <textarea 
                            id="newPost-content" 
                            placeholder="Contenu de votre post..."
                            required
                            v-model="content"
                ></textarea>
                
                <div>
                    <button @click.prevent="withImage=!withImage" ><span v-if="!withImage">Ajouter une image</span><span v-else>Pas d'image</span></button>
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

                <p class="error">{{ errorMessage }}</p>
                <button  id="newPost-btn" type="submit" :disabled="!isValid">Publier</button>

            </form>
          </div>
      </div>
    </transition>

  </div>
</template>

<script>

export default {
    name: 'NewPost',

    data(){
        return{
            isVisible: false,
            withImage: false,
            isValid:true,
            title: "",
            content: "",
            file: "",
        }
    },

    computed: {
        errorMessage() { return this.$store.getters.error; },
    },

    methods: {
        clearForm(){
            this.isVisible = false;
            this.isValid = true;
            this.withImage= false;
            this.title= "";
            this.content= "";
            this.file= "";
            this.$store.dispatch("clearLog");
        },

        uploadImage() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },

        sendNewPost() {
            const formData = new FormData();
            formData.set("title", this.title);
            formData.set("content", this.content);
            formData.set("userId", this.$store.state.userLoggedIn.userId);    
            if (this.withImage && this.file !== null) { 
                formData.set("typeFile", "post");
                formData.set("image", this.file);
            }
            this.$store.dispatch("createPost", formData)
            .then(()=>{ 
                this.isValid = false;
                setTimeout(this.clearForm, 1000) 
                })
        },
    }
}
</script>

<style scoped> 

    .newPost{
        padding: 20px 20px 0px 20px ;   
    }

    .newPost-create-btn{
        margin: 30px auto;
        padding: 20px;
        border-radius: 30px;
        background-color: rgb(255, 34, 34);
        color: white;
        max-width: 750px;
        font-size: 1.5rem;
        transition-duration: 0.2s;
        cursor: pointer;
    }

    .newPost-create-btn:hover{
        transform: scale(1.02);
    }

    .overlay{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(31, 30, 30, 0.678);
        z-index: 1;
    }

    .form-wrapper{
        box-sizing: border-box;
        background-color: white;
        display: flex;
        flex-direction: column;
        padding: 5%;
        width: 800px;
        height: 80%;
        border-radius: 30px;
    }

    .form-close{
        cursor: pointer;
        align-self: flex-end;
    }

    .newPost-form{
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        text-align: left;
        margin-bottom: 30px;    
    }

    form label{
        color: red;
        font-weight: bold;
        font-size: 1.3rem;
        margin-bottom: 10px;
    }

    #newPost-content{
        height: 150px;
        width: calc(100% - 20px);
        padding: 10px;
        resize: none;
        overflow-y: scroll;
        margin-bottom: 30px;
    }

    #newPost-btn{
        margin-top: 20px;
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }

    /* Transition */
    .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>
<template>
    <div class="msg-panel">

        <transition name="fade" v-if="isVisible">
            <div class="overlay" >
              {{message}}
            </div>
        </transition>
    </div>

</template>

<script>

export default {
    name: 'MessagePanel',

    data(){
        return{
        }
    },

    props: {
        message: { type: String, required: true, },
    }, 

    computed:{
        isVisible(){
            return this.message ? true : false ;
        }
    },

    methods: {
    },

}
</script>

<style scoped>


    .overlay{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 100px;
        right:  30px;
        width: 400px;
        height: 100px;
        background-color: rgba(255,0,0,0.8);
        border-radius: 20px;
        z-index: 2;
                color: white;
                font-weight: bold ;
                font-size: 1.5em ;

    }

    /* Transition */
    .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }

</style>
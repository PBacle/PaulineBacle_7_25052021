<template>
    <div class="Profile">

        <Header v-if="$store.state.isLoggedIn"/>

        <UserProfile v-if="$store.state.isLoggedIn"/>
<!--          <UserPosts v-if="$store.state.isLoggedIn"/> -->
        
    </div>
</template>

<script>

import Header from '@/components/Header.vue';
import UserProfile from '@/components/UserProfile.vue';
//import UserPosts from '@/components/UserPosts.vue';

export default {
    name: 'Profile',

    components: {
        Header,
        UserProfile,
  //      UserPosts
     },
  }
</script>

<style scoped>

</style>
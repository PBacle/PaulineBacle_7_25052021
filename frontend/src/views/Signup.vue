<template>
  <div class="signup">

    <Header />

    <h1>Bienvenue sur le réseau interne de Groupomania</h1>

    <SignupForm/>

  </div>
</template>

<script>
import SignupForm from '@/components/SignupForm.vue';
import Header from '@/components/Header.vue';

export default {

  name: 'Signup',

  components: {
    Header,
    SignupForm,
  }

}
</script>

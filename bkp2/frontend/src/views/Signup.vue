<template>
  <div class="home">
    <Header />
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

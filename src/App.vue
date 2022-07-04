<script setup>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from '@firebase/auth';
import { ref } from "vue";
const token = ref("");
const unsubscribe = () => {
    onAuthStateChanged(auth, (user) => {
    token.value = user?.uid;
});
}
unsubscribe();
</script>
<template>
<main>
  <Navbar/>
  <Sidebar v-if="token"/>
  <router-view/>
</main>
</template>
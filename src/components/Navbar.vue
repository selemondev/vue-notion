<script setup>
import Notion from "../assets/notion-logo.png";
import { signOut } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
const token = ref("")
const router = useRouter();
const unsubscribe = () => {
    onAuthStateChanged(auth, (user) => {
    token.value = user?.uid;
});
}
unsubscribe();
const handleLogOut = async () => {
    await signOut(auth);
    router.push("/login");
};
</script>
<template>
<header>
    <nav class="flex-between px-3 w-full h-14 border-b border-gray-800 md:px-4">
        <div class="flex-between space-x-2">
            <img :src="Notion" alt="notion" class="w-10 h-10 md:h-12 md:w-12">
            <h1 class="font-bold text-white text-xl md:text-2xl">Notion</h1>
        </div>

        <div>
             <button class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-if="!token"><router-link to="/login">Sign In</router-link></button>
              <button @click="handleLogOut()" class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-else>Log Out</button>
        </div>
    </nav>
</header>
</template>
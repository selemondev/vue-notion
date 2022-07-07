<script>
export default {
    name: "Navbar",
    data() {
        return {
            mobile: false,
            mobileNav: null,
            windowWidth: null,
        }
    },
    created() {
        window.addEventListener("resize",this.checkScreenSize);
        return this.checkScreenSize();
    },
    methods: {
        rotate() {
            this.mobileNav = !this.mobileNav;
        },
        checkScreenSize() {
            this.windowWidth = window.innerWidth;
            if(this.windowWidth <= 768) {
                return this.mobile = true;
            } else {
                this.mobile = false;
                this.mobileNav = false;
            }
        }
    }
}
</script>
<script setup>
import { CheckCircleIcon, LightningBoltIcon, UserIcon } from "@heroicons/vue/outline";
import Notion from "../assets/notion-logo.png";
import { signOut } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
const token = ref("")
const router = useRouter();
const sidebarMenu = [
    {
        label : "My Tasks",
        Icon : CheckCircleIcon,
        path: "/"
    },
    {
        label: "Create",
        Icon: LightningBoltIcon,
        path: "/create"
    },
    {
        label: "Profile",
        Icon: UserIcon,
        path: "/profile"
    }
];
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

        <div v-show="!mobile">
             <button class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-if="!token"><router-link to="/login">Sign In</router-link></button>
              <button @click="handleLogOut()" class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-else>Log Out</button>
        </div>


          <div class="flex justify-center items-center space-x-2" v-show="mobile" >     
        <div :class="{'rotate' : mobileNav}" @click="rotate">
                <div class="box1"></div>
                <div class="box2"></div>
                <div class="box3"></div>
         </div>
         </div>

        <transition name="mobileNav" class="animation">
                <ul v-show="mobileNav" class="sidebar space-y-6 px-4 py-2">
                <div class="flex items-center space-x-2 border-b border-gray-700 py-2">
                    <img :src="Notion" alt="notion" class="w-10 h-10 md:h-12 md:w-12">
                    <h1 class="font-bold text-white text-xl md:text-2xl">Notion</h1>
                </div>

                <div v-for="menu in sidebarMenu" :key="menu.label" class="flex items-center space-x-2">
                <component :is="menu.Icon" class="w-7 h-7 text-gray-400 group-hover:text-white"/>
                 <li class="mobileNav-tags"><router-link :to="menu.path">{{menu.label}}</router-link></li>
                 </div>

               <div>
                 <button class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-if="!token"><router-link to="/login">Sign In</router-link></button>
                 <button @click="handleLogOut()" class="background-animate w-24 appearance-none focus:outline-none py-1 text-white rounded-md bg-gradient-to-r from-purple-800 to-pink-600 md:py-1.5" v-else>Log Out</button>
               </div>
            </ul>
        </transition>
    </nav>
</header>
</template>
<style scoped>
.mobileNav-enter-active,
.mobileNav-leave-active {
      transition: 1s ease all;
}
.mobileNav-enter-from,
.mobileNav-leave-to {
      transform: translateX(-250px);
    }
.mobileNav-enter-to {
      transform: translateX(0)
}
</style>
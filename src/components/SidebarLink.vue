<script setup>
import { CheckCircleIcon, LightningBoltIcon, UserIcon } from "@heroicons/vue/outline";
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
]
</script>
<template>
<main>
<div class="flex justify-center items-center animation-hover group text-xl space-x-3 xl:justify-start" v-for="menu in sidebarMenu" :key="menu.label">
    <component :is="menu.Icon" class="w-7 h-7 text-gray-400 group-hover:text-white"/>
    <h3 class="hidden xl:inline-block text-gray-400 group-hover:text-white"><router-link :to="menu.path">{{menu.label}}</router-link></h3>
</div>
</main>
</template>
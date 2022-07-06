<script setup>
import { CameraIcon } from '@heroicons/vue/outline';
import { ref as StorageRef, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import { updateDoc, doc, serverTimestamp, getDoc } from '@firebase/firestore';
import { db, auth, storage } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
import { ref, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import { useNotesStore } from '../stores/useNotes';
const toast = useToast();
const noteStore = useNotesStore();
// const currentUser = ref("");
const userData = ref([]);
const token = ref("");
const usernameValue = ref("");
const avatarValue = ref("");
const bioValue = ref("");
// const unsubscribe = onAuthStateChanged(auth, (user) => {
//     currentUser.value = user?.id;
//     noteStore.saveToken(currentUser.value);
// });
// unsubscribe();
console.log("Store: ", noteStore.notesData)
token.value = noteStore.notesData;
watchEffect(() => {
    getDoc(doc(db, "users", token.value)).then((docSnap) => {
        if(docSnap.exists()) {
            userData.value.push(docSnap.data());
            usernameValue.value = userData.value[0].username;
            bioValue.value = userData.value[0].bio;
            avatarValue.value = userData.value[0].avatar;
        }})
});
const bio = ref("");
const selectedImage = ref("");
const blob = ref("");
const username = ref("");
const loading = ref("")
const uploadProfile = () => {
    const target = event.target;
    const file = target.files[0];
    selectedImage.value = file;
    blob.value = URL.createObjectURL(file);
}

const handleCreateProfile = async () => {
    loading.value = true;
    if( selectedImage ) {
        try {
            const imageReference = StorageRef(storage, `profile/${new Date().getTime()}`)
            if(userData.avatarPath) {
                await deleteObject(StorageRef(storage, userData.avatarPath));
            };

            const snap = await uploadBytes(imageReference, selectedImage.value);
            const downloadProfileUrl = await getDownloadURL(StorageRef(storage, snap.ref.fullPath));
            await updateDoc(doc(db, "users", token.value), {
                avatar: downloadProfileUrl,
                avatarPath: snap.ref.fullPath,
                bio: bio.value,
                username: username.value || usernameValue.value,
                token: token.value
            });
             loading.value = false;
             setTimeout(() => {
                bio.value = "";
                username.value = "";
                selectedImage.value = "";
                blob.value = ""
             }, 1000);

             toast.success("Profile Created Successfully", {
                timeout: 4000
             });

              toast.success("Refresh the page to see your updated profile", {
                timeout: 6000
             });
        } catch(error) {
            console.log(error.message)
        }
        }
    }

const removeProfileImage = () => {
    blob.value = "";
}
</script>
<template>
<main class="left-margin grid-center mt-6 md:mt-8">
    <div class="max-w-sm w-72 sm:w-80 rounded-md">
        <form @submit.prevent="handleCreateProfile" class="w-full px-6 py-4 border border-gray-800">
        <div class="py-4 grid-center">
               <label class="text-base font-bold text-white md:text-2xl" v-if="bioValue">Profile Created</label>
            <label class="text-base font-bold text-white md:text-2xl" v-else>Create Your Profile</label>
        </div>

        <div class="py-4 grid-center">
            <label for="uploadProfile">
                <div v-if="blob">
                     <img :src="blob" alt="Blob" class="w-14 h-14 rounded-full md:w-20 md:h-20"/>
                </div>

                <div v-if="avatarValue">
                     <img :src="avatarValue" alt="avatar" class="w-14 h-14 rounded-full md:w-20 md:h-20"/>
                </div>

                <div v-if="!blob && !avatarValue">
                    <CameraIcon class="w-14 h-14 text-white cursor-pointer" />
                </div>
            </label>
            <input type="file" hidden name="uploadProfile" id="uploadProfile" @change="uploadProfile" accept="image/*">

            <div v-if="blob" class="py-2" @click="removeProfileImage()">
            <p class="text-red-500 font-bold cursor-pointer">Remove Profile Image</p>
            </div>
        </div>
        
        <div class="pb-3">
            <label for="username" class="label">Username</label>
            <input type="text" class="input-style" :placeholder="usernameValue" v-model="usernameValue" v-if="usernameValue"/>
            <input type="text" class="input-style" placeholder="Username" v-model="username" v-else required>
        </div>

        <div class="pb-3">
            <label for="bio" class="label">Bio</label>
            <input type="text" class="input-style" :placeholder="bioValue" v-model="bioValue" v-if="bioValue"/>
            <input type="text" class="input-style" placeholder="Make it interesting" v-model="bio" v-else required>
        </div>

        <div class="py-4">
              <button type="submit" class="background-animate w-full appearance-none focus:outline-none py-2.5 text-white rounded-lg bg-purple-500 md:py-3" :disabled="usernameValue" v-if="bioValue">Profile Created</button>
            <button type="submit" class="background-animate w-full appearance-none focus:outline-none py-2.5 text-white rounded-lg bg-gradient-to-r from-purple-800 to-pink-600 md:py-3" v-else>{{ loading ? 'Creating Your Profile...' : 'Create Your Profile'}}</button>
        </div>


        </form>
    </div>
</main>
</template>
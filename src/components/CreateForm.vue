<script setup>
import { CameraIcon, XIcon } from '@heroicons/vue/outline';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import { useToast } from "vue-toastification";
import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
const title = ref("");
const description = ref("");
const selectedImage = ref("");
const tag = ref("");
const member = ref("");
const loading = ref(false);
const blob = ref("");
const toast = useToast();
const fileUpload = () => {
    const target = event.target;
    const file = target.files[0];
    selectedImage.value = file
    blob.value = URL.createObjectURL(file);
};

const currentUser = auth.currentUser;
const handleSubmitNote = async () => {
  loading.value = true;

  let sentImage;
  const imageReference = storageRef(storage, `notes/${new Date().getTime()}`);
  const snap = await uploadBytes(imageReference, selectedImage.value);
  const downloadImageUrl = await getDownloadURL(storageRef(storage, snap.ref.fullPath));
  sentImage = downloadImageUrl;

  await addDoc(collection(db, "notes"), {
    id: currentUser.uid,
    note: title.value,
    completed: false,
    description: description.value,
    tag: tag.value,
    email: currentUser.email,
    member: member.value,
    media: sentImage || "",
    timeStamp: serverTimestamp()
  });

  loading.value = false;

  setTimeout(() => {
    title.value = "";
    description.value = "",
    tag.value = "",
    member.value = "",
    blob.value = "",
    selectedImage.value = ""
  }, 1000);

  toast.success("Note Created", {
    timeout: 4000
  });

  router.push("/tasks")
};

function removeSelectedImage() {
    blob.value = null;
};


</script>
<template>
<main>
<div class="max-w-md w-72 md:w-full">
<form class="w-full px-6 py-1 border border-gray-900 rounded-md" @submit.prevent="handleSubmitNote">
    <div class="grid-center text-base py-2 md:text-2xl">
        <h2 class="text-white">Create Note</h2>
    </div>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block tracking-wide text-white text-base mb-2 md:text-xl" for="grid-first-name">
        Title
      </label>
      <input class="input-style" id="grid-first-name" type="text" placeholder="Title" v-model="title">
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="block tracking-wide text-white text-base mb-2 md:text-xl" for="grid-last-name">
        Tag
      </label>
      <input class="input-style" id="grid-last-name" type="text" placeholder="e.g Frontend" v-model="tag">
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <label class="block tracking-wide text-white text-base mb-2 md:text-xl" for="grid-password">
        Description
      </label>
      <input class="input-style py-3" id="grid-description" placeholder="Description" v-model="description">
    </div>
  </div>
    <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block tracking-wide text-white text-base mb-2 md:text-xl" for="grid-first-name">
        Members
      </label>
      <input class="input-style" id="grid-first-name" type="text" placeholder="e.g John Doe" v-model="member">
    </div>
    <div class="w-full md:w-1/2 px-3 grid-center">
      <label class="block tracking-wide text-white text-base mb-2 md:text-xl" for="fileUpload">
       <div>
        <h4 class="block tracking-wide text-white text-base mb-2 md:text-xl">Add Photo</h4>
         <CameraIcon class="w-10 h-10 my-2 mx-4 md:w-12 md:h-12"/>
       </div>
      </label>
      <input type="file" hidden name="fileUpload" id="fileUpload" @change="fileUpload"/>
    </div>
  </div>

  <div v-if="blob" class="mb-4">
  <div class="py-2">
    <h2 class="text-white font-bold">Selected Member</h2>
  </div>
      <div class="relative">
                <div class="absolute w-8 h-8 bg-black bg-opacity-75 hover:bg-gray-800 rounded-full cursor-pointer flex items-center justify-center top-1 left-1">
                    <XIcon @click="removeSelectedImage()" class="h-4 w-4 text-white"/>
                </div>
                <img :src="blob" alt="image" width="200" height="200" class="rounded-full h-16 w-16">
    </div>
  </div>

  <div class="py-2">
     <button type="submit" class="w-full appearance-none focus:outline-none py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700 md:py-2">{{ loading ? "Creating Note ...." : "Create Note"}}</button>
  </div>
</form>
</div>
</main>
</template>
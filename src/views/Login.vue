<script setup>
import useVuelidate from "@vuelidate/core";
import { required, email as Email , helpers, minLength } from "@vuelidate/validators";
import { reactive, computed, ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc , doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "vue-router";
import { useNotesStore } from "../stores/useNotes";
const noteStore = useNotesStore()
const router = useRouter();
const formData = reactive({
    username: "",
  email: "",
  password: "",
});
const loading = ref(false);
const firebaseError = ref("")
const rules = computed(() => {
  return {
    username: { required: helpers.withMessage("Username cannot be empty", required)},
  email: { required: helpers.withMessage(" Email cannot be empty", required), Email },
  password: { required: helpers.withMessage(" Password cannot be empty", required), minLength: minLength(8) },
}
})

const v$ = useVuelidate( rules, formData );

const handleSubmit = async () => {
  const result = await v$.value.$validate();
  loading.value = true;
  try {
    if(result) {
      const response = await signInWithEmailAndPassword(auth, formData.email , formData.password);
      await updateDoc(doc(db, "users", response.user.uid), {
        online: true
      });
      noteStore.saveToken(response.user.uid);

      if(response.user.uid) {
        router.push("/")
      }
    };
    loading.value = false;
  } catch(error) {
    firebaseError.value = error.message
    setTimeout(() => {
      firebaseError.value = ""
    }, 1000)
  }
}

</script>
<template>
<section class="grid-center">
<div class="max-w-sm w-72 sm:w-96 mt-6 md:mt-10">
  <form class="bg-black rounded-md w-full px-6 py-3 shadow-md border border-gray-900" @submit.prevent="handleSubmit">
    <div class="grid-center pb-3">
      <h2 class="text-white font-bold text-xl md:text-2xl">Welcome Back </h2>
    </div>

    <div class="pb-3">
      <label for="username" class="label">Username</label>
      <input type="username" class="input-style" placeholder="Username" v-model="formData.username">
      <p v-if="v$.username.$error" class="error">{{ v$.username.$errors[0].$message}}</p>
    </div>

    <div class="pb-3">
      <label for="email" class="label">Email</label>
      <input type="email" class="input-style" placeholder="Email" v-model="formData.email">
       <p v-if="v$.email.$error" class="error">{{ v$.email.$errors[0].$message}}</p>
    </div>

    <div class="pb-3">
      <label for="password" class="label">Password</label>
      <input type="password" class="input-style" placeholder="Password" v-model="formData.password">
       <p v-if="v$.password.$error" class="error">{{ v$.password.$errors[0].$message}}</p>
       <p v-if="firebaseError" class="error">{{ firebaseError }}</p>
    </div>

    <div class="pb-2">
        <h4 class="text-white cursor-pointer text-sm md:text-lg">Don't have an account yet? <span class="text-purple-500 hover:text-purple-600"><router-link to="/register">Register</router-link></span></h4>
    </div>

    <div>
      <button type="submit" class="background-animate w-full appearance-none focus:outline-none py-2.5 text-white rounded-lg bg-gradient-to-r from-purple-800 to-pink-600 md:py-3">{{ loading ? "Signing In ..." : "Sign In"}}</button>
    </div>

  </form>
</div>
</section>
</template>
<script setup>
import useVuelidate from "@vuelidate/core";
import { required, email as Email , helpers, minLength, sameAs } from "@vuelidate/validators";
import { reactive, computed, ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "vue-router";
const router = useRouter();
const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});


const loading = ref(false);
const rules = computed(() => {
  return {
  username: { required: helpers.withMessage("Username cannot be empty", required)},
  email: { required: helpers.withMessage(" Email cannot be empty", required), Email },
  password: { required: helpers.withMessage(" Password cannot be empty", required), minLength: minLength(8) },
  confirmPassword:{required, sameAs: sameAs(formData.password)},
}
})

const v$ = useVuelidate( rules, formData );

const handleSubmit = async () => {
  const result = await v$.value.$validate();
  const username = formData.username;
  loading.value = true;
  try {
    if(result) {
      const response = await createUserWithEmailAndPassword(auth, formData.email , formData.password);
      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        email: response.user.email,
        username: username,
        createdAt: Timestamp.fromDate(new Date()),
        online: true
      });
    };
    router.push("/")
    loading.value = false;
  } catch(error) {
    console.log(error.message)
  }
}

</script>
<template>
<section class="grid-center">
<div class="max-w-sm w-72 sm:w-96 md:mt-6">
  <form class="bg-black rounded-md w-full px-6 py-3 shadow-md border border-gray-900" @submit.prevent="handleSubmit">
    <div class="grid-center pb-3">
      <h2 class="text-white font-bold text-xl md:text-2xl">Create Account</h2>
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
    </div>

    <div class="pb-4 md:pb-6">
      <label for="password" class="label">ConfirmPassword</label>
      <input type="password" class="input-style" placeholder="confirmPassword" v-model="formData.confirmPassword">
       <p v-if="v$.confirmPassword.$error" class="error">{{ v$.confirmPassword.$errors[0].$message}}</p>
    </div>

    <div>
      <button type="submit" class="background-animate w-full appearance-none focus:outline-none py-2.5 text-white rounded-lg bg-gradient-to-r from-purple-800 to-pink-600 md:py-3">{{ loading ? "Signing Up ..." : "Sign Up"}}</button>
    </div>

  </form>
</div>
</section>
</template>
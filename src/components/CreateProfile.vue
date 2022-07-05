<script setup>
import { CameraIcon } from '@heroicons/vue/outline';
</script>
<template>
<main>
    <form class="w-full max-w-lg">
        <div class="grid-center py-2">
            <h2 class="text-white text-xl md:text-2xl">Create Profile</h2>
    </div>

    <div className='grid-center'>
            <label htmlFor="uploadProfile">
                  <CameraIcon class="w-32 h-32 text-white"/>
            </label>
                <input
                type="file"
                accept="image/*"
                hidden
                @change="uploadProfile"
                />
    </div>
  <div class="flex flex-wrap -mx-3 mb-6 mt-2">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="label" for="grid-first-name">
        First Name
      </label>
      <input class="input-style" id="grid-first-name" type="text" placeholder="First Name">
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="label" for="grid-last-name">
        Last Name
      </label>
      <input class="input-style" id="grid-last-name" type="text" placeholder="Last Name">
    </div>
  </div>

    <div class="flex flex-wrap -mx-3 mb-6 mt-4">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="label" for="grid-country">
        Country
      </label>
      <input class="input-style" id="grid-city" type="text" placeholder="Country">
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="label" for="grid-city">
        City
      </label>
      <input class="input-style" id="grid-last-name" type="text" placeholder="City">
    </div>
  </div>

  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <label class="label" for="grid-bio">
        Bio
      </label>
      <input class="input-style" id="grid-bio" type="text" placeholder="Make it interesting">
    </div>
  </div>
    <div class="py-2">
     <button type="submit" class="w-full appearance-none focus:outline-none py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700 md:py-2">{{ loading ? "Creating Profile ... ...." : "Create Profile"}}</button>
  </div>
</form>
</main>
</template>
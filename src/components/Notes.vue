<script setup>
import { auth, db } from "../firebaseConfig";
import { collection, query, onSnapshot, orderBy } from "@firebase/firestore";
import { ref, watchEffect } from "vue";
const notes = ref([]);
watchEffect(() => {
    const notesReference = collection(db, "notes");
    const q = query(notesReference, orderBy("timeStamp", "desc"));
    const unsubscribe = onSnapshot(q, querySnapshot => {
        let notesData = [];
        querySnapshot.forEach(doc => {
            notesData.push({...doc.data(), id: doc.id})
        });
        notes.value = notesData;
    });

    return () => unsubscribe()
});
</script>
<template>
<main>
    <div v-for="note in notes" :key="note.note" class="bg-black rounded-md border border-gray-800 w-72 h-64 mt-4 px-4 space-y-6">
    <div class="mt-6">
    <span class="px-4 py-2 text-sm rounded-xl cursor-pointer bg-green-400 text-green-500 bg-opacity-30">
        {{note.tag}}
      </span>
    </div>

    <div>
        <h2 class="text-white font-bold">{{note.note}}</h2>
    </div>

    <div>
        <p class="text-gray-400">{{note.description}}</p>
    </div>
    </div>
</main>
</template>
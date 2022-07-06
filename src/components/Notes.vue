<script setup>
import { auth, db } from "../firebaseConfig";
import Note from "../assets/Note.svg";
import { onAuthStateChanged } from "firebase/auth";
import { FlagIcon, DotsVerticalIcon, TrashIcon, CheckIcon, XIcon } from "@heroicons/vue/outline";
import { collection, query, onSnapshot, where , orderBy, updateDoc, doc, deleteDoc } from "@firebase/firestore";
import { ref, watchEffect } from "vue";
import { useNotesStore } from "../stores/useNotes";
import Loader from "../components/Loader.vue";
import dayjs from 'dayjs';
const store = useNotesStore();
const currentUserToken = ref("");
currentUserToken.value = store.notesData;
const notes = ref([]);
const token = store.notesData;
const loading = ref(false);
watchEffect(() => {
    loading.value = true;
    const notesReference = collection(db, "notes");
    const q = query(notesReference, where("token", "in", [token]));
    const unsubscribe = onSnapshot(q, querySnapshot => {
        let notesData = [];
        querySnapshot.forEach(doc => {
            notesData.push({...doc.data(), id: doc.id})
        });
        notes.value = notesData;
        loading.value = false;
    });

    return () => unsubscribe()
});

const formateDate = (dateValue) => {
    const date = dayjs(dateValue);
    return date.format('dddd MMMM D, YYYY');
};

const completed = async (note) => {
    await updateDoc(doc(db,"notes", note.id), {
        completed: !note.completed
    })
};

const deleteNote = async (note) => {
    await deleteDoc(doc(db, "notes", note.id));
}

</script>
<template>
<main class="flex items-center flex-wrap">

    <div v-if="loading && notes.length > 0" class="mt-40 ml-28 sm:ml-80 md:ml-96">
         <Loader/>
    </div>

    <div v-else>

    <div v-if="notes.length === 0" class="mt-2 left-margin sm:ml-[150px] sm:mt-4 md:mt-10 xl:ml-72">
    <div>
        <img :src="Note" alt="Note" class="w-96 h-96">
    </div>
    <div class="grid-center">
        <button class="py-2 px-6 border border-purple-500 rounded-md text-white hover:text-bold hover:bg-purple-600 transition duration-200 ease-in md:px-10"><router-link to="/create">Create Note</router-link></button>
    </div>
    </div>

    <div class="flex items-center flex-wrap" v-else>
        <div v-for="note in notes" :key="note.id">
    <div class="bg-gray-600 bg-opacity-20 rounded-md border border-gray-800 w-72 max-h-xl my-4 px-4 space-y-4 sm:mx-2">
    <div class="flex-between mt-6">
        <div class="space-x-3">
        <span :class="[ note.tag === 'Frontend' ? 'px-4 py-2 text-sm rounded-xl cursor-pointer bg-green-400 text-green-500 bg-opacity-30' : 'px-4 py-2 text-sm rounded-xl cursor-pointer bg-purple-500 text-purple-600 bg-opacity-30']">
        {{note.tag}}
        </span>
        <span :class="[note.completed ? 'px-4 py-2 text-sm rounded-xl cursor-pointer bg-green-400 text-green-400 bg-opacity-30' : 'px-4 py-2 text-sm rounded-xl cursor-pointer bg-gray-400 text-gray-400 bg-opacity-30']">
        {{note.completed === false ? "pending" : "Complete"}}
      </span>
        </div>

    <span class="text-gray-400 hover:text-gray-200 cursor-pointer w-5 h-5"><DotsVerticalIcon/></span>
    </div>

    <div>
        <h2 :class="[note.completed ? 'text-white font-bold line-through' : 'text-white font-bold']">{{note.note}}</h2>
    </div>

    <div class="w-full h-32 overflow-y-auto scrollbar-hide">
        <p :class="[note.completed ? 'text-gray-400 text-sm line-through' : 'text-gray-400 text-sm']">{{note.description}}</p>
    </div>

    <div :class="[ note?.media === null ? '' : 'flex items-center space-x-3']">
        <p><FlagIcon class="w-5 h-5 text-gray-400"/></p>
        <p :class="[note.completed ? 'text-gray-400 line-through' : 'text-gray-400']">{{ formateDate(note.timeStamp?.toDate())}}</p>
    </div>

    <div class="flex items-center space-x-3" v-if="note?.media === null"></div>

    <div class="flex-between space-x-3" v-else>
        <div class="flex items-center space-x-3">
            <h3 :class="[note.completed ? 'text-gray-400 line-through' : 'text-gray-400']">Admin :</h3>
            <img :src="note.media" :alt="note.note" class="w-8 h-8 rounded-full" /> 
        </div>

        <div class="flex items-center space-x-3">
           <div @click="completed(note)">
             <XIcon v-if="note.completed" class="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer"/>
             <CheckIcon class="w-6 h-6 text-green-400 hover:text-green-600 cursor-pointer" v-else/>
           </div>
            <div @click="deleteNote(note)">
                <TrashIcon class="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer"/>
            </div>
        </div>
    </div>

    </div>
    </div>
    </div>
    </div>
</main>
</template>
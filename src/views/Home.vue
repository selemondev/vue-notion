<script setup>
import { useNotesStore } from '../stores/useNotes';
const store = useNotesStore();
console.log(store.notesData)
</script>

<template>
<p class="text-white left-margin">Hello Dashboard</p>
</template>

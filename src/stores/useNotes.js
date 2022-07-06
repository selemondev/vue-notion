import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
export const useNotesStore = defineStore({
  id: 'notes',
  state: () => {
		return {
			notesData: useStorage("token", ""),
		}
	},
  actions: {
    saveToken(token) {
      this.notesData = token
    }
  }
});

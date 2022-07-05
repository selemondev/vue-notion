import { defineStore } from 'pinia'

export const useNotesStore = defineStore({
  id: 'notes',
  state: () => {
		return {
			notesData: [],
		}
	},
  actions: {
    saveNotes(notes) {
      this.notesData = notes
    }
  }
});

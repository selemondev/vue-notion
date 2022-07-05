import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
		return {
			notes: [],
		}
	},
  actions: {
    token(response) {
      this.user_token = response
    }
  }
});

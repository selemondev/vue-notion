import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core';
export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
		return {
			user_token: useStorage("token", [])
		}
	},
  actions: {
    token(response) {
      this.user_token = response
    }
  }
});

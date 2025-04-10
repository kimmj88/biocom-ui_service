import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
    idToken: '' as string,
  }),
  actions: {
    setTokens(id: string, access: string) {
      this.accessToken = access;
      this.idToken = id;
    },
    logout() {
      this.accessToken = '';
      this.idToken = '';
    },
  },
});

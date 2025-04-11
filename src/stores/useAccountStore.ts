import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    id: 0 as number,
    email: '' as string,
    name: '' as string,
  }),
  actions: {
    setAccount(id: number, email: string, name: string) {
      this.id = id;
      this.email = email;
      this.name = name;
    },
    clearAccount() {
      this.id = 0;
      this.email = '';
      this.name = '';
    },
  },
});

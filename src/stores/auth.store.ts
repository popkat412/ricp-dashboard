import { defineStore } from "pinia";
import { Auth, getAuth, signInWithEmailAndPassword, User } from "firebase/auth";

interface AuthStoreState {
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    return { user: null } as AuthStoreState;
  },
  getters: {
    auth(): Auth {
      return getAuth();
    },
    isSignedIn(): boolean {
      return !!this.user;
    },
  },
  actions: {
    async signIn(email: string, password: string) {
      // todo: error handling
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.user = userCredential.user;
    },
  },
});

import { defineStore } from "pinia";
import {
  Auth,
  AuthError,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { e, Either } from "../utils";

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
    async signIn(
      email: string,
      password: string
    ): Promise<Either<UserCredential, AuthError>> {
      const res = await e<UserCredential, AuthError>(
        signInWithEmailAndPassword(this.auth, email, password)
      );

      const [userCredential] = res;

      if (userCredential) {
        this.user = userCredential.user;
      }

      return res;
    },
    async signOut(): Promise<void> {
      // todo: error handling
      await signOut(this.auth);
    },
  },
});

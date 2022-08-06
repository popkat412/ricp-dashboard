import { useAuth, useFirestore } from "@vueuse/firebase";
import {
  AuthError,
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed } from "vue";

import { e, Either } from "../utils";

export const useAuthStore = defineStore("auth", () => {
  // firebase stuff
  const auth = getAuth();
  const db = getFirestore();

  // vueuse/firebase stuff
  const { isAuthenticated, user } = useAuth(auth);

  const currentUserName = computed(() =>
    user.value ? useFirestore(doc(db, "users", user.value.uid)) : null
  );

  const signIn = async (
    email: string,
    password: string
  ): Promise<Either<UserCredential, AuthError>> => {
    return e(signInWithEmailAndPassword(auth, email, password));
  };

  const signOut = async (): Promise<AuthError | null> => {
    return (
      await e<undefined, AuthError>(firebaseSignOut(auth) as Promise<undefined>)
    )[1];
  };

  return {
    isAuthenticated,
    user,

    currentUserName,

    signIn,
    signOut,
  };
});

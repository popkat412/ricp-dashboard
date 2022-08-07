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
import type { IAdminDocument } from "../types/IAdminDocument";

export const useAuthStore = defineStore("auth", () => {
  // firebase stuff
  const auth = getAuth();
  const db = getFirestore();

  // vueuse/firebase stuff
  const { isAuthenticated, user } = useAuth(auth);

  const currentUserDocRef = computed(
    () => doc(db, "users", user.value?.uid ?? "dummy") // todo: see if there is any less scuffed way of doing this
  );
  const currentUserDoc = useFirestore(currentUserDocRef);

  const currentUserName = computed(() => {
    console.log("currentUserDoc.value", currentUserDoc.value);
    return currentUserDoc.value
      ? (currentUserDoc.value as IAdminDocument).name
      : null;
  });

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

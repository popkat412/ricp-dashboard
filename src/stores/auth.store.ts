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
    return currentUserDoc.value ? currentUserDoc.value.name : null;
  });

  /**
   * Admin sign in with email and password using firebase auth.
   * @param email
   * @param password
   * @throws
   */
  const signIn = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Admin sign out.
   * @throws
   */
  const signOut = (): Promise<void> => firebaseSignOut(auth);

  return {
    isAuthenticated,
    user,

    currentUserName,

    signIn,
    signOut,
  };
});

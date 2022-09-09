import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { useAuthStore } from "./auth.store";
import { Member } from "../types/Member";
import { Task } from "../types/Task";
import {
  FirebaseBaseHistoryEntry,
  FirebaseHistoryEntry,
  FirebaseManualHistoryEntry,
  FirebaseTaskHistoryEntry,
} from "../types/HistoryEntry";
import { useFirestoreCollection } from "../utils";

export type AddPointsData =
  | { id: string; change: number; message: string }
  | { id: string; task: Task };

export const usePointsStore = defineStore("points", () => {
  const db = getFirestore();

  const authStore = useAuthStore();

  const [members, finishedInitialLoad] = useFirestoreCollection(
    collection(db, "members"),
    (doc) => Member.fromId(doc.id)
  );

  // leaderboard entries, which is basically members sorted by points
  const leaderboardEntries = computed(() =>
    [...members.value].sort((a, b) => b.points - a.points)
  );

  // all history, aka collated histories from all the members
  const allHistory = computed(() => {
    // i love functional programming
    return members.value
      .flatMap((v) => v.history)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  /**
   * Add points. Remember to handle any thrown errors in the UI.
   * @param data
   * @throws
   */
  const addPoints = async (data: AddPointsData): Promise<void> => {
    const docRef = doc(db, "members", data.id);
    const newHistoryEntry = doc(collection(db, docRef.path, "history"));

    if (!(authStore.isAuthenticated && authStore.user?.uid)) {
      throw new Error("cannot modify points, not signed in as admin");
    }

    // check if member has completed task before
    if ("task" in data) {
      const member = await Member.fromId(data.id);

      if (member.hasCompletedTask(data.task)) {
        throw new Error(
          `member ${member.name} has already completed task ${data.task.title}`
        );
      }
    }

    type T = Omit<FirebaseBaseHistoryEntry, "_tag">;
    const baseFirebaseData: T = {
      adminId: authStore.user.uid,
      timestamp: Timestamp.fromDate(new Date()),
    };
    let firebaseData: FirebaseHistoryEntry;
    if ("task" in data) {
      // TaskHistoryEntry
      const x: Omit<FirebaseTaskHistoryEntry, keyof T> = {
        _tag: "task",
        taskId: data.task.id,
      };
      firebaseData = { ...baseFirebaseData, ...x };
    } else {
      const x: Omit<FirebaseManualHistoryEntry, keyof T> = {
        _tag: "manual",
        message: data.message,
        change: data.change,
      };
      firebaseData = { ...baseFirebaseData, ...x };
    }

    await setDoc(newHistoryEntry, firebaseData);

    // Kind of a hack but we increment a dummy value on the
    // doc such that it triggers the onSnapshot to fire
    // (because it doens't fire when a new document gets added to a subcollection).
    // This works because every time something changes in the onSnapshot,
    // I'm re-getting the entire thing from Firestore (using Member.fromId)
    await updateDoc(docRef, { dummy: increment(1) });
  };

  /**
   *
   * @param name name of the member to add
   * @throws
   */
  const addMember = async (name: string) => {
    await addDoc(collection(db, "members"), {
      name,
    });
  };

  return {
    finishedInitialLoad: readonly(finishedInitialLoad),
    members: readonly(members),
    leaderboardEntries,
    allHistory,

    addPoints,
    addMember,
  };
});

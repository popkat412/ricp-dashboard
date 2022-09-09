import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { useAuthStore } from "./auth.store";
import { FirebaseMember, Member } from "../types/Member";
import { Task } from "../types/Task";
import {
  FirebaseBaseHistoryEntry,
  FirebaseHistoryEntry,
  FirebaseManualHistoryEntry,
  FirebaseTaskHistoryEntry,
  TaskHistoryEntry,
} from "../types/HistoryEntry";
import { useSnackbar } from "vue3-snackbar";

export type AddPointsData =
  | { id: string; change: number; message: string }
  | { id: string; task: Task };

export const usePointsStore = defineStore("points", () => {
  const db = getFirestore();

  const authStore = useAuthStore();
  const snackbar = useSnackbar();

  const finishedInitialLoad = ref(false);

  // members
  const members = ref<Member[]>([]);
  onSnapshot(collection(db, "members"), async (snapshot) => {
    try {
      const removeMemberById = (id: string) => {
        const idx = members.value.findIndex((v) => v.id == id);
        if (idx == -1) {
          console.error(`could not find member ${id} in local store`);
          return;
        }
        members.value.splice(idx, 1);
      };
      const addMemberFromDocRef = async (docRef: DocumentReference) => {
        const member = await Member.fromId(docRef.id);
        members.value.push(member);
      };
      for (const change of snapshot.docChanges()) {
        switch (change.type) {
          case "modified":
            removeMemberById(change.doc.id);
            await addMemberFromDocRef(change.doc.ref);
            break;
          case "added":
            await addMemberFromDocRef(change.doc.ref);
            break;
          case "removed":
            removeMemberById(change.doc.id);
            break;
          default:
            throw new Error(`unknown Firestore change.type: ${change.type}`);
        }
      }
    } catch (e) {
      console.error(`could not load members`, e);
      // now I actually have to deal with the UI for errors
      snackbar.add({
        type: "error",
        title: "An unexpected error occurred loading members",
        text: "Please contact the site admins",
      });
    } finally {
      finishedInitialLoad.value = true;
    }
  });

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
  };

  /**
   *
   * @param name name of the member to add
   * @throws
   */
  const addMember = async (name: string) => {
    await addDoc(collection(db, "members"), {
      name,
      points: 0,
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

import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { useAuthStore } from "./auth.store";
import { FirebaseMember, Member } from "../types/Member";
import { Task } from "../types/Task";

export type AddPointsData = { id: string; change: number; message: string } | { id: string; task: Task };

export const usePointsStore = defineStore("points", () => {
  const db = getFirestore();

  const authStore = useAuthStore();

  const finishedInitialLoad = ref(false);

  // members
  const members = ref<Member[]>([]);
  onSnapshot(collection(db, "members"), async (snapshot) => {
    const removeMemberById = (id: string) => {
      const idx = members.value.findIndex((v) => v.id == id);
      if (idx == -1) {
        console.error(`could not find member ${id} in local store`);
        return;
      }
      members.value.splice(idx, 1);
    };
    const addMemberFromDocRef = async (docRef: DocumentReference) => {
      const [member, err] = await Member.fromId( docRef.id);
      if (member) {
        members.value.push(member);
      } else {
        throw new Error(`error getting member from doc: ${err}`);
      }
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
    finishedInitialLoad.value = true;
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

  // todo: refactor to use more consistent error handling throughout
  // a string return will be an error, null return means no error
  const addPoints = async (data: AddPointsData): Promise<string | null> => {
    const docRef = doc(db, "members", data.id);
    const newHistoryEntry = doc(collection(db, docRef.path, "history"));

    if (!(authStore.isAuthenticated && authStore.user?.uid)) {
      return "cannot modify points, not signed in as admin";
    }

    // check if member has completed task before
    if ("task" in data) {
      const [member,err] = await Member.fromId(data.id);
      if (err) return `error getting member: ${err}`;
      
      if (member.hasCompletedTask(data.task)) {
        return `member ${member.name} has already completed task ${data.task.title}`;
      }
    }

    await setDoc(newHistoryEntry, {
      adminId: authStore.user.uid,
      change: (data as any).change ?? null,
      message: (data as any).message ?? null,
      taskId: (data as any).task?.id ?? null,
      timestamp: serverTimestamp(),
    });

    return null;
  };

  // returns a string containing the error if there was one, otherwise null
  const addMember = async (name: string) => {
    try {
      await addDoc(collection(db, "members"), {
        name,
        points: 0,
      });
    } catch (e) {
      return `${e}`;
    }
    return null;
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

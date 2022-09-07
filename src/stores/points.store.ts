import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getFirestore,
  increment,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { useAuthStore } from "./auth.store";
import { FirebaseMember, Member } from "../types/Member";

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
      const [member, err] = await Member.fromDoc(
        docRef as DocumentReference<FirebaseMember>
      );
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
  const addPoints = async (
    memberId: string,
    deltaAmount: number,
    message: string
  ): Promise<string | null> => {
    const batch = writeBatch(db);

    const docRef = doc(db, "members", memberId);
    const newHistoryEntry = doc(collection(db, docRef.path, "history"));

    if (!(authStore.isAuthenticated && authStore.user?.uid)) {
      return "cannot modify points, not signed in as admin";
    }

    batch
      .update(docRef, {
        points: increment(deltaAmount),
      })
      .set(newHistoryEntry, {
        adminId: authStore.user.uid,
        change: deltaAmount,
        message,
        timestamp: serverTimestamp(),
      });

    await batch.commit();

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

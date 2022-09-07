import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getFirestore,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { ref } from "vue";
import { FirebaseTask, Task } from "../types/Task";
import { TimestampsToDate } from "../utils";
import { useAuthStore } from "./auth.store";

// todo: remove duplicate between this and points store
export const useTasksStore = defineStore("tasks", () => {
  const db = getFirestore();
  const authStore = useAuthStore();

  const finishedInitialLoad = ref(false);

  // tasks
  const tasks = ref<Task[]>([]);
  onSnapshot(collection(db, "tasks"), async (snapshot) => {
    const removeTaskById = (id: string) => {
      const idx = tasks.value.findIndex((v) => v.id == id);
      if (idx == -1) {
        console.error(`could not find member ${id} in local store`);
        return;
      }
      tasks.value.splice(idx, 1);
    };
    const addTaskFromDocRef = async (docRef: DocumentReference) => {
      const task = await Task.fromId(docRef.id);
      tasks.value.push(task);
    };
    for (const change of snapshot.docChanges()) {
      switch (change.type) {
        case "modified":
          removeTaskById(change.doc.id);
          await addTaskFromDocRef(change.doc.ref);
          break;
        case "added":
          await addTaskFromDocRef(change.doc.ref);
          break;
        case "removed":
          removeTaskById(change.doc.id);
          break;
        default:
          throw new Error(`unknown Firestore change.type: ${change.type}`);
      }
    }
    finishedInitialLoad.value = true;
  });

  // add task
  const addTask = async (
    task: TimestampsToDate<FirebaseTask>
  ): Promise<string | null> => {
    console.log(task);

    if (!(authStore.isAuthenticated && authStore.user?.uid)) {
      return "cannot modify points, not signed in as admin";
    }

    try {
      await addDoc(collection(db, "tasks"), task);
    } catch (e) {
      console.error(e);
      return `could not add task: ${e}`;
    }

    return null;
  };

  return { finishedInitialLoad, tasks, addTask };
});

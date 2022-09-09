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
import { useSnackbar } from "vue3-snackbar";
import { FirebaseTask, Task } from "../types/Task";
import { TimestampsToDate } from "../utils";
import { useAuthStore } from "./auth.store";

// todo: remove duplicate between this and points store
export const useTasksStore = defineStore("tasks", () => {
  const db = getFirestore();
  const authStore = useAuthStore();

  const snackbar = useSnackbar();

  const finishedInitialLoad = ref(false);

  // tasks
  const tasks = ref<Task[]>([]);
  onSnapshot(collection(db, "tasks"), async (snapshot) => {
    try {
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
    } catch (e) {
      console.error("error getting tasks", e);
      // show UI
      snackbar.add({
        type: "error",
        title: "An unexpected error occurred loading tasks",
        text: "Please contact the site admins",
      });
    } finally {
      finishedInitialLoad.value = true;
    }
  });

  // add task
  /**
   *
   * @param task
   * @throws
   */
  const addTask = async (
    task: TimestampsToDate<FirebaseTask>
  ): Promise<void> => {
    console.log(task);

    if (!(authStore.isAuthenticated && authStore.user?.uid)) {
      throw new Error("cannot modify points, not signed in as admin");
    }

    await addDoc(collection(db, "tasks"), task);
  };

  return { finishedInitialLoad, tasks, addTask };
});

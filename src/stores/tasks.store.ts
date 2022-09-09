import { addDoc, collection, getFirestore } from "firebase/firestore";
import { defineStore } from "pinia";
import { FirebaseTask, Task } from "../types/Task";
import { TimestampsToDate, useFirestoreCollection } from "../utils";
import { useAuthStore } from "./auth.store";

export const useTasksStore = defineStore("tasks", () => {
  const db = getFirestore();
  const authStore = useAuthStore();

  const [tasks, finishedInitialLoad] = useFirestoreCollection(
    collection(db, "tasks"),
    (doc) => Task.fromId(doc.id) // todo: use fromDoc instead to avoid fetching data twice
  );

  /**
   * Add a task
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

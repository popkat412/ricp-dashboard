import {
  CollectionReference,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { ref, Ref } from "vue";
import { useSnackbar } from "vue3-snackbar";

export type TimestampsToDate<T> = {
  [Key in keyof T]: T[Key] extends Timestamp
    ? Date
    : T[Key] extends Timestamp | null
    ? Date | null
    : T[Key];
};

export function clamp(v: number, lb: number, ub: number): number {
  return Math.min(Math.max(v, lb), ub);
}

export function useFirestoreCollection<T extends { readonly id: string }>(
  collection: CollectionReference,
  createFromDoc: (doc: DocumentSnapshot) => Promise<T>
): [Ref<T[]>, Ref<boolean>] {
  const arr: Ref<T[]> = ref([]);
  const finishedInitialLoad = ref(false);

  const snackbar = useSnackbar();

  onSnapshot(collection, async (snapshot) => {
    try {
      const removeById = (id: string) => {
        const idx = arr.value.findIndex((v) => v.id == id);
        if (idx == -1) {
          throw new Error(`fatal: could not find ${id} in local store`);
        }
        arr.value.splice(idx, 1);
      };
      // todo: use doc instead of id so we don't have to fetch the data twice
      const addFromDoc = async (doc: DocumentSnapshot) => {
        arr.value.push(await createFromDoc(doc));
      };
      for (const change of snapshot.docChanges()) {
        switch (change.type) {
          case "modified":
            // todo: make these two happen together (syncronyously)
            // so there isn't a flash where the thing gets removed then added back from the UI
            removeById(change.doc.id);
            await addFromDoc(change.doc);
            break;
          case "added":
            await addFromDoc(change.doc);
            break;
          case "removed":
            removeById(change.doc.id);
            break;
          default:
            throw new Error(`unknown Firestore change.type: ${change.type}`);
        }
      }
    } catch (e) {
      // now I actually have to deal with the UI for errors
      snackbar.add({
        type: "error",
        title: "An error occurred loading data",
        text: "Please contact the site admins",
      });
    } finally {
      finishedInitialLoad.value = true;
    }
  });
  return [arr, finishedInitialLoad];
}

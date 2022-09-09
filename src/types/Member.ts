import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { Admin } from "./Admin";
import {
  FirebaseHistoryEntry,
  HistoryEntry,
  TaskHistoryEntry,
} from "./HistoryEntry";
import { Task } from "./Task";

/**
 * Type of an object from Firestore representing a Member.
 */
export interface FirebaseMember {
  name: string;
}

export interface TaskCompleted {
  task: Task;
  dateCompleted: Date;
}

/**
 * Represents a RICP member that has a certain number of points.
 */
export class Member {
  /**
   * The Firestore id of this member.
   */
  readonly id: string;
  /**
   * The display name.
   */
  name: string;
  /**
   * Points history. This is the source of truth for the number
   * of points the user has.
   */
  history: HistoryEntry[];

  constructor(id: string, name: string, history: HistoryEntry[]) {
    this.id = id;
    this.name = name;
    this.history = history;
    this.history.forEach((v) => (v.member = this));
  }

  /**
   * Get a Member from a Firestore ID.
   *
   * @param id {string} The Firestore document id
   * @throws
   */
  static async fromId(id: string): Promise<Member> {
    const db = getFirestore();

    let data: FirebaseMember | undefined;
    try {
      const docRef = doc(
        db,
        "members",
        id
      ) as DocumentReference<FirebaseMember>;
      data = (await getDoc<FirebaseMember>(docRef)).data();
    } catch (e) {
      // log to console for debugging purposes, then rethrow
      console.error(`error getting member document: ${e}`);
      throw e;
    }
    if (!data) {
      console.error(`member ${id} doesn't exist`);
      throw new Error("The specified member doesn't exist");
    }

    let history: HistoryEntry[] = [];
    try {
      const historyDocs = (
        await getDocs(collection(db, "members", id, "history"))
      ).docs;
      history = await Promise.all(
        historyDocs.map(async (v) => {
          return await HistoryEntry.fromDoc(
            v as QueryDocumentSnapshot<FirebaseHistoryEntry>
          );
        })
      );
    } catch (e) {
      console.error(`could not get history for member ${id}`, e);
      throw e;
    }

    return new Member(id, data.name, history);
  }

  /**
   * Computes the number of points the user has as a sum
   * of the change in points for each history entry.
   * This ensure the points is always in sync with the history.
   */
  get points(): number {
    return this.history.reduce((acc, v) => acc + v.change, 0);
  }

  /**
   * Convenience method for getting all the tasks
   * completed by this member.
   */
  get tasksCompleted(): TaskCompleted[] {
    // flatMap is basically just a conveneint way to
    // filter + map at the same time
    return this.history.flatMap((v) =>
      v instanceof TaskHistoryEntry
        ? [{ task: v.task, dateCompleted: v.timestamp }]
        : []
    );
  }

  hasCompletedTask(task: Task): boolean {
    return !!this.tasksCompleted.find((v) => v.task.id == task.id);
  }
}

import {
  collection,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { Either } from "../utils";
import { Admin } from "./Admin";
import { HistoryEntry } from "./HistoryEntry";
import { FirebaseTask, Task } from "./Task";

export interface FirebaseMember {
  name: string;
  points: number;
}

export interface FirebaseHistory {
  adminId: string;
  change: number;
  message: string;
  timestamp: Timestamp;
  taskId: string | null;
}

export interface TaskCompleted {
  task: Task;
  dateCompleted: Date;
}

export class Member {
  readonly id: string;
  name: string;
  points: number;
  history: HistoryEntry[];
  tasksCompleted: TaskCompleted[];

  constructor(
    id: string,
    name: string,
    points: number,
    history: HistoryEntry[],
    tasksCompleted: TaskCompleted[]
  ) {
    this.id = id;
    this.name = name;
    this.points = points;
    this.history = history;
    this.history.forEach((v) => (v.member = this));
    this.tasksCompleted = tasksCompleted;
  }

  static async fromDoc(
    docRef: DocumentReference<FirebaseMember>
  ): Promise<Either<Member, Error>> {
    // todo: better error handling
    // ugh this is why swift/haskell/rust is better, they make sure
    // you're explicit about what functions throw/could error and what don't
    // and force you to handle it, instead of crashing at runtime
    const db = getFirestore();

    const data = (await getDoc<FirebaseMember>(docRef)).data();
    if (!data) return [null, new Error(`document ${docRef.id} doesn't exist`)];

    let history: HistoryEntry[] = [];
    try {
      const historyDocs = (
        await getDocs(collection(db, docRef.path, "history"))
      ).docs;
      history = await Promise.all(
        historyDocs.map(async (v) => {
          const { adminId, change, message, timestamp, taskId } = v.data({
            serverTimestamps: "estimate",
          }) as FirebaseHistory;
          const admin = await Admin.fromId(adminId);
          const task = taskId ? await Task.fromId(taskId) : null;
          return new HistoryEntry(
            v.id,
            change,
            timestamp.toDate(),
            message,
            admin,
            task
          );
        })
      );
    } catch (e) {
      console.error(`could not get history for member ${docRef.id}`, e);
    }

    let tasksCompleted: TaskCompleted[] = [];
    try {
      const tasksCompletedDocs = (
        await getDocs(collection(db, docRef.path, "tasksCompleted"))
      ).docs;
      tasksCompleted = await Promise.all(
        tasksCompletedDocs.map(async (v) => {
          const { task, dateCompleted } = v.data({
            serverTimestamps: "estimate",
          }) as { task: string; dateCompleted: Timestamp };
          return {
            task: await Task.fromId(task),
            dateCompleted: dateCompleted.toDate(),
          };
        })
      );
    } catch (e) {
      console.error(`could not get tasks completed for member ${docRef.id}`, e);
    }

    return [
      new Member(docRef.id, data.name, data.points, history, tasksCompleted),
      null,
    ];
  }
}

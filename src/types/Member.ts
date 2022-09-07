import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { Either } from "../utils";
import { Admin } from "./Admin";
import { HistoryEntry } from "./HistoryEntry";
import { Task } from "./Task";

export interface FirebaseMember {
  name: string;
}

export interface FirebaseHistory {
  adminId: string;
  change: number | null;
  message: string | null;
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
  history: HistoryEntry[];

  constructor(
    id: string,
    name: string,
    history: HistoryEntry[],
  ) {
    this.id = id;
    this.name = name;
    this.history = history;
    this.history.forEach((v) => (v.member = this));
  }

  static async fromId(
    id: string,
  ): Promise<Either<Member, Error>> {
    // todo: better error handling
    // ugh this is why swift/haskell/rust is better, they make sure
    // you're explicit about what functions throw/could error and what don't
    // and force you to handle it, instead of crashing at runtime
    const db = getFirestore();

    const data = (await getDoc<FirebaseMember>(doc(db, "members", id) as DocumentReference<FirebaseMember>)).data();
    if (!data) return [null, new Error(`member ${id} doesn't exist`)];

    let history: HistoryEntry[] = [];
    try {
      const historyDocs = (
        await getDocs(collection(db, "members", id, "history"))
      ).docs;
      // todo: refactor this to have a fromId 
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
      console.error(`could not get history for member ${id}`, e);
    }

    return [
      new Member(id, data.name, history),
      null,
    ];
  }

  get points(): number {
    return this.history.reduce((acc, v) => acc + v.change, 0);
  }

  get tasksCompleted(): TaskCompleted[] {
    return this.history.flatMap(v => v.task ? [{task: v.task, dateCompleted: v.timestamp}] : []);
  }

  hasCompletedTask(task: Task): boolean {
    return !!this.tasksCompleted.find(v => v.task.id == task.id);
  }
}

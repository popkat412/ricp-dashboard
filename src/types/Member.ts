import {
  collection,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { Either } from "../utils";
import { Admin } from "./Admin";
import { HistoryEntry } from "./HistoryEntry";

export interface FirebaseMember {
  name: string;
  points: number;
}

export interface FirebaseHistory {
  adminId: string;
  change: number;
  message: string;
  timestamp: Timestamp;
}

export class Member {
  readonly id: string;
  name: string;
  points: number;
  history: HistoryEntry[];

  constructor(
    id: string,
    name: string,
    points: number,
    history: HistoryEntry[]
  ) {
    this.id = id;
    this.name = name;
    this.points = points;
    this.history = history;
    this.history.forEach((v) => (v.member = this));
  }

  static async fromDoc(
    docRef: DocumentReference<FirebaseMember>
  ): Promise<Either<Member, Error>> {
    const db = getFirestore();
    const data = (await getDoc<FirebaseMember>(docRef)).data();
    if (!data) return [null, new Error(`document ${docRef.id} doesn't exist`)];

    const historyDocs = (await getDocs(collection(db, docRef.path, "history")))
      .docs;
    const history = await Promise.all(
      historyDocs.map(async (v) => {
        const { adminId, change, message, timestamp } = v.data({
          serverTimestamps: "estimate",
        }) as FirebaseHistory;
        const admin = await Admin.fromId(adminId);
        return new HistoryEntry(
          v.id,
          change,
          timestamp.toDate(),
          message,
          admin
        );
      })
    );
    if (!history)
      return [null, new Error(`could not get history for member ${docRef.id}`)];

    return [new Member(docRef.id, data.name, data.points, history), null];
  }
}

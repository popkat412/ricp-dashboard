import type { Member } from "./Member";
import { Admin } from "./Admin";
import { Task } from "./Task";
import { DocumentSnapshot, Timestamp } from "firebase/firestore";

/**
 * Type of an object from Firestore representing a HistoryEntry.
 */
export type FirebaseHistoryEntry =
  | FirebaseManualHistoryEntry
  | FirebaseTaskHistoryEntry;

/**
 * Firebase fields shared by all type of HistoryEntries
 */
export interface FirebaseBaseHistoryEntry {
  _tag: "manual" | "task";
  adminId: string;
  timestamp: Timestamp;
}

/**
 * Class representing a history entry, which tracks
 * one change to a Member's points.
 */
export abstract class HistoryEntry {
  /**
   * The Firestore id of this entry.
   */
  readonly id: string;

  /**
   * The Date when this entry was added.
   */
  timestamp: Date;
  /**
   * The admin who added this entry.
   */
  admin: Admin;
  /**
   * The Member this entry belongs to.
   */
  member!: Member; // IMPORTANT: remember to set this in the Member constructor

  constructor(id: string, timestamp: Date, admin: Admin) {
    this.id = id;
    this.timestamp = timestamp;
    this.admin = admin;
  }

  /**
   * The change in points associated with
   * this entry. Can be a positive (for a increase in points)
   * or negative (for a decrease in points) integer.
   */
  abstract get change(): number;

  /**
   * The message associated with this entry.
   */
  abstract get message(): string;

  /**
   * Creates a HistoryEntry of the appropriate subclass from
   * a Firestore document
   *
   * @param snapshot Document snapshot to get data from
   * @throws
   */
  static async fromDoc(
    snapshot: DocumentSnapshot<FirebaseHistoryEntry>
  ): Promise<HistoryEntry> {
    const data = snapshot.data({ serverTimestamps: "estimate" });
    if (!data) throw new Error(`history entry ${snapshot.id} does not exist`);
    const { _tag, adminId } = data;
    const admin = await Admin.fromId(adminId);
    switch (_tag) {
      case "manual":
        return new ManualHistoryEntry(
          snapshot.id,
          data.timestamp.toDate(),
          admin,
          data.change,
          data.message
        );
      case "task":
        const { taskId } = data;
        const task = await Task.fromId(taskId);
        return new TaskHistoryEntry(
          snapshot.id,
          data.timestamp.toDate(),
          admin,
          task
        );
      default:
        throw new Error(`unregognised history entry _tag: ${_tag}`);
    }
  }
}

export interface FirebaseManualHistoryEntry extends FirebaseBaseHistoryEntry {
  _tag: "manual";
  change: number;
  message: string;
}

/**
 * When an admin manually adds points to a particular member.
 */
export class ManualHistoryEntry extends HistoryEntry {
  change: number;
  message: string;

  constructor(
    id: string,
    timestamp: Date,
    admin: Admin,
    change: number,
    message: string
  ) {
    super(id, timestamp, admin);
    this.change = change;
    this.message = message;
  }
}

export interface FirebaseTaskHistoryEntry extends FirebaseBaseHistoryEntry {
  _tag: "task";
  taskId: string;
}

/**
 * When a user gets points by completing a task.
 * This way, when the task gets updated, the user's
 * points will automatically be updated as well.
 */
export class TaskHistoryEntry extends HistoryEntry {
  task: Task;

  constructor(id: string, timestamp: Date, admin: Admin, task: Task) {
    super(id, timestamp, admin);
    this.task = task;
  }

  get change(): number {
    return this.task.getScore(this.timestamp);
  }

  get message(): string {
    return `Completed task "${this.task.title}"`;
  }
}

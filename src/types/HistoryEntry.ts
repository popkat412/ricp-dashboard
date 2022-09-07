import type { Member } from "./Member";
import type { Admin } from "./Admin";
import { Task } from "./Task";

export class HistoryEntry {
  id: string;
  _change: number | null;
  timestamp: Date;
  message: string | null;
  admin: Admin;
  task: Task | null;
  member!: Member; // IMPORTANT: remember to set this later

  // i love OOP boilerplate
  constructor(
    id: string,
    change: number | null,
    timestamp: Date,
    message: string | null,
    admin: Admin,
    task: Task | null
  ) {
    this.id = id;
    this._change = change;
    this.timestamp = timestamp;
    this.message = message;
    this.admin = admin;
    this.task = task;
  }

  get change(): number {
    if (this._change != null) return this._change;
    if (this.task) return this.task.getScore(this.timestamp);
    throw new Error(`both #change and task is null for history entry ${this.id}`);
  }
}

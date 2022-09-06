import type { Member } from "./Member";
import type { Admin } from "./Admin";
import { Task } from "./Task";

export class HistoryEntry {
  id: string;
  change: number;
  timestamp: Date;
  message: string;
  admin: Admin;
  task: Task | null;
  member!: Member; // IMPORTANT: remember to set this later

  // i love OOP boilerplate
  constructor(
    id: string,
    change: number,
    timestamp: Date,
    message: string,
    admin: Admin,
    task: Task | null
  ) {
    this.id = id;
    this.change = change;
    this.timestamp = timestamp;
    this.message = message;
    this.admin = admin;
    this.task = task;
  }
}

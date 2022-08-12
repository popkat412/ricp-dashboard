import type { Member } from "./Member";
import type { Admin } from "./Admin";

export class HistoryEntry {
  id: string;
  change: number;
  timestamp: Date;
  message: string;
  admin: Admin;
  member!: Member; // IMPORTANT: remember to set this later

  // i love OOP boilerplate
  constructor(
    id: string,
    change: number,
    timestamp: Date,
    message: string,
    admin: Admin
  ) {
    this.id = id;
    this.change = change;
    this.timestamp = timestamp;
    this.message = message;
    this.admin = admin;
  }
}

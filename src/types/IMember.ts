import type { IHistoryEntry } from "./IHistoryEntry";

export interface IMember {
  name: string;
  points: number;
  history: IHistoryEntry[];
  adminName: string;
}

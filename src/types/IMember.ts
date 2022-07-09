import type { IHistoryEntry } from "./IHistoryEntry";

export interface IMember {
  id: string;
  name: string;
  points: number;
  history: IHistoryEntry[];
}

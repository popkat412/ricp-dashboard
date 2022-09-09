import type { Timestamp } from "firebase/firestore";

export type TimestampsToDate<T> = {
  [Key in keyof T]: T[Key] extends Timestamp
    ? Date
    : T[Key] extends Timestamp | null
    ? Date | null
    : T[Key];
};

export function clamp(v: number, lb: number, ub: number): number {
  return Math.min(Math.max(v, lb), ub);
}

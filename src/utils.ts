import type { Timestamp } from "firebase/firestore";

export type Either<T, E> = [T, null] | [null, E];

export async function e<T, E extends Error>(
  promise: Promise<T>
): Promise<Either<T, E>> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}

export type TimestampsToDate<T> = {
  [Key in keyof T]: T[Key] extends Timestamp 
    ? Date 
    : T[Key] extends (Timestamp | null) 
      ? (Date | null)
      : T[Key];
};

export function clamp(v: number, lb: number, ub: number): number {
  return Math.min(Math.max(v, lb), ub);
}

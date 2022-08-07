import type { DocumentData } from "firebase/firestore";

export interface IAdminDocument extends DocumentData {
  readonly id: string;
  name: string;
}

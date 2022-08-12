import { doc, getDoc, getFirestore } from "firebase/firestore";

export class Admin {
  name: string;
  uid: string;

  constructor(name: string, uid: string) {
    this.name = name;
    this.uid = uid;
  }

  static async fromId(id: string): Promise<Admin> {
    const db = getFirestore();
    const data = (await getDoc(doc(db, "users", id))).data();
    if (!data) throw new Error(`admin ${id} doesn't exist`);
    return new Admin(data.name, id);
  }
}

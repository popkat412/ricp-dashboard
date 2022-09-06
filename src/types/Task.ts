import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import {
  ConstantScoreFnParams,
  isScoreFnName,
  LinearScoreFnParams,
  ScoreFnName,
  ScoreFnParams,
} from "./ScoreFn";

export interface FirebaseTask {
  title: string;
  description: string;
  dateAdded: Timestamp;
  expiryDate: Timestamp | null;
  scoreFnName: string;
  scoreFnParams: { [k: string]: unknown };
  expired: boolean;
}

export class Task {
  readonly id: string;
  title: string;
  description: string;
  dateAdded: Date;
  expiryDate: Date | null;
  expired: boolean;
  scoreFnName: ScoreFnName;
  scoreFnParams: ScoreFnParams;

  constructor(
    id: string,
    title: string,
    description: string,
    dateAdded: Date,
    expiryDate: Date | null,
    expired: boolean,
    scoreFnName: ScoreFnName,
    scoreFnParams: ScoreFnParams
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateAdded = dateAdded;
    this.expiryDate = expiryDate;
    this.expired = expired;
    this.scoreFnName = scoreFnName;
    this.scoreFnParams = scoreFnParams;
  }

  static async fromId(id: string): Promise<Task> {
    const db = getFirestore();
    const data = (
      await getDoc(doc(db, "tasks", id))
    ).data() as FirebaseTask | null;
    if (!data) throw new Error(`task ${id} doesn't exist`);

    if (!isScoreFnName(data.scoreFnName))
      throw new Error(`score function name ${data.scoreFnName} doesn't exist`);

    const scoreFnParams = Task.convertScoreFnParams(
      data.scoreFnName,
      data.scoreFnParams
    );

    if (!scoreFnParams) {
      console.error(data.scoreFnParams);
      throw new Error("score function params could not be parsed");
    }

    return new Task(
      id,
      data.title,
      data.description,
      data.dateAdded.toDate(),
      data.expiryDate?.toDate() ?? null,
      data.expired,
      data.scoreFnName,
      scoreFnParams
    );
  }

  private static convertScoreFnParams(
    scoreFnName: ScoreFnName,
    scoreFnParams: { [k: string]: unknown }
  ): ScoreFnParams | null {
    // check valiidity of scoreFnParams
    if (
      !(
        "st" in scoreFnParams &&
        "lb" in scoreFnParams &&
        "ub" in scoreFnParams &&
        scoreFnParams.st instanceof Timestamp &&
        typeof scoreFnParams.ub == "number" &&
        typeof scoreFnParams.lb == "number"
      )
    )
      return null;

    scoreFnParams.st = scoreFnParams.st.toDate();

    switch (scoreFnName) {
      case "constant":
        if (!("c" in scoreFnParams && typeof scoreFnParams.c == "number"))
          return null;
        return new ConstantScoreFnParams(scoreFnParams);
      case "linear":
        // todo: find a nicer way to do whatever this crap is
        if (
          !(
            "c" in scoreFnParams &&
            typeof scoreFnParams.c == "number" &&
            "m" in scoreFnParams &&
            typeof scoreFnParams.m == "number"
          )
        )
          return null;
        return new LinearScoreFnParams(scoreFnParams);
      default:
        return null;
    }
  }
}

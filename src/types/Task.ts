import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import {
  ConstantScoreFnParams,
  isScoreFnName,
  LinearScoreFnParams,
  ScoreFnName,
  ScoreFnParams,
} from "./ScoreFn";

/**
 * Type of an object from Firestore representing a Task.
 * i.e. the tyoe of doc.data() assuming doc is a document representing a Task
 */
export interface FirebaseTask {
  title: string;
  description: string;
  dateAdded: Timestamp;
  expiryDate: Timestamp | null;
  scoreFnName: ScoreFnName;
  scoreFnParams: { [k: string]: unknown };
  expired: boolean;
}

/**
 * Class representing a task. A task contains info about how many points
 * one will get after a certian number of days for doing something.
 * For more info, take a look at the scoreFnName section.
 */
export class Task {
  /**
   * Firebase ID
   */
  readonly id: string;

  /**
   * Title of the task. Must not be empty.
   */
  title: string;

  /**
   * Description of the task. Can be empty.
   */
  description: string;
  /**
   * Date the task was added.
   */
  dateAdded: Date;
  /**
   * Expiry date of the task. Do note that due to time constraints I
   * did not manage to implement the whole expiry system yet,
   * so for now this property is not used.
   */
  expiryDate: Date | null;
  /**
   * Whether this task is expired or not. Do note that due to time constraints I
   * did not manage to implement the whole expiry system yet,
   * so for now this property is not used.
   */
  expired: boolean;
  /**
   * Score function name. A score function calculates the
   * number of points this task is worth a certain number of days after
   * a certain date. This can be used to encourage members to complete
   * the tasks earlier for more points. See README for more details
   */
  scoreFnName: ScoreFnName;
  /**
   * Parameters for the score function.
   */
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

  /**
   * Convenience function to calculate how many points
   * this task is worth on a particular date.
   * It basically just calls the calculateScore method
   * on the ScoreFnParams class.
   *
   * @param date Date to evaluate score function at
   * @returns
   */
  getScore(date: Date): number {
    return this.scoreFnParams.calculateScore(date);
  }

  // Please don't look at this code, it's absolutely terrible
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

import { ScoreFnName, ScoreFnParams } from "./ScoreFn";

export class Task {
  title: string;
  description: string;
  dateAdded: Date;
  expiryDate: Date | null;
  scoreFnName: ScoreFnName;
  scoreFnParams: ScoreFnParams;

  constructor(
    title: string,
    description: string,
    dateAdded: Date,
    expiryDate: Date,
    scoreFnName: ScoreFnName,
    scoreFnParams: ScoreFnParams
  ) {
    this.title = title;
    this.description = description;
    this.dateAdded = dateAdded;
    this.expiryDate = expiryDate;
    this.scoreFnName = scoreFnName;
    this.scoreFnParams = scoreFnParams;
  }
}

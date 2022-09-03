import { clamp } from "../utils";

export type ScoreFnName = "constant" | "linear";

interface BaseScoreFnArgs {
  st?: Date;
  lb?: number;
  ub?: number;
}

export abstract class ScoreFnParams {
  st: Date;
  lb: number;
  ub: number;

  constructor({ st = new Date(), lb = 0, ub = Infinity }: BaseScoreFnArgs) {
    this.st = st;
    this.lb = lb;
    this.ub = ub;
  }

  calculateScore(t: Date): number {
    // Very naive way of calculating number of days past
    // hope this doesn't bite me in the ass later.
    // The way i'm defining "number of days past" is that
    // it actually just only looks at the day, so if the task
    // was set at 2359 on 1st April and the person completes it at 0001 on 2nd April
    // it will still count that one day has passed.
    const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
    const stDay = Math.trunc(this.st.getTime() / MS_IN_A_DAY);
    const tDay = Math.trunc(t.getTime() / MS_IN_A_DAY);

    const y = this.evaluate(tDay - stDay);

    return clamp(y, this.lb, this.ub);
  }

  // v is the number of days that has passed (should be a whole number)
  protected abstract evaluate(x: number): number;
}

export class ConstantScoreFnParams extends ScoreFnParams {
  c: number;

  constructor(args: BaseScoreFnArgs & { c?: number }) {
    super(args);
    this.c = args.c ?? 100;
  }

  evaluate(_x: number): number {
    return this.c;
  }
}

export class LinearScoreFnParams extends ConstantScoreFnParams {
  m: number;

  constructor(args: BaseScoreFnArgs & { c?: number; m?: number }) {
    super(args);
    this.m = args.m ?? 10;
  }

  evaluate(x: number): number {
    return -this.m * x + this.c;
  }
}

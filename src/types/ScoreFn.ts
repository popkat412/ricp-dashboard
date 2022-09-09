import { clamp } from "../utils";

/**
 * Array of all the score function names supported
 */
export const SCORE_FN_NAMES = ["constant", "linear"] as const;

export type ScoreFnName = typeof SCORE_FN_NAMES[number];

export function isScoreFnName(scoreFnName: string): scoreFnName is ScoreFnName {
  return SCORE_FN_NAMES.includes(scoreFnName as any);
}

/**
 * The type of object that the abstract base class ScoreFnParams accepts
 * in its constructor.
 */
export interface BaseScoreFnArgs {
  st?: Date;
  lb?: number;
  ub?: number;
}

export function isBaseScoreFnParamsObj(scoreFnParams: {
  [k: string]: unknown;
}): scoreFnParams is { st: Date; lb: number; ub: number } {
  return (
    "st" in scoreFnParams &&
    "lb" in scoreFnParams &&
    "ub" in scoreFnParams &&
    scoreFnParams.st instanceof Date &&
    typeof scoreFnParams.ub == "number" &&
    typeof scoreFnParams.lb == "number"
  );
}

/**
 * Abstract base ScoreFnParams class. All score function parameter classes
 * should inherit from this class.
 */
export abstract class ScoreFnParams {
  /**
   * The "start date" of the function, so the function
   * will start counting the number of days from this start date.
   * You can think of the function as being called as f(x - st) if
   * you're more mathematically inclined.
   *
   * The default value is the current date.
   */
  st: Date;
  /**
   * Lower bound of the score function. The result of the
   * score function will be clamped such that it never falls below this.
   *
   * The default value is 0.
   *
   * Do note that the lower bound will be applied always.
   */
  lb: number;
  /**
   * Upper bound of the score function. The result of the
   * score function will be clamped such that it is never higher than this.
   *
   * The default value is 999.
   *
   * Do note that the lower bound will be applied always.
   */
  ub: number;

  constructor({ st = new Date(), lb = 0, ub = 999 }: BaseScoreFnArgs) {
    this.st = st;
    this.lb = lb;
    this.ub = ub;
  }

  /**
   * Calculates the score of the function with all the parameters
   * on the particular date t
   */
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

  /**
   * Evaluate the actual function itself, without worrying
   * about st, ub, or lb
   *
   * @param x the number of days that has passed (should be a whole number)
   */
  protected abstract evaluate(x: number): number;
}

/**
 * Constant score function params.
 * A constan score function will (as the name suggests)
 * always be at some constnat value c regardless of the date.
 *
 * Mathematical expression: f(x) = c
 */
export class ConstantScoreFnParams extends ScoreFnParams {
  /**
   * The number of points the task will be worth, always.
   */
  c: number;

  constructor(args: BaseScoreFnArgs & { c?: number }) {
    super(args);
    this.c = args.c ?? 100;
  }

  evaluate(_x: number): number {
    return this.c;
  }
}

/**
 * Linear score function params. The score will decrease (or increase)
 * linearly as the days pass.
 *
 * Mathematical expression: f(x) - mx + c
 *
 * The negative is there because you will usually want the worth
 * of the task to decrease as the days go by.
 */
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

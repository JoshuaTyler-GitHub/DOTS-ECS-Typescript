/**
 * @class
 */
export default class SimulationTime {
  /**
   * @constructor
   */
  constructor(
    targetFixedCyclesPerSecond?: number,
    targetCyclesPerSecond?: number,
  ) {
    if (targetFixedCyclesPerSecond !== undefined) {
      this.targetFixedCyclesPerSecond = targetFixedCyclesPerSecond;
    }
    if (targetCyclesPerSecond !== undefined) {
      this.targetCyclesPerSecond = targetCyclesPerSecond;
    }
  }

  /**
   * The trailing average of cycles performed per second.
   * @averageCyclesPerSecond
   * @default 0
   */
  public averageCyclesPerSecond: number = 0;

  /**
   * The trailing average of fixed cycles performed per second.
   * @averageFixedCyclesPerSecond
   * @default 0
   */
  public averageFixedCyclesPerSecond: number = 0;

  /**
   * The timestamp of the current cycle's start.
   * @cycleStart
   * @default 0
   */
  public cycleStart: number = 0;

  /**
   * The time change (delta) between the previous and current cycle.
   * @deltaTime
   * @default 0
   */
  public deltaTime: number = 0;

  /**
   * The time change (delta) between the previous and current fixed cycle.
   * @fixedDeltaTime
   * @default 0
   */
  public fixedDeltaTime: number = 0;

  /**
   * The timestamp of the previous cycle's start.
   * @previousCycleStart
   * @default 0
   */
  public previousCycleStart: number = 0;

  /**
   * The timestamp of the previous fixed cycle's start.
   * @previousFixedCycleStart
   * @default 0
   */
  public previousFixedCycleStart: number = 0;

  /**
   * The timing interval for cycles per second.
   * (targetCycleInterval = 1000 milliseconds / targetCyclesPerSecond)
   *
   * Ideal conditions are achieved when the time an cycle takes to run is
   * less than the targetCycleInterval.
   *
   * When the cycle takes longer than the targetCycleInterval,
   * cycles are are skipped; resulting in reduced averageCyclesPerSecond.
   *
   * This is a soft target, as the actual target interval calculation drops the
   * decimal places, resulting in a slightly higher targetCyclesPerSecond.
   *
   * @example targetCyclesPerSecond = 120
   * (1000 milliseconds / 120 targetCyclesPerSecond = 8[.3r] targetCycleInterval)
   * ≈(1000 milliseconds / 8 targetCycleInterval = 125 targetCyclesPerSecond)
   *
   * @targetCycleInterval
   * @default 120
   */
  public targetCycleInterval: number = 8;

  /**
   * The target for the number of cycles per second.
   * @targetCyclesPerSecond
   * @default 120
   */
  public targetCyclesPerSecond: number = 120;

  /**
   * The timing interval for fixed cycles per second.
   * (targetFixedCycleInterval = 1000 milliseconds / targetFixedCyclesPerSecond)
   *
   * Ideal conditions are achieved when the time a fixed cycle takes to run is
   * less than the targetFixedCycleInterval.
   *
   * When the fixed cycle takes longer than the targetFixedCycleInterval,
   * fixed cycles are are skipped; resulting in reduced averageFixedCyclesPerSecond.
   *
   * This is a soft target, as the actual target interval calculation drops the
   * decimal places, resulting in a slightly higher targetFixedCyclesPerSecond.
   *
   * @example targetFixedCyclesPerSecond = 60
   * (1000 milliseconds / 60 targetFixedCyclesPerSecond = 16[.6r] targetFixedCycleInterval)
   * ≈(1000 milliseconds / 16 targetFixedCycleInterval = 62[.5] targetFixedCyclesPerSecond)
   *
   * @targetFixedCyclesPerSecond
   * @default 60
   */
  public targetFixedCycleInterval: number = 16;

  /**
   * The target for the number of fixed cycles per second.
   * @targetFixedCyclesPerSecond
   * @default 60
   */
  public targetFixedCyclesPerSecond: number = 60;

  /**
   * The timestamp of the world's start.
   * @worldStart
   * @default 0
   */
  public worldStart: number = 0;

  /**
   * The timestamp of the world's stop.
   * @worldStop
   * @default 0
   */
  public worldStop: number = 0;
}

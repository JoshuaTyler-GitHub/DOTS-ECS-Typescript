/**
 * @engine
 */
import Component from '@engine-components/Component';

/**
 * @params
 */
export type CreativeFlightMovementComponentParams = {
  acceleration?: number;
  decceleration?: number;
  speed?: number;
  speedMultiplier?: number;
};

/**
 * @component
 */
export default class CreativeFlightMovementComponent extends Component {
  constructor(params: CreativeFlightMovementComponentParams = {}) {
    super();
    this.acceleration = params.acceleration ?? 0.33;
    this.decceleration = params.decceleration ?? 0.33;
    this.speed = params.speed ?? 3;
    this.speedMultiplier = params.speedMultiplier ?? 3;
  }

  /**
   * @default 0.33
   * @type {number}
   */
  public acceleration: number;

  /**
   * @default 0.33
   * @type {number}
   */
  public decceleration: number;

  /**
   * @default 3
   * @type {number}
   */
  public speed: number;

  /**
   * @default 3
   * @type {number}
   */
  public speedMultiplier: number;
}

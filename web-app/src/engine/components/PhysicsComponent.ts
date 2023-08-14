/**
 * @imports
 */
// engine-components
import Component from '@engine-components/Component';

// engine-enums
import { Constants } from '@engine-enums/Physics';

// engine-math
import Vector3 from '@engine-math/Vector3';

/**
 * @params
 */
export type PhysicsComponentParams = {
  directionalVelocity?: Vector3;
  rotationalVelocity?: Vector3;
  terminalDirectionalVelocity?: Vector3;
  terminalRotationalVelocity?: Vector3;
};

/**
 * @component
 */
export default class PhysicsComponent extends Component {
  constructor(params: PhysicsComponentParams = {}) {
    super();
    this.directionalVelocity = params.directionalVelocity ?? new Vector3();
    this.rotationalVelocity = params.rotationalVelocity ?? new Vector3();
    this.terminalDirectionalVelocity =
      params.terminalDirectionalVelocity ??
      new Vector3(
        Constants.DirectionalVelocityLimit,
        Constants.DirectionalVelocityLimit,
        Constants.DirectionalVelocityLimit,
      );
    this.terminalRotationalVelocity =
      params.terminalRotationalVelocity ??
      new Vector3(
        Constants.RotationalVelocityLimit,
        Constants.RotationalVelocityLimit,
        Constants.RotationalVelocityLimit,
      );
  }

  /**
   * The vector3 of the physics directional velocity.
   * @default 0,0,0
   * @type {Vector3}
   */
  public directionalVelocity: Vector3;

  /**
   * The vector3 of the physics rotational velocity.
   * @default 0,0,0
   * @type {Vector3}
   */
  public rotationalVelocity: Vector3;

  /**
   * The vector3 limit of the physics directional velocity.
   * @default 0,0,0
   * @type {Vector3}
   */
  public terminalDirectionalVelocity: Vector3;

  /**
   * The vector3 limit of the physics rotational velocity.
   * @default 0,0,0
   * @type {Vector3}
   */
  public terminalRotationalVelocity: Vector3;
}

/**
 * @imports
 */
// engine-components
import Component from '@engine-components/Component';

// engine-math
import Vector3 from '@engine-math/Vector3';

/**
 * @component
 */
export default class ScaleUpdateComponent extends Component {
  constructor(
    vector: Vector3,
    isOverride: boolean = false,
    isPersistent: boolean = false,
  ) {
    super();
    this.vector = vector;
    this.isOverride = isOverride;
    this.isPersistent = isPersistent;
  }

  /**
   * The vector to update the scale.
   * @type {Vector3}
   */
  public vector: Vector3;

  /**
   * Whether the update overrides the current scale or adds to it.
   * @default false
   * @type {boolean}
   */
  public isOverride: boolean;

  /**
   * Whether the update persists or is a one-time update.
   * @default false
   * @type {boolean}
   */
  public isPersistent: boolean;
}

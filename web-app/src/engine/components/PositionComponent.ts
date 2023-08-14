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
export default class PositionComponent extends Component {
  constructor(vector: Vector3 = new Vector3()) {
    super();
    this.vector = vector;
  }

  /**
   * The vector3 position
   * @default 0,0,0
   * @type {Vector3}
   */
  public vector: Vector3;
}

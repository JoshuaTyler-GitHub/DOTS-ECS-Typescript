/**
 * @imports
 */
// engine-components
import Component from '@engine-components/Component';

/**
 * @component
 */
export default class GravityComponent extends Component {
  constructor(multiplier: number = 1) {
    super();
    this.multiplier = multiplier;
  }

  /**
   * @default 1
   * @type {number}
   */
  public multiplier: number;
}

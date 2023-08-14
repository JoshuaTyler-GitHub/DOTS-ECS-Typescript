/**
 * @imports
 */
// common-utils
import { uid } from '@common-utils/UidUtils';

/**
 * @class
 */
export default class Component {
  /**
   * @id
   */
  public readonly id: string = `Component-${this.constructor.name}-${uid()}`;

  /**
   * @name
   */
  public readonly name: string = this.constructor.name;
}

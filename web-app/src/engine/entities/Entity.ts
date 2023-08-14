/**
 * @common
 */
import { uid } from '@common-utils/UidUtils';

/**
 * @engine
 */
import Component from '@engine-components/Component';

/**
 * @class
 */
export default class Entity {
  public components: { [key: string]: Component } = {};
  public componentsKey: string = '';
  public readonly id: string = `Entity-${uid()}`;
}

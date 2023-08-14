/**
 * @node_modules
 */
import { Scene } from 'three';

/**
 * @common
 */
import { uid } from '@common-utils/UidUtils';

/**
 * @engine
 */
import CanvasManager from '@engine-managers/CanvasManager';
import SimulationWorld from '@engine-simulation/SimulationWorld';

/**
 * @class
 */
export default class SimulationScene {
  constructor(canvasManager: CanvasManager, world: SimulationWorld) {
    this.canvasManager = canvasManager;
    this.world = world;
  }

  /**
   * @canvasManager
   */
  public readonly canvasManager: CanvasManager;

  /**
   * @id
   */
  public readonly id: string = `${this.constructor.name}-${uid()}`;

  /**
   * @isActive
   */
  public isActive: boolean = true;

  /**
   * @name
   */
  public readonly name: string = this.constructor.name;

  /**
   * @scene
   */
  public readonly scene: Scene = new Scene();

  /**
   * @world
   */
  public readonly world: SimulationWorld;

  /**
   * @async
   * @returns {Promise<void>}
   */
  protected async build(): Promise<void> {
    return Promise.resolve();
  }
}

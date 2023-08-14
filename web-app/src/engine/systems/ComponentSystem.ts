/**
 * @common
 */
import { uid } from '@common-utils/UidUtils';

/**
 * @engine
 */
import Component from '@engine-components/Component';
import Entity from '@engine-entities/Entity';
import SimulationWorld from '@engine-simulation/SimulationWorld';

/**
 * @class
 */
export default class ComponentSystem {
  /**
   * @constructor
   */
  constructor(simulationWorld: SimulationWorld) {
    this.simulationWorld = simulationWorld;
  }

  /**
   * @cachedEntityQuery
   */
  public cachedEntityQuery: Entity[] = [];

  /**
   * @cachedEntityQueryId
   */
  public cachedEntityQueryId: number = 0;

  /**
   * @commandBuffer
   */
  public commandBuffer: Function[] = [];

  /**
   * @cycleStartTime
   */
  public cycleStartTime: number = 0;

  /**
   * @cycleStopTime
   */
  public cycleStopTime: number = 0;

  /**
   * @fixedCycleStartTime
   */
  public fixedCycleStartTime: number = 0;

  /**
   * @fixedCycleStopTime
   */
  public fixedCycleStopTime: number = 0;

  /**
   * @fixedUpdateCount
   */
  public fixedUpdateCount: number = 0;

  /**
   * @fixedUpdateTimer
   */
  public fixedUpdateTimer: number = 0;

  /**
   * @id
   */
  public readonly id: string = `${this.constructor.name}-${uid()}`;

  /**
   * @isCycleRunning
   */
  public isCycleRunning: boolean = false;

  /**
   * @isEnabled
   */
  public isEnabled: boolean = true;

  /**
   * @isFixedCycleRunning
   */
  public isFixedCycleRunning: boolean = false;

  /**
   * @name
   */
  public readonly name: string = this.constructor.name;

  /**
   * @simulationWorld
   */
  protected readonly simulationWorld: SimulationWorld;

  /**
   * @updateCount
   */
  public updateCount: number = 0;

  /**
   * @updateTimer
   */
  public updateTimer: number = 0;

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async afterCycle(): Promise<void> {
    this.cycleStopTime = Date.now();
    this.isCycleRunning = false;
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async afterFixedCycle(): Promise<void> {
    this.fixedCycleStopTime = Date.now();
    this.isFixedCycleRunning = false;
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async beforeCycle(): Promise<void> {
    this.cycleStartTime = Date.now();
    this.isCycleRunning = true;
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async beforeFixedCycle(): Promise<void> {
    this.fixedCycleStartTime = Date.now();
    this.isFixedCycleRunning = true;
  }

  /**
   * @async
   * @param {Function} bufferCommand
   * @returns {Promise<void>}
   */
  protected async bufferCommand(bufferCommand: Function): Promise<void> {
    const { commandBuffer } = this;
    commandBuffer.push(bufferCommand);
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  public async cycle(): Promise<void> {
    // skip the cycle if not enabled
    const { isEnabled } = this;
    if (!isEnabled) return;

    // before cycle
    await this.beforeCycle();

    // only update if running
    const { isCycleRunning } = this;
    if (isCycleRunning) {
      const updateStart = Date.now();

      await this.beforeUpdate();
      await this.update();
      await this.afterUpdate();

      // analytics
      const updateEnd = Date.now();
      const runtime = updateEnd - updateStart;
      this.updateCount++;
      this.updateTimer += runtime;
    }

    // after cycle
    await this.afterCycle();
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  public async executeCommandBuffer(): Promise<void> {
    const { commandBuffer } = this;
    await Promise.all(commandBuffer.map(async (command) => command()));
    this.commandBuffer = [];
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  public async fixedCycle(): Promise<void> {
    // skip the fixed cycle if not enabled
    const { isEnabled } = this;
    if (!isEnabled) return;

    // before fixed cycle
    await this.beforeFixedCycle();

    // only update if running
    const { isFixedCycleRunning } = this;
    if (isFixedCycleRunning) {
      const updateStart = Date.now();

      await this.beforeFixedUpdate();
      await this.fixedUpdate();
      await this.afterFixedUpdate();

      // track analytics
      const updateEnd = Date.now();
      const runtime = updateEnd - updateStart;
      this.fixedUpdateCount++;
      this.fixedUpdateTimer += runtime;
    }

    // after fixed cycle
    await this.afterFixedCycle();
  }

  /**
   * @param {Component[]} components
   * @param {boolean} isExact
   * @returns {Entity[]}
   */
  protected getEntityQuery(
    components: Component[],
    isExact: boolean,
  ): Entity[] {
    const { simulationWorld } = this;
    const { entityManager } = simulationWorld;
    return entityManager.query(components, isExact);
  }

  public async onCreate(): Promise<void> {}
  public async onDestroy(): Promise<void> {}
  public async onStart(): Promise<void> {}
  public async onStop(): Promise<void> {}

  protected async beforeUpdate(): Promise<void> {}
  protected async update(): Promise<void> {}
  protected async afterUpdate(): Promise<void> {}

  protected async beforeFixedUpdate(): Promise<void> {}
  protected async fixedUpdate(): Promise<void> {}
  protected async afterFixedUpdate(): Promise<void> {}
}

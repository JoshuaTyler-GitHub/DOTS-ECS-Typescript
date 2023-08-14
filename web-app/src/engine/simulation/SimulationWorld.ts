/**
 * @common
 */
// enums
import { Time } from '@common-enums/Time';

// logger
import LoggerFactory from '@common-log/LoggerFactory';

// utils
import { uid } from '@common-utils/UidUtils';

/**
 * @engine
 */
// managers
import EntityManager from '@engine-managers/EntityManager';

// errors
import DuplicateSystemError from '@engine-errors/DuplicateSystemError';
import SystemNotFoundError from '@engine-errors/SystemNotFoundError';

// simulation
import SimulationTime from '@engine-simulation/SimulationTime';

// systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @constants
 */
// minimum cycle interval of 5 milliseconds (200 cycles per second)
const MINIMUM_CYCLE_INTERVAL: number = 5;

/**
 * @class
 */
export default class SimulationWorld {
  /**
   * @logger
   */
  private static readonly logger = LoggerFactory.create(SimulationWorld.name);

  /**
   * @constructor
   */
  constructor(
    simulationTime: SimulationTime = new SimulationTime(),
    systems: { [key: string]: ComponentSystem } = {},
  ) {
    this.simulationTime = simulationTime;
    this.systems = systems;
    this.cycleSystems = this.cycleSystems.bind(this);
  }

  /**
   * @cycleIntervalTimer
   */
  private cycleIntervalTimer: NodeJS.Timer | null = null;

  /**
   * @entityManager
   */
  public readonly entityManager: EntityManager = new EntityManager();

  /**
   * @id
   */
  public readonly id: string = `SimulationWorld-${uid()}`;

  /**
   * @isCycleInProgress
   */
  public isCycleInProgress: boolean = false;

  /**
   * @isRunning
   */
  public isRunning: boolean = false;

  /**
   * @simulationTime
   */
  public simulationTime: SimulationTime;

  /**
   * @systems
   */
  public systems: { [key: string]: ComponentSystem };

  /**
   * @async
   * @param {ComponentSystem} system
   * @returns {Promise<void>}
   * @throws {DuplicateSystemError}
   */
  public async addSystem(system: ComponentSystem): Promise<void> {
    const { addSystem, onCreateSystem, systems } = this;
    const systemName = system.name;

    // verify this system does not already exist
    if (systems.hasOwnProperty(systemName)) {
      throw new DuplicateSystemError(
        SimulationWorld.name,
        addSystem.name,
        `System [${systemName}] already exists.`,
      );
    }

    // add the system to the world
    systems[systemName] = system;
    await onCreateSystem(system);
    await system.onCreate();
  }

  /**
   * Cycle is synchronous due to NodeJS.Timer not accepting
   * async callback functions.
   * @returns {void}
   */
  public cycle(): void {
    const { isCycleInProgress } = this;
    if (!isCycleInProgress) {
      this.isCycleInProgress = true;
      this.cycleSystems();
      this.isCycleInProgress = false;
    }
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async cycleSystems(): Promise<void> {
    const { isRunning, simulationTime } = this;
    const {
      previousCycleStart,
      previousFixedCycleStart,
      targetCycleInterval,
      targetFixedCycleInterval,
    } = simulationTime;

    // skip cycle if the SimulationWorld is not running
    if (!isRunning) return;

    // track the world cycle start
    const cycleStart = Date.now();
    const cycleDelta = cycleStart - previousCycleStart;
    const fixedCycleDelta = cycleStart - previousFixedCycleStart;

    // skip this cycle if cycleDelta is less than the targetCycleInterval
    const isCycleSkipped = cycleDelta < targetCycleInterval;

    // skip this fixed cycle if fixedCycleDelta is less than targetFixedCycleInterval
    const isFixedCycleSkipped = fixedCycleDelta < targetFixedCycleInterval;

    // perform the cycle
    const cycles = [];
    simulationTime.cycleStart = cycleStart;

    // cycle
    if (!isCycleSkipped) {
      // calculate deltaTime
      simulationTime.deltaTime = Time.MILLISECONDS_TO_SECONDS * cycleDelta;

      // execute cycle
      cycles.push(this.executeSystemCycle());

      // update previousCycleStart
      simulationTime.previousCycleStart = cycleStart;
    }

    // fixedUpdate
    if (!isFixedCycleSkipped) {
      // calculate fixedDeltaTime
      simulationTime.fixedDeltaTime =
        Time.MILLISECONDS_TO_SECONDS * fixedCycleDelta;

      // execute fixed cycle
      cycles.push(this.executeSystemFixedCycle());

      // update previousFixedCycleStart
      simulationTime.previousFixedCycleStart = cycleStart;
    }

    // await system cycle completion
    await Promise.all(cycles);

    // execute buffered system commands
    await this.executeSystemCommandBuffers();
  }

  /**
   * @param {string} systemName
   * @returns {ComponentSystem}
   * @throws {SystemNotFoundError}
   */
  public getSystem(systemName: string): ComponentSystem {
    const { getSystem, systems } = this;
    if (!systems.hasOwnProperty(systemName)) {
      throw new SystemNotFoundError(
        SimulationWorld.name,
        getSystem.name,
        `No system found with name [${systemName}].`,
      );
    }
    return systems[systemName];
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async executeSystemCommandBuffers(): Promise<void> {
    const { systems } = this;
    await Promise.all(
      Object.values(systems).map((system) => system.executeCommandBuffer()),
    );
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async executeSystemCycle(): Promise<void> {
    const { systems } = this;
    await Promise.all(Object.values(systems).map((system) => system.cycle()));
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  private async executeSystemFixedCycle(): Promise<void> {
    const { systems } = this;
    await Promise.all(
      Object.values(systems).map((system) => system.fixedCycle()),
    );
  }

  /**
   * @async
   * @param {String} systemName
   * @returns {Promise<void>}
   * @throws {SystemNotFoundError}
   */
  public async removeSystem(systemName: string): Promise<void> {
    const { onDestroySystem, systems } = this;
    const system = this.getSystem(systemName);
    await onDestroySystem(system);
    await system.onDestroy();
    delete systems[systemName];
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    const { isRunning, simulationTime } = this;

    // skip if the SimulationWorld is already running
    if (isRunning) return;

    // onStart lifecycle hook
    await this.onStart();

    // set simulationTime
    const worldStart = Date.now();
    simulationTime.previousCycleStart = worldStart;
    simulationTime.previousFixedCycleStart = worldStart;
    simulationTime.worldStart = worldStart;

    // create cycle interval
    this.cycleIntervalTimer = setInterval(() => this.cycle(), MINIMUM_CYCLE_INTERVAL);

    // cycle isRunning
    this.isRunning = true;
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  public async stop(): Promise<void> {
    const { cycleIntervalTimer, isRunning, simulationTime } = this;

    // skip if the SimulationWorld is not running
    if (!isRunning) return;

    // cycle isRunning
    this.isRunning = false;

    // clear cycle interval
    clearInterval(cycleIntervalTimer as NodeJS.Timeout);

    // set simulationTime
    simulationTime.worldStop = Date.now();

    // onStop lifecycle hook
    await this.onStop();
  }

  protected async onStart() {}
  protected async onStop() {}

  protected async onCreateSystem(system: ComponentSystem): Promise<void> {}
  protected async onDestroySystem(system: ComponentSystem): Promise<void> {}
}

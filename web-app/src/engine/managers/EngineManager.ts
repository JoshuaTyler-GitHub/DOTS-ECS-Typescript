/**
 * @engine
 */
import CanvasManagerNotFoundError from '@engine-errors/CanvasManagerNotFoundError';
import DuplicateCanvasManagerError from '@engine-errors/DuplicateCanvasManagerError';
import DuplicateSimulationSceneError from '@engine-errors/DuplicateSimulationSceneError';
import DuplicateSimulationWorldError from '@engine-errors//DuplicateSimulationWorldError';
import SimulationSceneNotFoundError from '@engine-errors//SimulationSceneNotFoundError';
import SimulationWorldNotFoundError from '@engine-errors//SimulationWorldNotFoundError';
import CanvasManager from '@engine-managers/CanvasManager';
import SimulationScene from '@engine-simulation/SimulationScene';
import SimulationWorld from '@engine-simulation/SimulationWorld';

/**
 * @class
 */
export default class EngineManager {
  public static canvasManagers: { [key: string]: CanvasManager } = {};
  public static simulationScenes: { [key: string]: SimulationScene } = {};
  public static simulationWorlds: { [key: string]: SimulationWorld } = {};
  public static selectedCanvasManagerIds: string[] = [];
  public static selectedSimulationSceneIds: string[] = [];
  public static selectedSimulationWorldIds: string[] = [];

  /**
   * @static
   * @param {CanvasManager} canvasManager
   * @returns {void}
   * @throws {DuplicateCanvasManagerError}
   */
  public static addCanvasManager(canvasManager: CanvasManager): void {
    if (EngineManager.canvasManagers.hasOwnProperty(canvasManager.id)) {
      throw new DuplicateCanvasManagerError(
        EngineManager.name,
        EngineManager.addCanvasManager.name,
        `Failed to add a CanvasManager. A CanvasManager already exists for the ID: ${canvasManager.id}.`,
      );
    } else {
      EngineManager.canvasManagers[canvasManager.id] = canvasManager;
    }
  }

  /**
   * @static
   * @param {SimulationScene} simulationScene
   * @returns {void}
   * @throws {DuplicateSceneError}
   */
  public static addSimulationScene(simulationScene: SimulationScene): void {
    if (EngineManager.simulationScenes.hasOwnProperty(simulationScene.id)) {
      throw new DuplicateSimulationSceneError(
        EngineManager.name,
        EngineManager.addSimulationScene.name,
        `Failed to add a SimulationScene. A SimulationScene already exists for the ID: ${simulationScene.id}.`,
      );
    } else {
      EngineManager.simulationScenes[simulationScene.id] = simulationScene;
    }
  }

  /**
   * @static
   * @param {SimulationWorld} simulationWorld
   * @returns {void}
   * @throws {DuplicateWorldError}
   */
  public static addSimulationWorld(simulationWorld: SimulationWorld): void {
    if (EngineManager.simulationWorlds.hasOwnProperty(simulationWorld.id)) {
      throw new DuplicateSimulationWorldError(
        EngineManager.name,
        EngineManager.addSimulationWorld.name,
        `Failed to add a SimulationWorld. A SimulationWorld already exists for the ID: ${simulationWorld.id}.`,
      );
    } else {
      EngineManager.simulationWorlds[simulationWorld.id] = simulationWorld;
    }
  }

  /**
   * @static
   * @param {string} canvasManagerId
   * @returns {void}
   * @throws {CanvasManagerNotFoundError}
   */
  public static selectCanvasManager(canvasManagerId: string): void {
    // if not found, throw error
    if (!EngineManager.canvasManagers.hasOwnProperty(canvasManagerId)) {
      throw new CanvasManagerNotFoundError(
        EngineManager.name,
        EngineManager.selectCanvasManager.name,
        `Failed to select a CanvasManager. No CanvasManager exists for the ID: ${canvasManagerId}.`,
      );
    }

    // if not already selected, select it
    if (!EngineManager.selectedCanvasManagerIds.includes(canvasManagerId)) {
      EngineManager.selectedCanvasManagerIds.push(canvasManagerId);
    }
  }

  /**
   * @static
   * @param {string} simulationSceneId
   * @returns {void}
   * @throws {SimulationSceneNotFoundError}
   */
  public static selectSimulationScene(simulationSceneId: string): void {
    // if not found, throw error
    if (!EngineManager.simulationScenes.hasOwnProperty(simulationSceneId)) {
      throw new SimulationSceneNotFoundError(
        EngineManager.name,
        EngineManager.selectSimulationScene.name,
        `Failed to select a SimulationScene. No SimulationScene exists for the ID: ${simulationSceneId}.`,
      );
    }

    // if not already selected, select it
    if (!EngineManager.selectedSimulationSceneIds.includes(simulationSceneId)) {
      EngineManager.selectedSimulationSceneIds.push(simulationSceneId);
    }
  }

  /**
   * @static
   * @param {string} simulationWorldId
   * @returns {void}
   * @throws {SimulationWorldNotFoundError}
   */
  public static selectSimulationWorld(simulationWorldId: string): void {
    // if not found, throw error
    if (!EngineManager.simulationWorlds.hasOwnProperty(simulationWorldId)) {
      throw new SimulationWorldNotFoundError(
        EngineManager.name,
        EngineManager.selectSimulationWorld.name,
        `Failed to select a SimulationWorld. No SimulationWorld exists for the ID: ${simulationWorldId}.`,
      );
    }

    // if not already selected, select it
    if (!EngineManager.selectedSimulationWorldIds.includes(simulationWorldId)) {
      EngineManager.selectedSimulationWorldIds.push(simulationWorldId);
    }
  }

  /**
   * @static
   * @returns {Promise<void[]>}
   */
  public static startSelectedSimulationWorlds(): Promise<void[]> {
    return Promise.all(
      EngineManager.selectedSimulationWorldIds.map((id: string) =>
        EngineManager.simulationWorlds[id].start(),
      ),
    );
  }

  /**
   * @static
   * @returns {Promise<void[]>}
   */
  public static stopAllSimulationWorlds(): Promise<void[]> {
    return Promise.all(
      Object.values(EngineManager.simulationWorlds).map(
        (simulationWorld: SimulationWorld) => simulationWorld.stop(),
      ),
    );
  }

  /**
   * @static
   * @returns {Promise<void[]>}
   */
  public static stopSelectedSimulationWorlds(): Promise<void[]> {
    return Promise.all(
      EngineManager.selectedSimulationWorldIds.map((id: string) =>
        EngineManager.simulationWorlds[id].stop(),
      ),
    );
  }
}

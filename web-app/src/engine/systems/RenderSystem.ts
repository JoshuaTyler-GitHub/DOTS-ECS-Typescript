/**
 * @engine
 */
import ComponentSystem from '@engine-systems/ComponentSystem';
import SimulationScene from '@engine-simulation/SimulationScene';
import SimulationWorld from '@engine-simulation/SimulationWorld';

/**
 * @class
 */
export default class RenderSystem extends ComponentSystem {
  constructor(
    simulationWorld: SimulationWorld,
    simulationScene: SimulationScene,
  ) {
    super(simulationWorld);
    this.simulationScene = simulationScene;
  }

  /**
   * @scene
   */
  private readonly simulationScene: SimulationScene;

  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async update(): Promise<void> {
    const { simulationScene } = this;
    const { canvasManager, isActive, scene } = simulationScene;
    const { camera, renderer } = canvasManager;

    // skip render if:
    // - simulationScene is not active
    // - canvasManager has no camera
    // - canvasManager has no renderer
    if (!isActive) return;
    if (camera === null) return;
    if (renderer === null) return;

    // render scene
    renderer.render(scene, camera);
  }
}

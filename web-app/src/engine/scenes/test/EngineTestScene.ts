/**
 * @node_modules
 */
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from 'three';

/**
 * @engine
 */
// components
import CameraComponent from '@engine-components/CameraComponent';
import InputControlComponent from '@engine-components/UserInputControlComponent';
import PositionComponent from '@engine-components/PositionComponent';
import PositionUpdateComponent from '@engine-components/PositionUpdateComponent';
import RotationComponent from '@engine-components/RotationComponent';
import RotationUpdateComponent from '@engine-components/RotationUpdateComponent';

// managers
import CanvasManager from '@engine-managers/CanvasManager';

// math
import Vector3 from '@engine-math/Vector3';

// models
import { DefaultCameraParameters } from '@engine-models/CameraParameters';

// simulation
import SimulationScene from '@engine-simulation/SimulationScene';
import SimulationWorld from '@engine-simulation/SimulationWorld';

// systems
import PositionSystem from '@engine-systems/PositionUpdateSystem';
import RenderSystem from '@engine-systems/RenderSystem';
import RotationSystem from '@engine-systems/RotationUpdateSystem';
import ScaleSystem from '@engine-systems/ScaleUpdateSystem';

/**
 * @class
 */
export default class EngineTestScene extends SimulationScene {
  constructor(canvasManager: CanvasManager, world: SimulationWorld) {
    super(canvasManager, world);
    const { scene } = this;

    // systems
    const { entityManager } = world;
    world.addSystem(new RenderSystem(world, this));
    world.addSystem(new PositionSystem(world));
    world.addSystem(new RotationSystem(world));
    world.addSystem(new ScaleSystem(world));

    // entity - camera
    const cameraParameters = DefaultCameraParameters;
    const { aspect, far, fov, near } = cameraParameters;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    const cameraEntity = entityManager.create([
      new CameraComponent(cameraParameters),
      new InputControlComponent(),
      new PositionComponent(camera.position),
      new PositionUpdateComponent(new Vector3(0, 3, 5), true, false),
      new RotationComponent(camera.rotation),
      new RotationUpdateComponent(new Vector3(-0.33, 0, 0), true, false),
    ]);
    canvasManager.setCamera(camera);

    // entity - cube
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x3f7b9d });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    const cubeEntity = entityManager.create([
      new RotationComponent(cube.rotation),
      new RotationUpdateComponent(new Vector3(0.5, 0.5, 0.5), false, true),
    ]);

    // debug
    console.log('cameraEntity', camera, cameraEntity);
    console.log('cubeEntity', cube, cubeEntity);
  }
}

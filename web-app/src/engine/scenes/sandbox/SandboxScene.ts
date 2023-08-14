/**
 * @imports
 */
// node_modules
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
} from 'three';

// engine - components
import CameraComponent from '@engine-components/CameraComponent';
import CreativeFlightMovementComponent from '@engine-components/CreativeFlightMovementComponent';
import GravityComponent from '@engine-components/GravityComponent';
import PhysicsComponent from '@engine-components/PhysicsComponent';
import PositionComponent from '@engine-components/PositionComponent';
import PositionUpdateComponent from '@engine-components/PositionUpdateComponent';
import RainingObjectComponent from '@engine-components/RainingObjectComponent';
import RotationComponent from '@engine-components/RotationComponent';
import RotationUpdateComponent from '@engine-components/RotationUpdateComponent';
import UserInputControlComponent from '@engine-components/UserInputControlComponent';

// engine - factories
import SkyBoxFactory from '@engine-factories/SkyBoxFactory';

// engine - managers
import CanvasManager from '@engine-managers/CanvasManager';

// engine - math
import Vector3 from '@engine-math/Vector3';

// engine - models
import { DefaultCameraParameters } from '@engine-models/CameraParameters';

// engine - resources
import Sunrise from '@engine-resources/images/skyboxes/Sunrise.jpg';

// engine - simulation
import SimulationScene from '@engine-simulation/SimulationScene';
import SimulationWorld from '@engine-simulation/SimulationWorld';

// engine - systems
import CreativeFlightMovementSystem from '@engine-systems/CreativeFlightMovementSystem';
import GravitySystem from '@engine-systems/GravitySystem';
import PhysicsSystem from '@engine-systems/PhysicsSystem';
import PositionUpdateSystem from '@engine-systems/PositionUpdateSystem';
import RainingObjectSystem from '@engine-systems/RainingObjectSystem';
import RenderSystem from '@engine-systems/RenderSystem';
import RotationUpdateSystem from '@engine-systems/RotationUpdateSystem';
import ScaleUpdateSystem from '@engine-systems/ScaleUpdateSystem';

/**
 * @constants
 */
const RAINING_CUBE_COUNT = 100;
const STATIONARY_CUBE_COUNT = 10;

/**
 * @class
 */
export default class RainingCubesScene extends SimulationScene {
  constructor(canvasManager: CanvasManager, world: SimulationWorld) {
    super(canvasManager, world);
    this.build();
  }

  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  protected override async build(): Promise<void> {
    const { canvasManager, scene, world } = this;
    const { entityManager } = world;

    // axes helper
    const axesHelper = new AxesHelper(5);
    axesHelper.position.set(0, 2, 0);
    scene.add(axesHelper);

    // entity - camera
    {
      const cameraParameters = DefaultCameraParameters;
      const { aspect, far, fov, near } = cameraParameters;
      const camera = new PerspectiveCamera(fov, aspect, near, far);
      entityManager.create([
        new CameraComponent(cameraParameters),
        new CreativeFlightMovementComponent(),
        new PhysicsComponent(),
        new PositionComponent(camera.position),
        new PositionUpdateComponent(new Vector3(0, 5, -15), true, false),
        new RotationComponent(camera.rotation),
        new RotationUpdateComponent(new Vector3(0.33, Math.PI, 0), true, false),
        new UserInputControlComponent(),
      ]);
      canvasManager.setCamera(camera);
    }

    // entity - terrain
    {
      const geometry = new BoxGeometry(100, 1, 100);
      const material = new MeshBasicMaterial({ color: 0x4f575c });
      const terrain = new Mesh(geometry, material);
      scene.add(terrain);
    }

    // entities - raining cubes
    {
      const terminalDirectionalVelocity = new Vector3(1, 3, 1);
      for (let i = 0; i < RAINING_CUBE_COUNT; i++) {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x3f7b9d });
        const cube = new Mesh(geometry, material);
        const randomPositionX = (Math.random() - 0.5) * 100;
        const randomPositionY = Math.random() * 100;
        const randomPositionZ = (Math.random() - 0.5) * 100;
        const randomRotation = (Math.random() - 0.5) * 5;
        const rotationalVelocity = new Vector3(
          randomRotation,
          randomRotation,
          randomRotation,
        );
        scene.add(cube);
        entityManager.create([
          new GravityComponent(),
          new PhysicsComponent({
            rotationalVelocity,
            terminalDirectionalVelocity,
          }),
          new PositionComponent(cube.position),
          new PositionUpdateComponent(
            new Vector3(randomPositionX, randomPositionY, randomPositionZ),
            true,
            false,
          ),
          new RainingObjectComponent(),
          new RotationComponent(cube.rotation),
        ]);
      }
    }

    // entities - stationary cubes - X
    {
      for (let i = 0; i < STATIONARY_CUBE_COUNT; i++) {
        const position = (i - 5) * 2;
        const geometry = new BoxGeometry(1, 1, 1);
        let color = 0xc7c41e;
        if (position > 0) color = 0xed6b6b;
        if (position < 0) color = 0x821a1a;
        const material = new MeshBasicMaterial({ color });
        const cube = new Mesh(geometry, material);
        scene.add(cube);
        entityManager.create([
          new PositionComponent(cube.position),
          new PositionUpdateComponent(new Vector3(position, 1, 0), true, false),
          new RotationComponent(cube.rotation),
        ]);
      }
    }

    // entities - stationary cubes - z
    {
      for (let i = 0; i < STATIONARY_CUBE_COUNT; i++) {
        const position = (i - 5) * 2;
        const geometry = new BoxGeometry(1, 1, 1);
        let color = 0xc7c41e;
        if (position > 0) color = 0x4a54e0;
        if (position < 0) color = 0x0d1257;
        const material = new MeshBasicMaterial({ color });
        const cube = new Mesh(geometry, material);
        scene.add(cube);
        entityManager.create([
          new PositionComponent(cube.position),
          new PositionUpdateComponent(new Vector3(0, 1, position), true, false),
          new RotationComponent(cube.rotation),
        ]);
      }
    }

    // skybox
    SkyBoxFactory.build(Sunrise.src).then((texture) => {
      scene.background = texture;
    });

    // systems
    world.addSystem(new CreativeFlightMovementSystem(world));
    world.addSystem(new GravitySystem(world));
    world.addSystem(new PhysicsSystem(world));
    world.addSystem(new RainingObjectSystem(world));
    world.addSystem(new RenderSystem(world, this));
    world.addSystem(new PositionUpdateSystem(world));
    world.addSystem(new RotationUpdateSystem(world));
    world.addSystem(new ScaleUpdateSystem(world));
  }
}

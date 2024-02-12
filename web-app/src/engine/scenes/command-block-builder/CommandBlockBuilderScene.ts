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
      const cameraEntity = entityManager.create([
        new CameraComponent(cameraParameters),
        new CreativeFlightMovementComponent(),
        new PhysicsComponent(),
        new PositionComponent(camera.position),
        new PositionUpdateComponent(new Vector3(0, 5, -15), true, false),
        new RotationComponent(camera.rotation),
        new RotationUpdateComponent(new Vector3(0, Math.PI, 0), true, false),
        new UserInputControlComponent(),
      ]);
      if(window.localStorage.getItem('camera-position')) {
        const { x, y, z } = JSON.parse(window.localStorage.getItem('camera-position'));
        entityManager.addComponent(cameraEntity, new PositionUpdateComponent();
      }
      canvasManager.setCamera(camera);
      setInterval(() => {
        window.localStorage.setItem('camera-position', JSON.stringify(camera.position));
        window.localStorage.setItem('camera-rotation', JSON.stringify(camera.position));
      }, 100);
    }

    // entity - terrain
    {
      const geometry = new BoxGeometry(100, 1, 100);
      const material = new MeshBasicMaterial({ color: 0x4f575c });
      const terrain = new Mesh(geometry, material);
      terrain.position.y = -1;
      scene.add(terrain);
    }

    // entities - cubes
    COMMANDS.forEach((command) => {
      const { block, from, to } = command;
      const [x1, y1, z1] = from;
      const [x2, y2, z2] = to;
      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          for (let z = z1; z <= z2; z++) {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({
              color: getMaterialColor(block),
            });
            const cube = new Mesh(geometry, material);
            scene.add(cube);
            entityManager.create([
              new PositionComponent(cube.position),
              new PositionUpdateComponent(new Vector3(x, y, z), true, false),
              new RotationComponent(cube.rotation),
            ]);
          }
        }
      }
    });

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

export const ROOT_POSITION: number[] = [0, 0, 0];
export const COMMANDS = [
  // foundation
  { command: 'fill', from: ROOT_POSITION, to: [16, 0, 16], block: 'stone_bricks' },
];
export function getMaterialColor(block: string): number {
  switch (block) {
    case 'stone':
      return 0x9e9e9e;
    case 'stone_bricks':
      return 0x6d6d6d;
    default:
      return 0xfff;
  }
}

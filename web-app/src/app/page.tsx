'use client';

/**
 * @node_modules
 */
import { ReactElement } from 'react';

/**
 * @app
 */
// app-engine
import ManagedCanvas from '@app-components/engine/ManagedCanvas';

/**
 * @engine
 */
// engine-managers
import CanvasManager from '@engine-managers/CanvasManager';
import UserInputManager from '@engine-managers/UserInputManager';

// engine-scenes
import CommandBlockBuilderScene from '@engine-scenes/command-block-builder/CommandBlockBuilderScene';

// engine-simulation
import SimulationWorld from '@engine-simulation/SimulationWorld';

/**
 * @component
 */
export default function Home(): ReactElement {
  /**
   * @callbacks
   */
  const onCanvasManager = (canvasManager: CanvasManager): void => {
    const simulationWorld = new SimulationWorld();
    const scene = new CommandBlockBuilderScene(canvasManager, simulationWorld);
    console.log('scene', scene);

    // canvas controls
    canvasManager.onKeyDown = (event: Event): void => {
      UserInputManager.keyDown(event);
    };
    canvasManager.onKeyUp = (event: Event): void => {
      UserInputManager.keyUp(event);
    };
    canvasManager.onMouseDown = (event: Event): void => {
      UserInputManager.mouseDown(event);
    };
    canvasManager.onMouseUp = (event: Event): void => {
      UserInputManager.mouseUp(event);
    };

    // start simulation
    simulationWorld.start();
  };

  /**
   * @render
   */
  return (
    <main>
      <ManagedCanvas onCanvasManager={onCanvasManager} />
    </main>
  );
}

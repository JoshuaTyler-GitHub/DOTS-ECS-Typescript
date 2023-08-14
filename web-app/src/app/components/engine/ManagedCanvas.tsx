// node_modules
import { ReactElement, useEffect, useRef, useState } from 'react';

/**
 * @app
 */
import { ReactElementProps } from '@app-models/react/ReactElementProps';

/**
 * @engine
 */
import CanvasManager from '@engine-managers/CanvasManager';

/**
 * @props
 */
export type ManagedCanvasProps = ReactElementProps & {
  onCanvasManager: (canvasManager: CanvasManager) => void;
};

/**
 * @component
 */
export default function ManagedCanvas(props: ManagedCanvasProps): ReactElement {
  /**
   * @props
   */
  const { onCanvasManager } = props;

  /**
   * @ref
   */
  const ref = useRef<HTMLCanvasElement>(null);

  /**
   * @state
   */
  const [height, setHeight] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [manager] = useState(() => new CanvasManager());
  const [width, setWidth] = useState<number>(0);

  /**
   * @effects
   */
  useEffect(() => {
    const { current } = ref;
    const canvasElement = manager.getCanvasElement();
    if (current !== null && canvasElement === null) {
      manager.initialize(current, setHeight, setWidth);
      manager.onBlur = () => setIsFocused(false);
      manager.onFocus = () => setIsFocused(true);
      onCanvasManager(manager);
    }
  }, [manager, ref, onCanvasManager]);

  /**
   * @render
   */
  return (
    <canvas
      height={height}
      id={'world-canvas'}
      ref={ref}
      style={{
        backgroundColor: 'black',
        cursor: isFocused ? 'none' : 'default',
        display: 'block',
        height: '500px',
        outline: 'none',
        width: '500px',
      }}
      tabIndex={0}
      width={width}
    />
  );
}

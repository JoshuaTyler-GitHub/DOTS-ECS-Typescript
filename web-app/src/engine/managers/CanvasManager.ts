/**
 * @node_modules
 */
import _ from 'lodash';
import { PerspectiveCamera, WebGLRenderer } from 'three';

/**
 * @common
 */
// common-utils
import { uid } from '@common-utils/UidUtils';

/**
 * @engine
 */
// engine-enums
import { HTMLEvents } from '@engine-enums/HTMLEvents';

/**
 * @constants
 */
const RESIZE_MINIMUM_WAIT_TIME: number = 50;

/**
 * @class
 */
export default class CanvasManager {
  constructor() {
    this.blur = this.blur.bind(this);
    this.focus = this.focus.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.resize = _.debounce(this.resize.bind(this), RESIZE_MINIMUM_WAIT_TIME, {
      trailing: true,
    });
  }

  private camera: PerspectiveCamera | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasHeight: number = 0;
  private canvasWidth: number = 0;
  public readonly id: string = `${this.constructor.name}-${uid()}`;
  private isFocused: boolean = false;
  private renderer: WebGLRenderer | null = null;
  public onCanvasHeight: Function | null = null;
  public onCanvasWidth: Function | null = null;
  public onBlur: Function | null = null;
  public onFocus: Function | null = null;
  public onKeyDown: Function | null = null;
  public onKeyUp: Function | null = null;
  public onMouseDown: Function | null = null;
  public onMouseUp: Function | null = null;
  public onResize: Function | null = null;

  /**
   * @returns {void}
   */
  public getCamera(): PerspectiveCamera | null {
    return this.camera;
  }

  /**
   * @returns {void}
   */
  public getCanvasElement(): HTMLCanvasElement | null {
    return this.canvasElement;
  }

  /**
   * setCamera forces a resizeCanvas() call to
   * update the camera's projection matrix.
   * @param {PerspectiveCamera} camera
   * @returns {void}
   */
  public setCamera(camera: PerspectiveCamera): void {
    this.camera = camera;
    this.resizeCanvas();
  }

  /**
   * @param {HTMLCanvasElement} canvasElement
   * @returns {void} void
   */
  private addListeners(canvasElement: HTMLCanvasElement): void {
    canvasElement.addEventListener(HTMLEvents.BLUR, this.blur);
    canvasElement.addEventListener(HTMLEvents.FOCUS, this.focus);
    canvasElement.addEventListener(HTMLEvents.KEY_DOWN, this.keyDown);
    canvasElement.addEventListener(HTMLEvents.KEY_UP, this.keyUp);
    canvasElement.addEventListener(HTMLEvents.RESIZE, this.resize);
    window.addEventListener(HTMLEvents.RESIZE, this.resize);
  }

  /**
   * @param {Event} event
   * @returns {void} void
   */
  private blur(event: Event): void {
    const { onBlur } = this;
    this.isFocused = false;
    if (onBlur !== null) {
      onBlur(event);
    }
  }

  /**
   * @param {Event} event
   * @returns {void} void
   */
  private focus(event: Event): void {
    const { onFocus } = this;
    this.isFocused = true;
    if (onFocus !== null) {
      onFocus(event);
    }
  }

  /**
   * @param {HTMLCanvasElement} canvasElement
   * @param {Function} onCanvasHeight
   * @param {Function} onCanvasWidth
   * @returns {void} void
   */
  public initialize(
    canvasElement: HTMLCanvasElement,
    onCanvasHeight: Function,
    onCanvasWidth: Function,
  ): void {
    this.canvasElement = canvasElement;
    this.renderer = new WebGLRenderer({ canvas: canvasElement });
    this.onCanvasHeight = onCanvasHeight;
    this.onCanvasWidth = onCanvasWidth;
    this.addListeners(canvasElement);
    this.resizeCanvas();
  }

  /**
   * @param {Event} event
   * @returns {void} void
   */
  private keyDown(event: Event): void {
    const { isFocused, onKeyDown } = this;
    if (isFocused && onKeyDown !== null) {
      event.preventDefault();
      onKeyDown(event);
    }
  }

  /**
   * @param {Event} event
   * @returns {void} void
   */
  private keyUp(event: Event): void {
    const { isFocused, onKeyUp } = this;
    if (isFocused && onKeyUp !== null) {
      event.preventDefault();
      onKeyUp(event);
    }
  }

  /**
   * @param {Event} event
   * @returns {void}
   */
  private resize(event: Event): void {
    const { onResize } = this;

    // calculate resized height & width
    this.resizeCanvas();

    // callback with event
    if (onResize !== null) {
      onResize(event);
    }
  }

  /**
   * @returns {void}
   */
  private resizeCanvas(): void {
    const { camera, canvasElement, renderer, onCanvasHeight, onCanvasWidth } =
      this;
    if (camera !== null && canvasElement !== null && renderer !== null) {
      const pixelRatio = window.devicePixelRatio || 1;
      const canvasHeight = canvasElement.clientHeight * pixelRatio;
      const canvasWidth = canvasElement.clientWidth * pixelRatio;

      // only resize if needed
      if (
        canvasElement.height !== canvasHeight ||
        canvasElement.width !== canvasWidth
      ) {
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;

        // update renderer
        renderer.setSize(canvasWidth, canvasHeight, false);

        // update camera
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

        // callback with new canvas height & width
        if (onCanvasHeight !== null && onCanvasWidth !== null) {
          onCanvasHeight(canvasHeight);
          onCanvasWidth(canvasWidth);
        }
      }
    }
  }
}

/**
 * @imports
 */
// engine-components
import Component from '@engine-components/Component';

// engine-models
import {
  CameraParameters,
  DefaultCameraParameters,
} from '@engine-models/CameraParameters';

/**
 * @component
 */
export default class CameraComponent extends Component {
  constructor(cameraParameters: CameraParameters = DefaultCameraParameters) {
    super();
    const {
      aspect,
      far,
      filmGuage,
      filmOffset,
      fov,
      frustumCulled,
      near,
      zoom,
    } = cameraParameters;
    this.aspect = aspect;
    this.far = far;
    this.filmGuage = filmGuage;
    this.filmOffset = filmOffset;
    this.fov = fov;
    this.frustumCulled = frustumCulled;
    this.near = near;
    this.zoom = zoom;
  }

  /**
   * Camera frustum aspect ratio, usually the canvas width / canvas height.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.aspect
   * @default 1
   * @type {number}
   */
  public aspect: number;

  /**
   * Camera frustum far plane.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.far
   * @default 2000
   * @type {number}
   */
  public far: number;

  /**
   * Film size used for the larger axis (millimeters).
   * This parameter does not influence the projection matrix unless
   * [filmOffset] is set to a nonzero value.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.filmGauge
   * @default 35
   * @type {number}
   */
  public filmGuage: number;

  /**
   * Horizontal off-center offset in the same unit as [filmGauge].
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.filmOffset
   * @default 0
   * @type {number}
   */
  public filmOffset: number;

  /**
   * Camera frustum vertical field of view, from bottom to top of view, in degrees.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov
   * @default 60
   * @type {number}
   */
  public fov: number;

  /**
   * Whether to apply matrix transforms to the frustum culling calculation.
   * @see https://threejs.org/docs/#api/en/cameras/Camera.frustumCulled
   * @default true
   * @type {boolean}
   */
  public frustumCulled: boolean;

  /**
   * Camera frustum near plane.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.near
   * @default 0.1
   * @type {number}
   */
  public near: number;

  /**
   * Camera zoom factor.
   * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.zoom
   * @default 1
   * @type {number}
   */
  public zoom: number;
}

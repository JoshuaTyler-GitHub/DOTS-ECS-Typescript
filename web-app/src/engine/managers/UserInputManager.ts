/**
 * @imports
 */
// engine-enums
import { UserInput } from '@engine-enums/UserInput';

/**
 * @class
 */
export default class UserInputManager {
  public static controls = {
    backward: false,
    crouch: false,
    forward: false,
    isMouseDown: false,
    jump: false,
    left: false,
    right: false,
    rotateLeft: false,
    rotateRight: false,
    sprint: false,
  };

  public static keyDown(event: Event): void {
    const { controls } = UserInputManager;
    const { code } = event as KeyboardEvent;
    switch (code) {
      case UserInput.W:
        controls.forward = true;
        break;
      case UserInput.S:
        controls.backward = true;
        break;
      case UserInput.A:
        controls.left = true;
        break;
      case UserInput.D:
        controls.right = true;
        break;
      case UserInput.C:
        controls.crouch = true;
        break;
      case UserInput.SHIFT_LEFT:
        controls.sprint = true;
        break;
      case UserInput.SPACE:
        controls.jump = true;
        break;
      case UserInput.Q:
        controls.rotateLeft = true;
        break;
      case UserInput.E:
        controls.rotateRight = true;
        break;
      default:
        break;
    }
  }

  public static keyUp(event: Event): void {
    const { controls } = UserInputManager;
    const { code } = event as KeyboardEvent;
    switch (code) {
      case UserInput.W:
        controls.forward = false;
        break;
      case UserInput.S:
        controls.backward = false;
        break;
      case UserInput.A:
        controls.left = false;
        break;
      case UserInput.D:
        controls.right = false;
        break;
      case UserInput.C:
        controls.crouch = false;
        break;
      case UserInput.SHIFT_LEFT:
        controls.sprint = false;
        break;
      case UserInput.SPACE:
        controls.jump = false;
        break;
      case UserInput.Q:
        controls.rotateLeft = false;
        break;
      case UserInput.E:
        controls.rotateRight = false;
        break;
      default:
        break;
    }
  }

  public static mouseDown(event: Event): void {
    UserInputManager.controls.isMouseDown = true;
  }

  public static mouseUp(event: Event): void {
    UserInputManager.controls.isMouseDown = false;
  }
}

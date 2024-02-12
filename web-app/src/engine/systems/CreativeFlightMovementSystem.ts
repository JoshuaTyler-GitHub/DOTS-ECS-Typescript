/**
 * @imports
 */
// engine-components
import CreativeFlightMovementComponent from '@engine-components/CreativeFlightMovementComponent';
import PhysicsComponent from '@engine-components/PhysicsComponent';
import RotationComponent from '@engine-components/RotationComponent';
import UserInputControlComponent from '@engine-components/UserInputControlComponent';

// engine-managers
import UserInputManager from '@engine-managers/UserInputManager';

// engine-systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @system
 */
export default class CreativeFlightMovementSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async fixedUpdate(): Promise<void> {
    const { simulationWorld } = this;
    const { simulationTime } = simulationWorld;
    const { fixedDeltaTime } = simulationTime;
    const { controls } = UserInputManager;
    const {
      backward,
      crouch,
      forward,
      jump,
      left,
      right,
      rotateLeft,
      rotateRight,
      sprint,
    } = controls;

    // query entities
    const entities = this.getEntityQuery(
      [
        CreativeFlightMovementComponent.prototype,
        PhysicsComponent.prototype,
        RotationComponent.prototype,
        UserInputControlComponent.prototype,
      ],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const creativeFlightMovementComponent = components[CreativeFlightMovementComponent.name] as CreativeFlightMovementComponent; // prettier-ignore
        const physicsComponent = components[PhysicsComponent.name] as PhysicsComponent; // prettier-ignore
        const rotationComponent = components[RotationComponent.name] as RotationComponent; // prettier-ignore
        const { directionalVelocity, rotationalVelocity } = physicsComponent;
        const { acceleration, decceleration, speed, speedMultiplier } = creativeFlightMovementComponent; // prettier-ignore
        const { vector: rotation } = rotationComponent;

        // calculate new rotational velocity
        const rotationYPlus = rotateRight ? -1 : 0;
        const rotationYMinus = rotateLeft ? 1 : 0;
        rotationalVelocity.y = rotationYPlus + rotationYMinus;

        // calculate targeted speed
        let speedTarget = speed;
        if (crouch) speedTarget = speed * 0.5;
        if (sprint) speedTarget = speed * speedMultiplier;

        // apply speedTarget directionally
        const xPlus = left ? 1 * speedTarget : 0;
        const xMinus = right ? -1 * speedTarget : 0;
        const yPlus = jump ? 1 * speedTarget : 0;
        const yMinus = crouch ? -1 * speedTarget : 0;
        const zPlus = forward ? 1 * speedTarget : 0;
        const zMinus = backward ? -1 * speedTarget : 0;

        // adjust directional velocity based on forward direction
        const forwardVelocity = rotation.y / Math.PI;
        // console.log('forwardVelocity', forwardVelocity);

        // add to directional velocity
        directionalVelocity.x = (xPlus + xMinus) * rotation.x;
        directionalVelocity.y = (yPlus + yMinus) * rotation.y;
        directionalVelocity.z = (zPlus + zMinus) * rotation.z;
      }),
    );
  }
}

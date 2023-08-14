/**
 * @imports
 */
// engine - components
import PhysicsComponent from '@engine-components/PhysicsComponent';
import PositionComponent from '@engine-components/PositionComponent';
import RotationComponent from '@engine-components/RotationComponent';

// engine - systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @system
 */
class PhysicsSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async fixedUpdate(): Promise<void> {
    const { simulationWorld } = this;
    const { simulationTime } = simulationWorld;
    const { fixedDeltaTime } = simulationTime;

    // query entities
    const entities = this.getEntityQuery(
      [
        PhysicsComponent.prototype,
        PositionComponent.prototype,
        RotationComponent.prototype,
      ],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const physicsComponent = components[PhysicsComponent.name] as PhysicsComponent; // prettier-ignore
        const positionComponent = components[PositionComponent.name] as PositionComponent; // prettier-ignore
        const rotationComponent = components[RotationComponent.name] as RotationComponent; // prettier-ignore
        const {
          directionalVelocity: preLimitedDirectionalVelocity,
          rotationalVelocity: preLimitedRotationalVelocity,
          terminalDirectionalVelocity,
          terminalRotationalVelocity,
        } = physicsComponent;
        const { vector: position } = positionComponent;
        const { vector: rotation } = rotationComponent;

        // limit directional velocity
        physicsComponent.directionalVelocity.x = preLimitedDirectionalVelocity.x < 0
          ? Math.max(preLimitedDirectionalVelocity.x, -terminalDirectionalVelocity.x) // prettier-ignore
          : Math.min(preLimitedDirectionalVelocity.x, terminalDirectionalVelocity.x); // prettier-ignore
        physicsComponent.directionalVelocity.y = preLimitedDirectionalVelocity.y < 0
          ? Math.max(preLimitedDirectionalVelocity.y, -terminalDirectionalVelocity.y) // prettier-ignore
          : Math.min(preLimitedDirectionalVelocity.y, terminalDirectionalVelocity.y); // prettier-ignore
        physicsComponent.directionalVelocity.z = preLimitedDirectionalVelocity.z < 0
          ? Math.max(preLimitedDirectionalVelocity.z, -terminalDirectionalVelocity.z) // prettier-ignore
          : Math.min(preLimitedDirectionalVelocity.z, terminalDirectionalVelocity.z); // prettier-ignore

        // limit rotational velocity
        physicsComponent.rotationalVelocity.x = preLimitedRotationalVelocity.x < 0
          ? Math.max(preLimitedRotationalVelocity.x, -terminalRotationalVelocity.x) // prettier-ignore
          : Math.min(preLimitedRotationalVelocity.x, terminalRotationalVelocity.x); // prettier-ignore
        physicsComponent.rotationalVelocity.y = preLimitedRotationalVelocity.y < 0
          ? Math.max(preLimitedRotationalVelocity.y, -terminalRotationalVelocity.y) // prettier-ignore
          : Math.min(preLimitedRotationalVelocity.y, terminalRotationalVelocity.y); // prettier-ignore
        physicsComponent.rotationalVelocity.z = preLimitedRotationalVelocity.z < 0
          ? Math.max(preLimitedRotationalVelocity.z, -terminalRotationalVelocity.z) // prettier-ignore
          : Math.min(preLimitedRotationalVelocity.z, terminalRotationalVelocity.z); // prettier-ignore

        // update physics
        const { directionalVelocity, rotationalVelocity } = physicsComponent;

        // add to position
        position.x += directionalVelocity.x * fixedDeltaTime;
        position.y += directionalVelocity.y * fixedDeltaTime;
        position.z += directionalVelocity.z * fixedDeltaTime;

        // add to rotation
        rotation.x += rotationalVelocity.x * fixedDeltaTime;
        rotation.y += rotationalVelocity.y * fixedDeltaTime;
        rotation.z += rotationalVelocity.z * fixedDeltaTime;
      }),
    );
  }
}
export default PhysicsSystem;

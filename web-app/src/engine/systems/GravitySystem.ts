/**
 * @imports
 */
// engine - components
import GravityComponent from '@engine-components/GravityComponent';
import PhysicsComponent from '@engine-components/PhysicsComponent';

// engine - enums
import { Constants } from '@engine-enums/Physics';

// engine - systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @class
 */
export default class GravitySystem extends ComponentSystem {
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
      [GravityComponent.prototype, PhysicsComponent.prototype],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // calculate fixed delta gravity
    const fixedDeltaGravity = Constants.Gravity * fixedDeltaTime;

    // update position for each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const gravityComponent = components[GravityComponent.name] as GravityComponent; // prettier-ignore
        const physicsComponent = components[PhysicsComponent.name] as PhysicsComponent; // prettier-ignore
        const { multiplier } = gravityComponent;
        const { directionalVelocity } = physicsComponent;

        // add to vertical (y) directionalVelocity
        directionalVelocity.y -= multiplier * fixedDeltaGravity;
      }),
    );
  }
}

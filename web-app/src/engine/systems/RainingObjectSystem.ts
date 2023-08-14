/**
 * @imports
 */
// engine-components
import PositionComponent from '@engine-components/PositionComponent';
import PositionUpdateComponent from '@engine-components/PositionUpdateComponent';
import RainingObjectComponent from '@engine-components/PhysicsComponent';

// engine-math
import Vector3 from '@engine-math/Vector3';

// engine-systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @class
 */
export default class RainingObjectSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async fixedUpdate(): Promise<void> {
    const { simulationWorld } = this;
    const { entityManager } = simulationWorld;

    // query entities
    const entities = this.getEntityQuery(
      [PositionComponent.prototype, RainingObjectComponent.prototype],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update position for each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const positionComponent = components[PositionComponent.name] as PositionComponent; // prettier-ignore
        const { vector: position } = positionComponent;

        // reset position if out of bounds (with a random 1% chance)
        const isReseting =
          components[PositionUpdateComponent.name] !== undefined;
        if (!isReseting && position.y < -10 && Math.random() < 0.01) {
          entityManager.addComponent(
            entity,
            new PositionUpdateComponent(
              new Vector3(position.x, 100, position.z),
              true,
              false,
            ),
          );
        }
      }),
    );
  }
}

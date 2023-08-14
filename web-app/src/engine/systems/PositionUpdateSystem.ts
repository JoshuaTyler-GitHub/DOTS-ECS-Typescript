/**
 * @imports
 */
// engine - components
import PositionComponent from '@engine-components/PositionComponent';
import PositionUpdateComponent from '@engine-components/PositionUpdateComponent';

// engine - systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @system
 */
class PositionSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async update(): Promise<void> {
    const { simulationWorld } = this;
    const { entityManager, simulationTime } = simulationWorld;
    const { fixedDeltaTime } = simulationTime;

    // query entities with PositionComponent and PositionUpdateComponent
    const entities = this.getEntityQuery(
      [PositionComponent.prototype, PositionUpdateComponent.prototype],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update position for each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const positionComponent = components[PositionComponent.name] as PositionComponent; // prettier-ignore
        const positionUpdateComponent = components[PositionUpdateComponent.name] as PositionUpdateComponent; // prettier-ignore
        const { vector: position } = positionComponent;
        const {
          vector: positionUpdate,
          isOverride,
          isPersistent,
        } = positionUpdateComponent;
        const { x, y, z } = positionUpdate;

        // override position
        if (isOverride) {
          position.x = x;
          position.y = y;
          position.z = z;
        }

        // add to position
        else {
          position.x += x * fixedDeltaTime;
          position.y += y * fixedDeltaTime;
          position.z += z * fixedDeltaTime;
        }

        // remove positionUpdate component if not persistent
        if (!isPersistent) {
          this.bufferCommand(() =>
            entityManager.removeComponent(entity, PositionUpdateComponent.name),
          );
        }
      }),
    );
  }
}
export default PositionSystem;

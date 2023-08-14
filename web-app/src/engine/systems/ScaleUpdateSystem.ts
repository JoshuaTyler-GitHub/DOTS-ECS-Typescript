/**
 * @imports
 */
// engine - components
import ScaleComponent from '@engine-components/ScaleComponent';
import ScaleUpdateComponent from '@engine-components/ScaleUpdateComponent';

// engine - systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @system
 */
class ScaleSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async update(): Promise<void> {
    const { simulationWorld } = this;
    const { entityManager, simulationTime } = simulationWorld;
    const { fixedDeltaTime } = simulationTime;

    // query entities with ScaleComponent and ScaleUpdateComponent
    const entities = this.getEntityQuery(
      [ScaleComponent.prototype, ScaleUpdateComponent.prototype],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update scale for each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const scaleComponent = components[ScaleComponent.name] as ScaleComponent; // prettier-ignore
        const scaleUpdateComponent = components[ScaleUpdateComponent.name] as ScaleUpdateComponent; // prettier-ignore
        const { vector: scale } = scaleComponent;
        const {
          vector: scaleUpdate,
          isOverride,
          isPersistent,
        } = scaleUpdateComponent;
        const { x, y, z } = scaleUpdate;

        // override scale
        if (isOverride) {
          scale.x = x;
          scale.y = y;
          scale.z = z;
        }

        // add to scale
        else {
          scale.x += x * fixedDeltaTime;
          scale.y += y * fixedDeltaTime;
          scale.z += z * fixedDeltaTime;
        }

        // remove scaleUpdate component if not persistent
        if (!isPersistent) {
          this.bufferCommand(() =>
            entityManager.removeComponent(entity, ScaleUpdateComponent.name),
          );
        }
      }),
    );
  }
}
export default ScaleSystem;

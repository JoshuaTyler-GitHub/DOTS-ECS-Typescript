/**
 * @imports
 */
// engine - components
import RotationComponent from '@engine-components/RotationComponent';
import RotationUpdateComponent from '@engine-components/RotationUpdateComponent';

// engine - systems
import ComponentSystem from '@engine-systems/ComponentSystem';

/**
 * @system
 */
class RotationSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  override async update(): Promise<void> {
    const { simulationWorld } = this;
    const { entityManager, simulationTime } = simulationWorld;
    const { fixedDeltaTime } = simulationTime;

    // query entities with RotationComponent and RotationUpdateComponent
    const entities = this.getEntityQuery(
      [RotationComponent.prototype, RotationUpdateComponent.prototype],
      false,
    );

    // skip if no entities found
    if (entities.length === 0) return;

    // update rotation for each entity
    await Promise.all(
      entities.map(async (entity) => {
        const { components } = entity;
        const rotationComponent = components[RotationComponent.name] as RotationComponent; // prettier-ignore
        const rotationUpdateComponent = components[RotationUpdateComponent.name] as RotationUpdateComponent; // prettier-ignore
        const { vector: rotation } = rotationComponent;
        const {
          vector: rotationUpdate,
          isOverride,
          isPersistent,
        } = rotationUpdateComponent;
        const { x, y, z } = rotationUpdate;

        // override rotation
        if (isOverride) {
          rotation.x = x;
          rotation.y = y;
          rotation.z = z;
        }

        // add to rotation
        else {
          rotation.x += x * fixedDeltaTime;
          rotation.y += y * fixedDeltaTime;
          rotation.z += z * fixedDeltaTime;
        }

        // remove rotationUpdate component if not persistent
        if (!isPersistent) {
          this.bufferCommand(() =>
            entityManager.removeComponent(entity, RotationUpdateComponent.name),
          );
        }
      }),
    );
  }
}
export default RotationSystem;

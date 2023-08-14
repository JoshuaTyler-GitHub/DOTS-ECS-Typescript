/**
 * @imports
 */
// common
import { uid } from '@common-utils/UidUtils';

// engine
import Component from '@engine-components/Component';
import ComponentNotFoundError from '@engine-errors/ComponentNotFoundError';
import DuplicateComponentError from '@engine-errors/DuplicateComponentError';
import EntityNotFoundError from '@engine-errors/EntityNotFoundError';
import Entity from '@engine-entities/Entity';

/**
 * @class
 */
export default class EntityManager {
  /**
   * @entities
   */
  public entities: Entity[] = [];

  /**
   * @id
   */
  public readonly id: string = `EntityManager-${uid()}`;

  /**
   * @param {Entity} entity
   * @param {Component} component
   * @returns {void}
   * @throws {DuplicateComponentError}
   */
  public addComponent(entity: Entity, component: Component): void {
    const { components: entityComponents, id } = entity;

    // prevent duplicate components
    if (entityComponents.hasOwnProperty(component.name)) {
      throw new DuplicateComponentError(
        EntityManager.name,
        EntityManager.prototype.addComponent.name,
        `Failed to add component to Entity. Component [${component.name}] already exists on entity [${id}].`,
      );
    }

    // add the component to the entity
    entityComponents[component.name] = component;
  }

  /**
   * @async
   * @param {Entity} entity
   * @param {Component[]} components
   * @returns {void}
   * @throws {DuplicateComponentError}
   */
  public addComponents(entity: Entity, components: Component[]): void {
    const { components: entityComponents, id } = entity;

    // prevent duplicate components
    components.forEach((component) => {
      if (entityComponents[component.name] !== undefined) {
        throw new DuplicateComponentError(
          EntityManager.name,
          EntityManager.prototype.addComponent.name,
          `Failed to add component to Entity. Component [${component.name}] already exists on entity [${id}].`,
        );
      }
    });

    // add the components to the entity
    components.forEach((component) => {
      entityComponents[component.name] = component;
    });
  }

  /**
   * @param {Entity} entity
   * @returns {Entity}
   */
  public clone(entity: Entity): Entity {
    const { components } = entity;
    return this.create(Object.values(components));
  }

  /**
   * @param {Component[]} components
   * @returns {Entity}
   */
  public create(components: Component[]): Entity {
    const entity = new Entity();
    this.addComponents(entity, components);
    this.entities.push(entity);
    return entity;
  }

  /**
   * @param {Entity} entity
   * @returns {void}
   * @throws {EntityNotFoundError}
   */
  public destroy(entity: Entity): void {
    const { components } = entity;
    this.removeComponents(entity, Object.keys(components));
    this.destroyById(entity.id);
  }

  /**
   * @param {string} id
   * @returns {void}
   * @throws {EntityNotFoundError}
   */
  private destroyById(id: string): void {
    const { entities } = this;
    const index = entities.findIndex((entity) => entity.id === id);
    if (index === -1) {
      throw new EntityNotFoundError(
        EntityManager.name,
        EntityManager.prototype.destroyById.name,
        `No Entity was found for ID: [${id}].`,
      );
    } else {
      entities.splice(index, 1);
    }
  }

  /**
   * @async
   * @param {Component[]} queryComponents
   * @param {boolean} isExact
   * @returns {Entity[]}
   */
  public query(
    queryComponents: Component[],
    isExact: boolean = true,
  ): Entity[] {
    const { entities } = this;
    const queryComponentsCount = queryComponents.length;
    return entities.filter((entity) => {
      const { components: entityComponents } = entity;
      const entityComponentsCount = Object.keys(entityComponents).length;

      // isExact applies a check on the number of components
      // Equal number of components with an inclusive check results
      // in an exact match
      if (isExact && queryComponentsCount !== entityComponentsCount) {
        return false;
      }

      // check if the entity has all the query components
      return queryComponents.every((queryComponent) => {
        const queryComponentName = queryComponent.constructor.name;
        return entityComponents.hasOwnProperty(queryComponentName);
      });
    });
  }

  /**
   * @param {Entity} entity
   * @param {string} componentName
   * @returns {void}
   * @throws {ComponentNotFoundError}
   */
  public removeComponent(entity: Entity, componentName: string): void {
    const { components: entityComponents, id } = entity;

    // prevent remove Component calls on an Entity without a Component
    // while this does not cause an error, it is wrong within the ECS framework
    if (entityComponents[componentName] === undefined) {
      throw new ComponentNotFoundError(
        EntityManager.name,
        EntityManager.prototype.removeComponent.name,
        `Failed to remove Component from Entity. Component [${componentName}] does not exist on Entity [${id}].`,
      );
    }

    // remove the component from the entity
    delete entity.components[componentName];
  }

  /**
   * @param {Entity} entity
   * @param {string[]} componentNames
   * @returns {void}
   * @throws {ComponentNotFoundError}
   */
  public removeComponents(entity: Entity, componentNames: string[]): void {
    const { components: entityComponents, id } = entity;

    // prevent remove Component calls on an Entity without a Component
    // while this does not cause an error, it is wrong within the ECS framework
    componentNames.forEach((componentName) => {
      if (entityComponents[componentName] === undefined) {
        throw new ComponentNotFoundError(
          EntityManager.name,
          EntityManager.prototype.removeComponent.name,
          `Failed to remove Component from Entity. Component [${componentName}] does not exist on Entity [${id}].`,
        );
      }
    });

    // remove the component from the entity
    componentNames.forEach((componentName) => {
      delete entity.components[componentName];
    });
  }
}

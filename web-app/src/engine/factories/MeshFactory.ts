/**
 * @node_modules
 */
import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  Scene,
} from 'three';

/**
 * @engine
 */
import Component from '@engine-components/Component';
import PositionComponent from '@engine-components/PositionComponent';
import RotationComponent from '@engine-components/RotationComponent';
import ScaleComponent from '@engine-components/ScaleComponent';
import { GeometryType } from '@engine-enums/Geometry';
import { MaterialType } from '@engine-enums/Material';
import InvalidPrefabError from '@engine-errors/InvalidPrefabError';

/**
 * @class
 */
export default class MeshFactory {
  /**
   * @static
   * @param {Mesh} mesh
   * @returns {Component[]}
   */
  private static assignComponents(mesh: Mesh): Component[] {
    return [
      new PositionComponent(mesh.position),
      new RotationComponent(mesh.rotation),
      new ScaleComponent(mesh.scale),
    ];
  }

  /**
   * @static
   * @param {string} geometryType
   * @param {Object<string, any>} geometryParameters
   * @returns {BufferGeometry}
   * @throws {Error}
   */
  private static assignGeometry(
    geometryType: GeometryType,
    geometryParameters: { [key: string]: any } = {},
  ): BufferGeometry {
    // BoxGeometry
    if (GeometryType.BoxGeometry === geometryType) {
      try {
        return new BoxGeometry(
          geometryParameters.width,
          geometryParameters.height,
          geometryParameters.depthSegments,
          geometryParameters.widthSegments,
          geometryParameters.heightSegments,
          geometryParameters.depthSegments,
        );
      } catch (error) {
        throw new Error(`Invalid prefab geometryParameters [${JSON.stringify(geometryParameters)}].`); // prettier-ignore
      }
    }

    // Invalid
    else {
      throw new Error(`Invalid GeometryType [${geometryType}].`);
    }
  }

  /**
   * @static
   * @param {string} materialType
   * @param {Object<string, any>} materialParameters
   * @returns {Material}
   * @throws {Error}
   */
  private static assignMaterial(
    materialType: MaterialType,
    materialParameters: { [key: string]: any } = {},
  ): Material {
    // MeshBasicMaterial
    if (MaterialType.MeshBasicMaterial === materialType) {
      try {
        return new MeshBasicMaterial(materialParameters);
      } catch (error) {
        throw new Error(`Invalid prefab materialParameters [${JSON.stringify(materialParameters)}].`); // prettier-ignore
      }
    }

    // Invalid
    else {
      throw new Error(`Invalid MaterialType [${materialType}].`);
    }
  }

  /**
   * @static
   * @param {Scene} scene
   * @param {string} prefabJSON
   * @returns {Component[]}
   * @throws {InvalidPrefabError}
   */
  public static build(scene: Scene, prefabJSON: string): Component[] {
    try {
      // parse prefabJSON
      const prefab = JSON.parse(prefabJSON);
      const { geometry: geometryParameters, material: materialParameters } =
        prefab;

      // assign geometry
      const { type: geometryType } = geometryParameters;
      const geometry = MeshFactory.assignGeometry(
        geometryType,
        geometryParameters,
      );

      // assign material
      const { type: materialType } = materialParameters;
      const material = MeshFactory.assignMaterial(
        materialType,
        materialParameters,
      );

      // build mesh
      const mesh = new Mesh(geometry, material);

      // assign components
      const components = MeshFactory.assignComponents(mesh);

      // add mesh into scene
      scene.add(mesh);

      // return components to be added to entity
      return components;
    } catch (error) {
      throw new InvalidPrefabError(
        MeshFactory.name,
        MeshFactory.build.name,
        `Invalid prefabJSON [${prefabJSON}]. ${JSON.stringify(error)}`,
      );
    }
  }
}

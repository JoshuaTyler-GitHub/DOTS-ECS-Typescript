/**
 * @node_modules
 */
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three';

/**
 * @class
 */
export default class SkyBoxFactory {
  private static loader = new TextureLoader();

  /**
   * @static
   * @param {string} textureSource
   * @param {Function} onProgress
   * @returns {Promise<Texture>}
   * @throws {Error}
   */
  public static async build(
    textureSource: string,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
  ): Promise<Texture> {
    const texture = await SkyBoxFactory.loader.loadAsync(
      textureSource,
      onProgress,
    );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = EquirectangularReflectionMapping;
    return texture;
  }
}

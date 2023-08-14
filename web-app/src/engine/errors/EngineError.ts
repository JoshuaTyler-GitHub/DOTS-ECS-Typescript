/**
 * @common
 */
import SerializableError from '@common-errors/SerializableError';

/**
 * @class
 */
export default class EngineError extends SerializableError {
  // TODO: generate a file with engine error specific properties
  // - entities: entity id, component id, etc
  // - systems: cycle times, backpressure, etc
  // - worlds: systems, entities, etc
}

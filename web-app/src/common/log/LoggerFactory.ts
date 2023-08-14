// log
import Logger from './Logger';
import LoggerInstance from './LoggerInstance';

/**
 * @class
 */
export default class LoggerFactory {
  /**
   * @static
   * @param {string} className
   * @returns {InstancedLogger} logger
   */
  static create(className: string): LoggerInstance {
    return new LoggerInstance(
      className,
      Logger.bypass,
      Logger.debug,
      Logger.error,
      Logger.info,
      Logger.warn,
    );
  }
}

/**
 * @constants
 */
const PREFIX_BYPASS: string = '[DEBUG]';
const PREFIX_DEBUG: string = '[DEBUG]';
const PREFIX_ERROR: string = '[ERROR]';
const PREFIX_INFO: string = '[INFO]';
const PREFIX_WARN: string = '[WARN]';

/**
 * @class
 */
export default class Logger {
  static isDebugActive: boolean = true;
  static isErrorActive: boolean = true;
  static isInfoActive: boolean = true;
  static isWarnActive: boolean = true;

  /*====================
  logging
  ====================*/
  /**
   * @static
   * @param {String} className
   * @param {Array<any>} args
   * @returns {void} void
   */
  static bypass(className: string, ...args: Array<any>): void {
    const formattedClassName = Logger.formatClassName(className);
    const logObjects = args instanceof Array ? [...args] : [args];
    console.log(PREFIX_BYPASS, formattedClassName, ...logObjects); // NOSONAR
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static debug(className: string, ...args: Array<any>): void {
    if (Logger.isDebugActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.debug(PREFIX_DEBUG, formattedClassName, ...logObjects); // NOSONAR
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static error(className: string, ...args: Array<any>): void {
    if (Logger.isErrorActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.error(PREFIX_ERROR, formattedClassName, ...logObjects); // NOSONAR
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static info(className: string, ...args: Array<any>): void {
    if (Logger.isInfoActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.info(PREFIX_INFO, formattedClassName, ...logObjects); // NOSONAR
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static warn(className: string, ...args: Array<any>): void {
    if (Logger.isWarnActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.warn(PREFIX_WARN, formattedClassName, ...logObjects); // NOSONAR
    }
  }

  /*====================
  formatting
  ====================*/
  /**
   * @static
   * @param {String} className
   * @returns {String} formattedClassName
   */
  static formatClassName(className: string): string {
    return `[${className}]`;
  }

  /**
   * @static
   * @param {String} prefix
   * @param {String} className
   * @param {Array<any>} args
   * @returns {String} message
   */
  static formatMessage(
    prefix: string,
    className: string,
    ...args: Array<any>
  ): string {
    const message = [prefix, className];
    args.forEach((arg) => message.push(JSON.stringify(arg)));
    return message.join(', ');
  }
}

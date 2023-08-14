/**
 * @class
 */
export default class SerializableError extends Error {
  /**
   * @constructor
   */
  constructor(
    className: string,
    methodName: string,
    errorMessage: string,
    logLevel: string = 'error',
  ) {
    super(errorMessage);
    this.className = className;
    this.methodName = methodName;
    this.errorMessage = errorMessage;
    this.id = this.constructor.name;
    this.logLevel = logLevel;
  }

  /**
   * The name of the class that threw the error
   * @type {string}
   */
  public className: string;

  /**
   * The name of the method that threw the error
   * @type {string}
   */
  public methodName: string;

  /**
   * The raw error message to be formatted as a serialized error
   * @type {string}
   */
  public errorMessage: string;

  /**
   * The id of the error, used to identify the error type
   * this pulls the class name of the error extending this class
   * e.g. NetworkError extends SerializableError, id = NetworkError
   * @type {string}
   */
  public id: string;

  /**
   * The log level to use when logging this error (debug, info, warn, error)
   * @type {string}
   */
  public logLevel: string;

  /**
   * The timestamp of when this serializable error was created
   * @type {string}
   * @readonly
   */
  public readonly timestamp: string = new Date().toISOString();

  /**
   * formatted error message: "[timestamp] [id] [className.methodName()] [errorMessage]"
   * @returns {string}
   */
  public serialize(): string {
    return String(
      `[${this.timestamp}] [${this.id}] [${this.className}.${this.methodName}()] [${this.errorMessage}]`,
    );
  }
}
